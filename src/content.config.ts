import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const comics = defineCollection({
  loader: glob({pattern:'**/*.md', base:'./src/content/comics'}),
  schema:z.object({
    number:z.coerce.number().int().positive(),
    title:z.string().min(1),
    date:z.coerce.date(),
    description:z.string().min(1),
    images:z.array(z.string()).default([]),
    characters:z.array(z.string()).default([]),
    tags:z.array(z.string()).default([]),
    socialDate:z.coerce.date().optional().nullable(),
    status:z.enum(['published','draft']).default('draft'),
    ogImage:z.string().optional().nullable(),
  }),
});
export const collections={comics};
