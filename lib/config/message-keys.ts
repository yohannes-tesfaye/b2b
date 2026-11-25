/**
 * Typed message-key helpers for data/config files.
 * `NamespaceKey` covers direct string keys plus one level of nesting, which is
 * enough for `nav.*`, `links.*`, `stats.*` style groups.
 */

export type StringKeys<T> = {
  [K in keyof T & string]: T[K] extends string ? K : never;
}[keyof T & string];

export type NestedStringKeys<T> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? `${K}.${StringKeys<T[K]>}`
    : never;
}[keyof T & string];

export type NamespaceKey<T> = StringKeys<T> | NestedStringKeys<T>;
