import {z} from "zod";
import Big from 'big.js';

export function isNotNull<T>(element: T | null): element is T {
    return element != null;
}

export class ParserError<Output, Input = Output> extends Error {
    constructor(parser: z.ZodType<Output, z.ZodTypeDef, Input>, item?: unknown) {
        super(`Error parsing ${JSON.stringify(parser)} ${JSON.stringify(item)}`);
    }
}

export function camelCaseDeep(obj: any): unknown {
    if (
        typeof obj !== 'object' ||
        obj === null ||
        (obj as Big).constructor === Big ||
        obj instanceof Set
    ) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(camelCaseDeep);
    }

    if (obj instanceof Date) {
        return obj;
    }

    const newObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
        newObj[key.replace(/_(.)/g, (_, $1) => `${$1.toUpperCase()}`)] =
            camelCaseDeep(value);
    }
    return newObj;
}

export function parseItemsStrict<Output, Input = Output>(
    parser: z.ZodType<Output, z.ZodTypeDef, Input>,
    items?: Record<string, unknown>[] | null,
): Output[] {
    return (items || []).map((item) => parseItemStrict(parser, item));
}

export function parseItemStrict<Output, Input = Output>(
    parser: z.ZodType<Output, z.ZodTypeDef, Input>,
    item?: Record<string, unknown> | null,
    camelCase = true,
): Output {
    // TODO: consider replacing parser with similar to parse request one
    // for better error handling
    const data = parseItem(parser, item, camelCase);

    if (data == null) {
        throw new ParserError(parser, item);
    }

    return data;
}

export function parseItem<Output, Input = Output>(
    parser: z.ZodType<Output, z.ZodTypeDef, Input>,
    item?: Record<string, unknown> | null,
    camelCase = true,
): Output | null {
    const result = parser.safeParse(
        item && camelCase ? camelCaseDeep(item) : item,
    );

    if (!result.success) {
        console.error(result.error)
        return null;
    }

    return result.data;
}

export function parseItems<Output, Input = Output>(
    parser: z.ZodType<Output, z.ZodTypeDef, Input>,
    items?: Record<string, unknown>[] | null,
): Output[] {
    return (items || []).map((item) => parseItem(parser, item)).filter(isNotNull);
}