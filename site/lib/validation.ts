import { z } from "zod";

const SIMPLE_ISO_DATE_REGEX = /\d{4}-[01]\d-[0-3]\d/g;

// TODO: This validation needs to be revisited as it currently laxly conforms with the jip-1 draft for ease of development.

const JipPreambleSchema = z.object({
  jip: z.coerce.number(),
  title: z.string(),
  authors: z.string(),
  owners: z.string(),
  type: z.union([z.literal("Community"), z.literal("Council")]),
  category: z.union([
    z.literal("Hard-fork"),
    z.literal("Recovery"),
    z.literal("Meta"),
    z.literal("Informational"),
    z.literal("Standard")
  ]),
  domains: z.optional(z.string()),
  description: z.string(),
  forumThread: z.optional(z.string()),
  stage: z.union([
    z.literal("Draft"),
    z.literal("Review"),
    z.literal("Living"),
    z.literal("Stagnant"),
    z.literal("Last Call"),
    z.literal("Withdrawn"),
    z.literal("Enactable"),
    z.literal("Final"),
    z.literal("Rejected"),
    z.literal("Enacted")
  ]),
  lastCallDeadline: z.optional(z.string()),
  created: z.string().regex(SIMPLE_ISO_DATE_REGEX),
  requires: z.optional(z.string()),
  proposals: z.optional(z.string())
});

export type JipPreamble = z.infer<typeof JipPreambleSchema>;

export const validatePreamble = (unvalidatedPreamble: { [key: string]: any }): JipPreamble => {
  if (!unvalidatedPreamble.owners && unvalidatedPreamble.authors) {
    unvalidatedPreamble.owners = unvalidatedPreamble.authors;
  }

  return JipPreambleSchema.parse(unvalidatedPreamble);
};
