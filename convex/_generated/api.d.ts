/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as blog from "../blog.js";
import type * as emails from "../emails.js";
import type * as employees from "../employees.js";
import type * as estimates from "../estimates.js";
import type * as gmailService from "../gmailService.js";
import type * as leads from "../leads.js";
import type * as media from "../media.js";
import type * as notifications from "../notifications.js";
import type * as projects from "../projects.js";
import type * as videos from "../videos.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage for example:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const api: FilterApi<
  ApiFromModules<{
    blog: typeof blog;
    emails: typeof emails;
    employees: typeof employees;
    estimates: typeof estimates;
    gmailService: typeof gmailService;
    leads: typeof leads;
    media: typeof media;
    notifications: typeof notifications;
    projects: typeof projects;
    videos: typeof videos;
  }>
>;
export default api;

export declare const internal: FilterApi<
  ApiFromModules<{
    blog: typeof blog;
    emails: typeof emails;
    employees: typeof employees;
    estimates: typeof estimates;
    gmailService: typeof gmailService;
    leads: typeof leads;
    media: typeof media;
    notifications: typeof notifications;
    projects: typeof projects;
    videos: typeof videos;
  }>
>;