import { defineCollection, z } from '@nuxt/content'

export const collections = {
  blog: defineCollection({
    type: 'page',
    source: 'blog/**/*.md',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      date: z.string(),
      tags: z.array(z.string()).optional(),
      published: z.boolean().default(false),
      cover: z.string().optional(),
    }),
  }),
  projects: defineCollection({
    type: 'page',
    source: 'projects/**/*.md',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      date: z.string(),
      tags: z.array(z.string()).optional(),
      published: z.boolean().default(false),
      url: z.string().optional(),
      github: z.string().optional(),
      cover: z.string().optional(),
    }),
  }),
  settings: defineCollection({
    type: 'data',
    source: 'settings/*.json',
    schema: z.object({}).passthrough(),
  }),
}
