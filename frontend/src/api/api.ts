/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  DtoCreateArticleRequest,
  DtoCreateCategoryRequest,
  DtoCreatePageRequest,
  DtoCreateTagRequest,
  DtoErrorResponse,
  DtoLoginRequest,
  DtoRefreshTokenRequest,
  DtoUpdateArticleRequest,
  DtoUpdateCategoryRequest,
  DtoUpdatePageRequest,
  MiddlewareErrorResponse,
  ModelsDocument,
  V1ActivitiesDetailData,
  V1ActivitiesDetailParams,
  V1ActivitiesListData,
  V1ActivitiesListParams,
  V1AdminActivitiesCreateData,
  V1AdminActivitiesDeleteData,
  V1AdminActivitiesDeleteParams,
  V1AdminActivitiesPublishCreateData,
  V1AdminActivitiesPublishCreateParams,
  V1AdminActivitiesUpdateData,
  V1AdminActivitiesUpdateParams,
  V1AdminArticlesApproveCreateData,
  V1AdminArticlesApproveCreateParams,
  V1AdminArticlesCreateData,
  V1AdminArticlesDeleteData,
  V1AdminArticlesDeleteParams,
  V1AdminArticlesDetailData,
  V1AdminArticlesDetailParams,
  V1AdminArticlesListData,
  V1AdminArticlesListParams,
  V1AdminArticlesPublishCreateData,
  V1AdminArticlesPublishCreateParams,
  V1AdminArticlesRejectCreateData,
  V1AdminArticlesRejectCreateParams,
  V1AdminArticlesSubmitCreateData,
  V1AdminArticlesSubmitCreateParams,
  V1AdminArticlesUnpublishCreateData,
  V1AdminArticlesUnpublishCreateParams,
  V1AdminArticlesUpdateData,
  V1AdminArticlesUpdateParams,
  V1AdminCategoriesCreateData,
  V1AdminCategoriesDeleteData,
  V1AdminCategoriesDeleteParams,
  V1AdminCategoriesUpdateData,
  V1AdminCategoriesUpdateParams,
  V1AdminDocumentsCreateData,
  V1AdminDocumentsDeleteData,
  V1AdminDocumentsDeleteParams,
  V1AdminDocumentsListData,
  V1AdminDocumentsListParams,
  V1AdminDocumentsUpdateData,
  V1AdminDocumentsUpdateParams,
  V1AdminPagesCreateData,
  V1AdminPagesDeleteData,
  V1AdminPagesDeleteParams,
  V1AdminPagesDetailData,
  V1AdminPagesDetailParams,
  V1AdminPagesUpdateData,
  V1AdminPagesUpdateParams,
  V1AdminTagsCreateData,
  V1AdminTagsDeleteData,
  V1AdminTagsDeleteParams,
  V1ArticlesDetailData,
  V1ArticlesDetailParams,
  V1ArticlesListData,
  V1ArticlesListParams,
  V1ArticlesRelatedListData,
  V1ArticlesRelatedListParams,
  V1AuthLoginCreateData,
  V1AuthLogoutCreateData,
  V1AuthMeListData,
  V1AuthRefreshCreateData,
  V1CategoriesDetailData,
  V1CategoriesDetailParams,
  V1CategoriesListData,
  V1CategoriesMenuListData,
  V1DocumentsDetailData,
  V1DocumentsDetailParams,
  V1DocumentsListData,
  V1DocumentsListParams,
  V1HealthzListData,
  V1HomeListData,
  V1HomeListParams,
  V1PagesDetailData,
  V1PagesDetailParams,
  V1PagesListData,
  V1PagesListParams,
  V1SearchListData,
  V1SearchListParams,
  V1TagsDetailData,
  V1TagsDetailParams,
  V1TagsListData,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Get list of published activities with pagination
   *
   * @tags Activities
   * @name V1ActivitiesList
   * @summary List all activities
   * @request GET:/api/v1/activities
   */
  v1ActivitiesList = (
    query: V1ActivitiesListParams,
    params: RequestParams = {},
  ) =>
    this.request<V1ActivitiesListData, any>({
      path: `/api/v1/activities`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * @description Get a single activity by its slug
   *
   * @tags Activities
   * @name V1ActivitiesDetail
   * @summary Get activity by slug
   * @request GET:/api/v1/activities/{slug}
   */
  v1ActivitiesDetail = (
    { slug, ...query }: V1ActivitiesDetailParams,
    params: RequestParams = {},
  ) =>
    this.request<V1ActivitiesDetailData, MiddlewareErrorResponse>({
      path: `/api/v1/activities/${slug}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * @description Create a new activity post (Admin only)
   *
   * @tags Activities (Admin)
   * @name V1AdminActivitiesCreate
   * @summary Create activity
   * @request POST:/api/v1/admin/activities
   * @secure
   */
  v1AdminActivitiesCreate = (
    activity: DtoCreateArticleRequest,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminActivitiesCreateData, MiddlewareErrorResponse>({
      path: `/api/v1/admin/activities`,
      method: "POST",
      body: activity,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing activity (Admin only)
   *
   * @tags Activities (Admin)
   * @name V1AdminActivitiesUpdate
   * @summary Update activity
   * @request PUT:/api/v1/admin/activities/{id}
   * @secure
   */
  v1AdminActivitiesUpdate = (
    { id, ...query }: V1AdminActivitiesUpdateParams,
    activity: DtoUpdateArticleRequest,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminActivitiesUpdateData, MiddlewareErrorResponse>({
      path: `/api/v1/admin/activities/${id}`,
      method: "PUT",
      body: activity,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Delete an activity (Admin only)
   *
   * @tags Activities (Admin)
   * @name V1AdminActivitiesDelete
   * @summary Delete activity
   * @request DELETE:/api/v1/admin/activities/{id}
   * @secure
   */
  v1AdminActivitiesDelete = (
    { id, ...query }: V1AdminActivitiesDeleteParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminActivitiesDeleteData, MiddlewareErrorResponse>({
      path: `/api/v1/admin/activities/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Publish an activity to make it public
   *
   * @tags Activities (Admin)
   * @name V1AdminActivitiesPublishCreate
   * @summary Publish activity
   * @request POST:/api/v1/admin/activities/{id}/publish
   * @secure
   */
  v1AdminActivitiesPublishCreate = (
    { id, ...query }: V1AdminActivitiesPublishCreateParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminActivitiesPublishCreateData, MiddlewareErrorResponse>({
      path: `/api/v1/admin/activities/${id}/publish`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get paginated list of articles with filters (requires authentication)
   *
   * @tags Articles
   * @name V1AdminArticlesList
   * @summary List articles (Admin)
   * @request GET:/api/v1/admin/articles
   * @secure
   */
  v1AdminArticlesList = (
    query: V1AdminArticlesListParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminArticlesListData, MiddlewareErrorResponse>({
      path: `/api/v1/admin/articles`,
      method: "GET",
      query: query,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new article with title, content, category, and tags. Requires authentication.
   *
   * @tags Articles (Admin)
   * @name V1AdminArticlesCreate
   * @summary Create a new article
   * @request POST:/api/v1/admin/articles
   * @secure
   */
  v1AdminArticlesCreate = (
    article: DtoCreateArticleRequest,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminArticlesCreateData, MiddlewareErrorResponse>({
      path: `/api/v1/admin/articles`,
      method: "POST",
      body: article,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a single article by ID (requires authentication)
   *
   * @tags Articles
   * @name V1AdminArticlesDetail
   * @summary Get article by ID (Admin)
   * @request GET:/api/v1/admin/articles/{id}
   * @secure
   */
  v1AdminArticlesDetail = (
    { id, ...query }: V1AdminArticlesDetailParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminArticlesDetailData, MiddlewareErrorResponse>({
      path: `/api/v1/admin/articles/${id}`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update article details including title, content, category, and featured image. Requires authentication.
   *
   * @tags Articles (Admin)
   * @name V1AdminArticlesUpdate
   * @summary Update an existing article
   * @request PUT:/api/v1/admin/articles/{id}
   * @secure
   */
  v1AdminArticlesUpdate = (
    { id, ...query }: V1AdminArticlesUpdateParams,
    article: DtoUpdateArticleRequest,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminArticlesUpdateData, MiddlewareErrorResponse>({
      path: `/api/v1/admin/articles/${id}`,
      method: "PUT",
      body: article,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Permanently delete an article by ID. Requires Admin or Editor role.
   *
   * @tags Articles (Admin)
   * @name V1AdminArticlesDelete
   * @summary Delete an article
   * @request DELETE:/api/v1/admin/articles/{id}
   * @secure
   */
  v1AdminArticlesDelete = (
    { id, ...query }: V1AdminArticlesDeleteParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminArticlesDeleteData, MiddlewareErrorResponse>({
      path: `/api/v1/admin/articles/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Change article status to published
   *
   * @tags Articles
   * @name V1AdminArticlesApproveCreate
   * @summary Approve article
   * @request POST:/api/v1/admin/articles/{id}/approve
   * @secure
   */
  v1AdminArticlesApproveCreate = (
    { id, ...query }: V1AdminArticlesApproveCreateParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminArticlesApproveCreateData, DtoErrorResponse>({
      path: `/api/v1/admin/articles/${id}/approve`,
      method: "POST",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Change article status to published
   *
   * @tags Articles
   * @name V1AdminArticlesPublishCreate
   * @summary Publish article
   * @request POST:/api/v1/admin/articles/{id}/publish
   * @secure
   */
  v1AdminArticlesPublishCreate = (
    { id, ...query }: V1AdminArticlesPublishCreateParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminArticlesPublishCreateData, DtoErrorResponse>({
      path: `/api/v1/admin/articles/${id}/publish`,
      method: "POST",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Change article status to rejected
   *
   * @tags Articles
   * @name V1AdminArticlesRejectCreate
   * @summary Reject article
   * @request POST:/api/v1/admin/articles/{id}/reject
   * @secure
   */
  v1AdminArticlesRejectCreate = (
    { id, ...query }: V1AdminArticlesRejectCreateParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminArticlesRejectCreateData, DtoErrorResponse>({
      path: `/api/v1/admin/articles/${id}/reject`,
      method: "POST",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Change article status to under_review
   *
   * @tags Articles
   * @name V1AdminArticlesSubmitCreate
   * @summary Submit article for review
   * @request POST:/api/v1/admin/articles/{id}/submit
   * @secure
   */
  v1AdminArticlesSubmitCreate = (
    { id, ...query }: V1AdminArticlesSubmitCreateParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminArticlesSubmitCreateData, DtoErrorResponse>({
      path: `/api/v1/admin/articles/${id}/submit`,
      method: "POST",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Change article status to hidden
   *
   * @tags Articles
   * @name V1AdminArticlesUnpublishCreate
   * @summary Unpublish article
   * @request POST:/api/v1/admin/articles/{id}/unpublish
   * @secure
   */
  v1AdminArticlesUnpublishCreate = (
    { id, ...query }: V1AdminArticlesUnpublishCreateParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminArticlesUnpublishCreateData, DtoErrorResponse>({
      path: `/api/v1/admin/articles/${id}/unpublish`,
      method: "POST",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new category (admin only)
   *
   * @tags Categories
   * @name V1AdminCategoriesCreate
   * @summary Create a new category
   * @request POST:/api/v1/admin/categories
   * @secure
   */
  v1AdminCategoriesCreate = (
    category: DtoCreateCategoryRequest,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminCategoriesCreateData, DtoErrorResponse>({
      path: `/api/v1/admin/categories`,
      method: "POST",
      body: category,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing category (admin only)
   *
   * @tags Categories
   * @name V1AdminCategoriesUpdate
   * @summary Update a category
   * @request PUT:/api/v1/admin/categories/{id}
   * @secure
   */
  v1AdminCategoriesUpdate = (
    { id, ...query }: V1AdminCategoriesUpdateParams,
    category: DtoUpdateCategoryRequest,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminCategoriesUpdateData, DtoErrorResponse>({
      path: `/api/v1/admin/categories/${id}`,
      method: "PUT",
      body: category,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Delete a category by ID (admin only)
   *
   * @tags Categories
   * @name V1AdminCategoriesDelete
   * @summary Delete a category
   * @request DELETE:/api/v1/admin/categories/{id}
   * @secure
   */
  v1AdminCategoriesDelete = (
    { id, ...query }: V1AdminCategoriesDeleteParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminCategoriesDeleteData, DtoErrorResponse>({
      path: `/api/v1/admin/categories/${id}`,
      method: "DELETE",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get all documents with pagination
   *
   * @tags documents
   * @name V1AdminDocumentsList
   * @summary List all documents (Admin)
   * @request GET:/api/v1/admin/documents
   * @secure
   */
  v1AdminDocumentsList = (
    query: V1AdminDocumentsListParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminDocumentsListData, DtoErrorResponse>({
      path: `/api/v1/admin/documents`,
      method: "GET",
      query: query,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new document
   *
   * @tags documents
   * @name V1AdminDocumentsCreate
   * @summary Create document (Admin)
   * @request POST:/api/v1/admin/documents
   * @secure
   */
  v1AdminDocumentsCreate = (
    document: ModelsDocument,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminDocumentsCreateData, DtoErrorResponse>({
      path: `/api/v1/admin/documents`,
      method: "POST",
      body: document,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing document
   *
   * @tags documents
   * @name V1AdminDocumentsUpdate
   * @summary Update document (Admin)
   * @request PUT:/api/v1/admin/documents/{id}
   * @secure
   */
  v1AdminDocumentsUpdate = (
    { id, ...query }: V1AdminDocumentsUpdateParams,
    document: ModelsDocument,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminDocumentsUpdateData, DtoErrorResponse>({
      path: `/api/v1/admin/documents/${id}`,
      method: "PUT",
      body: document,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Delete a document
   *
   * @tags documents
   * @name V1AdminDocumentsDelete
   * @summary Delete document (Admin)
   * @request DELETE:/api/v1/admin/documents/{id}
   * @secure
   */
  v1AdminDocumentsDelete = (
    { id, ...query }: V1AdminDocumentsDeleteParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminDocumentsDeleteData, DtoErrorResponse>({
      path: `/api/v1/admin/documents/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new page (admin only)
   *
   * @tags Pages
   * @name V1AdminPagesCreate
   * @summary Create page
   * @request POST:/api/v1/admin/pages
   * @secure
   */
  v1AdminPagesCreate = (
    page: DtoCreatePageRequest,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminPagesCreateData, DtoErrorResponse>({
      path: `/api/v1/admin/pages`,
      method: "POST",
      body: page,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a single page by its ID (admin only)
   *
   * @tags Pages
   * @name V1AdminPagesDetail
   * @summary Get page by ID
   * @request GET:/api/v1/admin/pages/{id}
   * @secure
   */
  v1AdminPagesDetail = (
    { id, ...query }: V1AdminPagesDetailParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminPagesDetailData, DtoErrorResponse>({
      path: `/api/v1/admin/pages/${id}`,
      method: "GET",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing page (admin only)
   *
   * @tags Pages
   * @name V1AdminPagesUpdate
   * @summary Update page
   * @request PUT:/api/v1/admin/pages/{id}
   * @secure
   */
  v1AdminPagesUpdate = (
    { id, ...query }: V1AdminPagesUpdateParams,
    page: DtoUpdatePageRequest,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminPagesUpdateData, DtoErrorResponse>({
      path: `/api/v1/admin/pages/${id}`,
      method: "PUT",
      body: page,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Delete a page (admin only)
   *
   * @tags Pages
   * @name V1AdminPagesDelete
   * @summary Delete page
   * @request DELETE:/api/v1/admin/pages/{id}
   * @secure
   */
  v1AdminPagesDelete = (
    { id, ...query }: V1AdminPagesDeleteParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminPagesDeleteData, DtoErrorResponse>({
      path: `/api/v1/admin/pages/${id}`,
      method: "DELETE",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new tag (admin only)
   *
   * @tags Tags
   * @name V1AdminTagsCreate
   * @summary Create a new tag
   * @request POST:/api/v1/admin/tags
   * @secure
   */
  v1AdminTagsCreate = (tag: DtoCreateTagRequest, params: RequestParams = {}) =>
    this.request<V1AdminTagsCreateData, DtoErrorResponse>({
      path: `/api/v1/admin/tags`,
      method: "POST",
      body: tag,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Delete a tag by ID (admin only)
   *
   * @tags Tags
   * @name V1AdminTagsDelete
   * @summary Delete a tag
   * @request DELETE:/api/v1/admin/tags/{id}
   * @secure
   */
  v1AdminTagsDelete = (
    { id, ...query }: V1AdminTagsDeleteParams,
    params: RequestParams = {},
  ) =>
    this.request<V1AdminTagsDeleteData, DtoErrorResponse>({
      path: `/api/v1/admin/tags/${id}`,
      method: "DELETE",
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get paginated list of published articles with filters
   *
   * @tags Articles
   * @name V1ArticlesList
   * @summary List published articles (Public)
   * @request GET:/api/v1/articles
   */
  v1ArticlesList = (query: V1ArticlesListParams, params: RequestParams = {}) =>
    this.request<V1ArticlesListData, MiddlewareErrorResponse>({
      path: `/api/v1/articles`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a published article by its slug
   *
   * @tags Articles
   * @name V1ArticlesDetail
   * @summary Get article by slug (Public)
   * @request GET:/api/v1/articles/{slug}
   */
  v1ArticlesDetail = (
    { slug, ...query }: V1ArticlesDetailParams,
    params: RequestParams = {},
  ) =>
    this.request<V1ArticlesDetailData, MiddlewareErrorResponse>({
      path: `/api/v1/articles/${slug}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get articles related to the specified article
   *
   * @tags Articles
   * @name V1ArticlesRelatedList
   * @summary Get related articles
   * @request GET:/api/v1/articles/{slug}/related
   */
  v1ArticlesRelatedList = (
    { slug, ...query }: V1ArticlesRelatedListParams,
    params: RequestParams = {},
  ) =>
    this.request<V1ArticlesRelatedListData, DtoErrorResponse>({
      path: `/api/v1/articles/${slug}/related`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Authenticate user and return JWT tokens
   *
   * @tags auth
   * @name V1AuthLoginCreate
   * @summary User login
   * @request POST:/api/v1/auth/login
   */
  v1AuthLoginCreate = (request: DtoLoginRequest, params: RequestParams = {}) =>
    this.request<V1AuthLoginCreateData, MiddlewareErrorResponse>({
      path: `/api/v1/auth/login`,
      method: "POST",
      body: request,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Invalidate refresh token
   *
   * @tags auth
   * @name V1AuthLogoutCreate
   * @summary User logout
   * @request POST:/api/v1/auth/logout
   * @secure
   */
  v1AuthLogoutCreate = (
    request: DtoRefreshTokenRequest,
    params: RequestParams = {},
  ) =>
    this.request<V1AuthLogoutCreateData, MiddlewareErrorResponse>({
      path: `/api/v1/auth/logout`,
      method: "POST",
      body: request,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get authenticated user information
   *
   * @tags auth
   * @name V1AuthMeList
   * @summary Get current user
   * @request GET:/api/v1/auth/me
   * @secure
   */
  v1AuthMeList = (params: RequestParams = {}) =>
    this.request<V1AuthMeListData, MiddlewareErrorResponse>({
      path: `/api/v1/auth/me`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get new access token using refresh token
   *
   * @tags auth
   * @name V1AuthRefreshCreate
   * @summary Refresh access token
   * @request POST:/api/v1/auth/refresh
   */
  v1AuthRefreshCreate = (
    request: DtoRefreshTokenRequest,
    params: RequestParams = {},
  ) =>
    this.request<V1AuthRefreshCreateData, MiddlewareErrorResponse>({
      path: `/api/v1/auth/refresh`,
      method: "POST",
      body: request,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get all categories (public access)
   *
   * @tags Categories
   * @name V1CategoriesList
   * @summary List all categories
   * @request GET:/api/v1/categories
   */
  v1CategoriesList = (params: RequestParams = {}) =>
    this.request<V1CategoriesListData, DtoErrorResponse>({
      path: `/api/v1/categories`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Returns hierarchical category tree for navigation menu
   *
   * @tags Categories
   * @name V1CategoriesMenuList
   * @summary Get category tree for menu
   * @request GET:/api/v1/categories/menu
   */
  v1CategoriesMenuList = (params: RequestParams = {}) =>
    this.request<V1CategoriesMenuListData, DtoErrorResponse>({
      path: `/api/v1/categories/menu`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a single category by its slug (public access)
   *
   * @tags Categories
   * @name V1CategoriesDetail
   * @summary Get category by slug
   * @request GET:/api/v1/categories/{slug}
   */
  v1CategoriesDetail = (
    { slug, ...query }: V1CategoriesDetailParams,
    params: RequestParams = {},
  ) =>
    this.request<V1CategoriesDetailData, DtoErrorResponse>({
      path: `/api/v1/categories/${slug}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get published documents with pagination and filtering
   *
   * @tags documents
   * @name V1DocumentsList
   * @summary List documents (Public)
   * @request GET:/api/v1/documents
   */
  v1DocumentsList = (
    query: V1DocumentsListParams,
    params: RequestParams = {},
  ) =>
    this.request<V1DocumentsListData, DtoErrorResponse>({
      path: `/api/v1/documents`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a published document by slug and increment view count
   *
   * @tags documents
   * @name V1DocumentsDetail
   * @summary Get document by slug (Public)
   * @request GET:/api/v1/documents/{slug}
   */
  v1DocumentsDetail = (
    { slug, ...query }: V1DocumentsDetailParams,
    params: RequestParams = {},
  ) =>
    this.request<V1DocumentsDetailData, DtoErrorResponse>({
      path: `/api/v1/documents/${slug}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Check if the API is running
   *
   * @tags health
   * @name V1HealthzList
   * @summary Health check
   * @request GET:/api/v1/healthz
   */
  v1HealthzList = (params: RequestParams = {}) =>
    this.request<V1HealthzListData, any>({
      path: `/api/v1/healthz`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * @description Get aggregated data for home page sections by category slugs
   *
   * @tags Home
   * @name V1HomeList
   * @summary Get home page data
   * @request GET:/api/v1/home
   */
  v1HomeList = (query: V1HomeListParams, params: RequestParams = {}) =>
    this.request<V1HomeListData, MiddlewareErrorResponse>({
      path: `/api/v1/home`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get list of pages with optional filters
   *
   * @tags Pages
   * @name V1PagesList
   * @summary List pages
   * @request GET:/api/v1/pages
   */
  v1PagesList = (query: V1PagesListParams, params: RequestParams = {}) =>
    this.request<V1PagesListData, any>({
      path: `/api/v1/pages`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a single page by its slug (public endpoint)
   *
   * @tags Pages
   * @name V1PagesDetail
   * @summary Get page by slug
   * @request GET:/api/v1/pages/{slug}
   */
  v1PagesDetail = (
    { slug, ...query }: V1PagesDetailParams,
    params: RequestParams = {},
  ) =>
    this.request<V1PagesDetailData, DtoErrorResponse>({
      path: `/api/v1/pages/${slug}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Search articles by keyword in title, content, and excerpt
   *
   * @tags Search
   * @name V1SearchList
   * @summary Search articles
   * @request GET:/api/v1/search
   */
  v1SearchList = (query: V1SearchListParams, params: RequestParams = {}) =>
    this.request<V1SearchListData, MiddlewareErrorResponse>({
      path: `/api/v1/search`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get all tags (public access)
   *
   * @tags Tags
   * @name V1TagsList
   * @summary List all tags
   * @request GET:/api/v1/tags
   */
  v1TagsList = (params: RequestParams = {}) =>
    this.request<V1TagsListData, DtoErrorResponse>({
      path: `/api/v1/tags`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a single tag by its slug (public access)
   *
   * @tags Tags
   * @name V1TagsDetail
   * @summary Get tag by slug
   * @request GET:/api/v1/tags/{slug}
   */
  v1TagsDetail = (
    { slug, ...query }: V1TagsDetailParams,
    params: RequestParams = {},
  ) =>
    this.request<V1TagsDetailData, DtoErrorResponse>({
      path: `/api/v1/tags/${slug}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
