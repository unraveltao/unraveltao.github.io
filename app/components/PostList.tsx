import type { Post } from '~/lib/content'
import { groupByYear } from '~/lib/posts'
import { PostItem } from './PostItem'

export function PostList({ posts, grouped = false }: { posts: Post[]; grouped?: boolean }) {
  if (!grouped) {
    return (
      <ul className="post-list">
        {posts.map((post) => (
          <PostItem key={post.slug} post={post} />
        ))}
      </ul>
    )
  }

  return (
    <>
      {groupByYear(posts).map(([year, items]) => (
        <section className="year-group" key={year}>
          <p className="meta year-label">{year}</p>
          <ul className="post-list">
            {items.map((post) => (
              <PostItem key={post.slug} post={post} />
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
