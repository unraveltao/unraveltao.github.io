import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const kebab = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, '必须是 kebab-case（小写字母、数字、连字符）');

const posts = defineCollection({
  loader: glob({
    pattern: '**/index.mdx',
    base: './content/posts',
    // 目录名即 slug；frontmatter 里写 slug 可覆盖
    generateId: ({ entry, data }) =>
      (data?.slug as string | undefined) ?? entry.replace(/\/index\.mdx$/, ''),
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1).max(40),
        summary: z.string().min(20).max(160),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        slug: kebab.optional(),
        tags: z.array(kebab).min(1).max(3),
        series: kebab.optional(),
        order: z.number().int().positive().optional(),
        project: z.string().optional(),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        titleEn: z.string().optional(),
        summaryEn: z.string().optional(),
        cover: image().optional(),
      })
      .refine((p) => !p.series || p.order !== undefined, {
        message: 'series 存在时 order 必填',
        path: ['order'],
      }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './content/pages' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
  }),
});

// 项目不是文章：没有 date、不进 RSS、不进标签（ADR-0007）
const projects = defineCollection({
  loader: glob({
    pattern: '**/index.mdx',
    base: './content/projects',
    generateId: ({ entry, data }) =>
      (data?.slug as string | undefined) ?? entry.replace(/\/index\.mdx$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1).max(24),
      summary: z.string().min(20).max(80),
      status: z.enum(['active', 'done', 'archived']).default('active'),
      stack: z.array(kebab).min(1).max(5),
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
      order: z.number().int().positive().optional(),
      slug: kebab.optional(),
      draft: z.boolean().default(false),
      cover: image().optional(),
    }),
});

export const collections = { posts, pages, projects };
