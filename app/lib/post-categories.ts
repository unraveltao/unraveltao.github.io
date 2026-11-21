import postCategories from '../../content/post-categories.json'

export type PostCategory = keyof typeof postCategories

export const POST_CATEGORIES = Object.entries(postCategories)
  .map(([slug, definition]) => ({ slug: slug as PostCategory, ...definition }))
  .sort((a, b) => a.order - b.order)

export function postCategoryName(category: PostCategory): string {
  return postCategories[category].name
}
