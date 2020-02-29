/*
 * Implements a branded/tagged/nominal type wrapper
 *
 * Brands a Base type with a Tag, such that the resulting "tagged" type is only
 * compatible with the same tagged type.
 *
 * Useful for creating type-safe strings, integers etc., when we want to make
 * sure that a type cannot be accidentally mixed with other similar types.
 *
 * Example:
 *
 * type UserId = Tagged<string, 'UserId'>
 *
 * let userId = 'user-1' as UserId // cast is important here
 *
 * userId = 'any string' // Error: TS2322: Type '"any string"' is not
 *                       // assignable to type 'Tagged<string, "UserId">'.
 *                       // Type '"any string"' is not assignable to
 *                       // type '{ __tag: "UserId"; }'.
 */
export type Tagged<Base, Tag extends string> = Base & { __tag: Tag }

/* Type-safe string. Useful for all kinds of identifiers */
export type Id<Tag extends string> = Tagged<string, Tag>
