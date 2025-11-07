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
  DtoErrorResponse,
  MediaDetailParams2,
  MediaDetailResult,
  MediaListParams2,
  MediaListResult,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Media<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Get list of published media items with optional filters
   *
   * @tags Media
   * @name MediaList
   * @summary List published media items
   * @request GET:/media
   */
  mediaList = (query: MediaListParams2, params: RequestParams = {}) =>
    this.request<MediaListResult, DtoErrorResponse>({
      path: `/media`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * @description Get single published media item by slug and increment view count
   *
   * @tags Media
   * @name MediaDetail
   * @summary Get media item by slug
   * @request GET:/media/{slug}
   */
  mediaDetail = (
    { slug, ...query }: MediaDetailParams2,
    params: RequestParams = {},
  ) =>
    this.request<MediaDetailResult, DtoErrorResponse>({
      path: `/media/${slug}`,
      method: "GET",
      format: "json",
      ...params,
    });
}
