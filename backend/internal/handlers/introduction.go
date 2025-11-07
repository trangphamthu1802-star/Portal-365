package handlers

import (
"database/sql"
"net/http"

"github.com/gin-gonic/gin"
"github.com/thieugt95/portal-365/backend/internal/database"
"github.com/thieugt95/portal-365/backend/internal/dto"
"github.com/thieugt95/portal-365/backend/internal/models"
)

type IntroductionHandler struct {
repos *database.Repositories
}

func NewIntroductionHandler(repos *database.Repositories) *IntroductionHandler {
return &IntroductionHandler{repos: repos}
}

func (h *IntroductionHandler) ListIntroductionPages(c *gin.Context) {
ctx := c.Request.Context()
group := "introduction"
status := string(models.PageStatusPublished)

pages, err := h.repos.Pages.List(ctx, &group, &status)
if err != nil {
c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
Error: dto.ErrorDetail{
Code:    "INTERNAL_ERROR",
Message: "Failed to retrieve introduction pages",
},
})
return
}

type IntroMenuItem struct {
Key   string `json:"key"`
Title string `json:"title"`
Slug  string `json:"slug"`
Order int    `json:"order"`
}

items := make([]IntroMenuItem, len(pages))
for i, page := range pages {
items[i] = IntroMenuItem{
Key:   page.Key,
Title: page.Title,
Slug:  page.Slug,
Order: page.Order,
}
}

c.JSON(http.StatusOK, dto.SuccessResponse{Data: items})
}

func (h *IntroductionHandler) GetIntroductionPage(c *gin.Context) {
ctx := c.Request.Context()
key := c.Param("key")

page, err := h.repos.Pages.GetByGroupAndKey(ctx, "introduction", key)
if err != nil {
if err == sql.ErrNoRows {
c.JSON(http.StatusNotFound, dto.ErrorResponse{
Error: dto.ErrorDetail{
Code:    "NOT_FOUND",
Message: "Introduction page not found",
},
})
return
}
c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
Error: dto.ErrorDetail{
Code:    "INTERNAL_ERROR",
Message: "Failed to retrieve introduction page",
},
})
return
}

if page.Status != models.PageStatusPublished {
c.JSON(http.StatusNotFound, dto.ErrorResponse{
Error: dto.ErrorDetail{
Code:    "NOT_FOUND",
Message: "Introduction page not found or not published",
},
})
return
}

go h.repos.Pages.IncrementViewCount(c.Request.Context(), page.ID)
c.JSON(http.StatusOK, dto.SuccessResponse{Data: page})
}

func (h *IntroductionHandler) ListIntroductionPagesAdmin(c *gin.Context) {
ctx := c.Request.Context()
group := "introduction"
pages, err := h.repos.Pages.List(ctx, &group, nil)
if err != nil {
c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
Error: dto.ErrorDetail{
Code:    "INTERNAL_ERROR",
Message: "Failed to retrieve introduction pages",
},
})
return
}
c.JSON(http.StatusOK, dto.SuccessResponse{Data: pages})
}

func (h *IntroductionHandler) UpdateIntroductionPage(c *gin.Context) {
ctx := c.Request.Context()
key := c.Param("key")

validKeys := map[string]bool{
"history": true, "organization": true, "leadership": true, "achievements": true,
}
if !validKeys[key] {
c.JSON(http.StatusBadRequest, dto.ErrorResponse{
Error: dto.ErrorDetail{Code: "INVALID_KEY", Message: "Invalid introduction page key"},
})
return
}

var req dto.UpdateIntroPageRequest
if err := c.ShouldBindJSON(&req); err != nil {
c.JSON(http.StatusBadRequest, dto.ErrorResponse{
Error: dto.ErrorDetail{Code: "INVALID_INPUT", Message: err.Error()},
})
return
}

if req.Status != nil {
if *req.Status != string(models.PageStatusDraft) && *req.Status != string(models.PageStatusPublished) {
c.JSON(http.StatusBadRequest, dto.ErrorResponse{
Error: dto.ErrorDetail{Code: "INVALID_STATUS", Message: "Status must be draft or published"},
})
return
}
}

if req.Title != nil && len(*req.Title) > 200 {
c.JSON(http.StatusBadRequest, dto.ErrorResponse{
Error: dto.ErrorDetail{Code: "INVALID_TITLE", Message: "Title must not exceed 200 characters"},
})
return
}

existingPage, err := h.repos.Pages.GetByGroupAndKey(ctx, "introduction", key)
if err != nil {
if err == sql.ErrNoRows {
c.JSON(http.StatusNotFound, dto.ErrorResponse{
Error: dto.ErrorDetail{Code: "NOT_FOUND", Message: "Introduction page not found"},
})
return
}
c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
Error: dto.ErrorDetail{Code: "INTERNAL_ERROR", Message: "Failed to retrieve introduction page"},
})
return
}

updatePage := &models.Page{
Title: existingPage.Title, Content: existingPage.Content, Status: existingPage.Status,
Order: existingPage.Order, HeroImageURL: existingPage.HeroImageURL,
SeoTitle: existingPage.SeoTitle, SeoDescription: existingPage.SeoDescription,
}

if req.Title != nil { updatePage.Title = *req.Title }
if req.Content != nil { updatePage.Content = *req.Content }
if req.Status != nil { updatePage.Status = models.PageStatus(*req.Status) }
if req.Order != nil { updatePage.Order = *req.Order }
updatePage.HeroImageURL = req.HeroImageURL
updatePage.SeoTitle = req.SeoTitle
updatePage.SeoDescription = req.SeoDescription

if err := h.repos.Pages.UpdateByKey(ctx, "introduction", key, updatePage); err != nil {
c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
Error: dto.ErrorDetail{Code: "INTERNAL_ERROR", Message: "Failed to update introduction page"},
})
return
}

updatedPage, err := h.repos.Pages.GetByGroupAndKey(ctx, "introduction", key)
if err != nil {
c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
Error: dto.ErrorDetail{Code: "INTERNAL_ERROR", Message: "Failed to retrieve updated page"},
})
return
}

c.JSON(http.StatusOK, dto.SuccessResponse{Data: updatedPage})
}
