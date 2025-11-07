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
  BannersCreateData,
  BannersDeleteData,
  BannersDeleteParams,
  BannersDetailData,
  BannersDetailParams,
  BannersListData,
  BannersListParams,
  BannersUpdateData,
  BannersUpdateParams,
  DtoErrorResponse,
  MediaCreateData,
  MediaDeleteData,
  MediaDeleteParams,
  MediaDetailData,
  MediaDetailParams,
  MediaListData,
  MediaListParams,
  MediaUpdateData,
  MediaUpdateParams,
  MediaUploadCreateData,
  ModelsBanner,
  ModelsMediaItem,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Admin<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Get list of all banners with filters (admin only)
   *
   * @tags Banners
   * @name BannersList
   * @summary List all banners (Admin)
   * @request GET:/admin/banners
   * @secure
   */
  bannersList = (query: BannersListParams, params: RequestParams = {}) =>
    this.request<BannersListData, DtoErrorResponse>({
      path: `/admin/banners`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new banner (admin only)
   *
   * @tags Banners
   * @name BannersCreate
   * @summary Create banner (Admin)
   * @request POST:/admin/banners
   * @secure
   */
  bannersCreate = (banner: ModelsBanner, params: RequestParams = {}) =>
    this.request<BannersCreateData, DtoErrorResponse>({
      path: `/admin/banners`,
      method: "POST",
      body: banner,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get single banner by ID (admin only)
   *
   * @tags Banners
   * @name BannersDetail
   * @summary Get banner by ID (Admin)
   * @request GET:/admin/banners/{id}
   * @secure
   */
  bannersDetail = (
    { id, ...query }: BannersDetailParams,
    params: RequestParams = {},
  ) =>
    this.request<BannersDetailData, DtoErrorResponse>({
      path: `/admin/banners/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing banner (admin only)
   *
   * @tags Banners
   * @name BannersUpdate
   * @summary Update banner (Admin)
   * @request PUT:/admin/banners/{id}
   * @secure
   */
  bannersUpdate = (
    { id, ...query }: BannersUpdateParams,
    banner: ModelsBanner,
    params: RequestParams = {},
  ) =>
    this.request<BannersUpdateData, DtoErrorResponse>({
      path: `/admin/banners/${id}`,
      method: "PUT",
      body: banner,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Delete a banner (admin only)
   *
   * @tags Banners
   * @name BannersDelete
   * @summary Delete banner (Admin)
   * @request DELETE:/admin/banners/{id}
   * @secure
   */
  bannersDelete = (
    { id, ...query }: BannersDeleteParams,
    params: RequestParams = {},
  ) =>
    this.request<BannersDeleteData, DtoErrorResponse>({
      path: `/admin/banners/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Get list of all media items with filters (admin only)
   *
   * @tags Media
   * @name MediaList
   * @summary List all media items (Admin)
   * @request GET:/admin/media
   * @secure
   */
  mediaList = (query: MediaListParams, params: RequestParams = {}) =>
    this.request<MediaListData, DtoErrorResponse>({
      path: `/admin/media`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new media item (admin only)
   *
   * @tags Media
   * @name MediaCreate
   * @summary Create media item (Admin)
   * @request POST:/admin/media
   * @secure
   */
  mediaCreate = (media: ModelsMediaItem, params: RequestParams = {}) =>
    this.request<MediaCreateData, DtoErrorResponse>({
      path: `/admin/media`,
      method: "POST",
      body: media,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Upload an image file (JPEG, PNG, WebP) with validation
   *
   * @tags Media
   * @name MediaUploadCreate
   * @summary Upload media file
   * @request POST:/admin/media/upload
   * @secure
   */
  mediaUploadCreate = (
    data: {
      /**
       * Image file (max 5MB, min 1200px width)
       * @format binary
       */
      file: File;
      /** Media title */
      title?: string;
      /** Alt text for image */
      alt?: string;
      /** Category ID */
      category_id?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<MediaUploadCreateData, DtoErrorResponse>({
      path: `/admin/media/upload`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: "json",
      ...params,
    });
  /**
   * @description Get single media item by ID (admin only)
   *
   * @tags Media
   * @name MediaDetail
   * @summary Get media item by ID (Admin)
   * @request GET:/admin/media/{id}
   * @secure
   */
  mediaDetail = (
    { id, ...query }: MediaDetailParams,
    params: RequestParams = {},
  ) =>
    this.request<MediaDetailData, DtoErrorResponse>({
      path: `/admin/media/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing media item (admin only)
   *
   * @tags Media
   * @name MediaUpdate
   * @summary Update media item (Admin)
   * @request PUT:/admin/media/{id}
   * @secure
   */
  mediaUpdate = (
    { id, ...query }: MediaUpdateParams,
    media: ModelsMediaItem,
    params: RequestParams = {},
  ) =>
    this.request<MediaUpdateData, DtoErrorResponse>({
      path: `/admin/media/${id}`,
      method: "PUT",
      body: media,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Delete a media item (admin only)
   *
   * @tags Media
   * @name MediaDelete
   * @summary Delete media item (Admin)
   * @request DELETE:/admin/media/{id}
   * @secure
   */
  mediaDelete = (
    { id, ...query }: MediaDeleteParams,
    params: RequestParams = {},
  ) =>
    this.request<MediaDeleteData, DtoErrorResponse>({
      path: `/admin/media/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
