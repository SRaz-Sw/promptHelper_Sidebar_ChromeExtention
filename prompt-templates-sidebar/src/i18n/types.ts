import { resources } from "../locales";

// Extract the type of the translation keys from the resources
export type TranslationKeys = typeof resources.en.common;

// Create a type for nested keys using dot notation
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType &
    (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TFunction = (
  key: NestedKeyOf<TranslationKeys>,
  options?: {
    count?: number;
    [key: string]: any;
  }
) => string;

// Extend the i18next module to include our resource types
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: typeof resources.en;
  }
}
