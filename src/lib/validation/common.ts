// Shared Zod primitives used across more than one feature's schema.ts —
// feature-specific validation stays in that feature's own schema.ts.
import { z } from "zod";

export const uuidSchema = z.string().uuid();
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a lowercase, hyphenated slug");
