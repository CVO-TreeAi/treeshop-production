/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as blog from "../blog.js";
import type * as emails from "../emails.js";
import type * as employees from "../employees.js";
import type * as estimates from "../estimates.js";
import type * as gmailService from "../gmailService.js";
import type * as leads from "../leads.js";
import type * as media from "../media.js";
import type * as notifications from "../notifications.js";
import type * as projects from "../projects.js";
import type * as terminalAnalytics from "../terminalAnalytics.js";
import type * as terminalSync from "../terminalSync.js";
import type * as videos from "../videos.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  blog: typeof blog;
  emails: typeof emails;
  employees: typeof employees;
  estimates: typeof estimates;
  gmailService: typeof gmailService;
  leads: typeof leads;
  media: typeof media;
  notifications: typeof notifications;
  projects: typeof projects;
  terminalAnalytics: typeof terminalAnalytics;
  terminalSync: typeof terminalSync;
  videos: typeof videos;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
