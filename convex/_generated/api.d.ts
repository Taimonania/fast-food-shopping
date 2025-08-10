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
import type * as functions_item from "../functions/item.js";
import type * as functions_super_order from "../functions/super_order.js";
import type * as functions_supermarket from "../functions/supermarket.js";
import type * as tables_item from "../tables/item.js";
import type * as tables_super_order from "../tables/super_order.js";
import type * as tables_supermarket from "../tables/supermarket.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "functions/item": typeof functions_item;
  "functions/super_order": typeof functions_super_order;
  "functions/supermarket": typeof functions_supermarket;
  "tables/item": typeof tables_item;
  "tables/super_order": typeof tables_super_order;
  "tables/supermarket": typeof tables_supermarket;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
