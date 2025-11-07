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
  BannersListParams2,
  BannersListResult,
  DtoErrorResponse,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Banners<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Get active banners for a specific placement with time window check
   *
   * @tags Banners
   * @name BannersList
   * @summary Get banners by placement (Public)
   * @request GET:/banners
   */
  bannersList = (query: BannersListParams2, params: RequestParams = {}) =>
    this.request<BannersListResult, DtoErrorResponse>({
      path: `/banners`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
}
