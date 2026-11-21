import type { MetaFunction } from 'react-router'
import { Link, useParams } from 'react-router'
import { Icon } from '~/components/Icon'
import { PostRow } from '~/components/PostRow'
import { getPublishedPosts } from '~/lib/content'
import { postCategoryName, POST_CATEGORIES } from '~/lib/post-categories'
import { pageMeta } from '~/lib/seo'

function findCategory(slug: string | undefined) {
  const category = POST_CATEGORIES.find((item) => item.slug === slug)
  if (!category) throw new Response('Not Found', { status: 404 })
  return category
}

export const meta: MetaFunction<{ category: string }> = ({ params }) => {
  const category = findCategory(params.category)
  return pageMeta({
    path: `/personal-os/${category.slug}`,
    title: `${postCategoryName(category.slug)} · Personal OS`,
    description: category.description,
  })
}

export default function PersonalOsCategory() {
  const { category: slug } = useParams()
  const category = findCategory(slug)
  const posts = getPublishedPosts()
    .filter((post) => post.category === category.slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <>
      <Link className="back-link" to="/personal-os/">
        <Icon name="arrow" /> Personal OS
      </Link>
      <header className="page-head personal-os-category-head" data-category={category.slug}>
        <div className="eyebrow">PERSONAL OS / {String(category.order).padStart(2, '0')}</div>
        <h1>{postCategoryName(category.slug)}</h1>
        <p>{category.description}</p>
        <span className="personal-os-category-count">{posts.length} {posts.length === 1 ? 'article' : 'articles'}</span>
      </header>

      {posts.length > 0 ? (
        <div className="writing-list">
          {posts.map((post) => <PostRow key={post.slug} post={post} />)}
        </div>
      ) : (
        <div className="empty-state">
          <h2>这里还没有已发布的文章。</h2>
          <p>这类文章发布后，会自动出现在这个分类里。</p>
          <Link className="text-link" to="/posts/">查看全部文章 <Icon name="arrow" /></Link>
        </div>
      )}
    </>
  )
}
