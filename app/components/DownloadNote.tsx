import type { Post } from '~/lib/content'
import { Icon } from './Icon'

/** 参考站的 aside 里那颗「Download Markdown」：把正文原样打包回一个 .md 文件 */
export function DownloadNote({ post }: { post: Post }) {
  const download = () => {
    const frontmatter = [
      '---',
      `title: ${JSON.stringify(post.title)}`,
      `slug: ${post.slug}`,
      `date: ${post.date.slice(0, 10)}`,
      `summary: ${JSON.stringify(post.summary)}`,
      `tags: ${JSON.stringify(post.tags)}`,
      'status: published',
      '---',
      '',
      post.raw,
      '',
    ].join('\n')

    const url = URL.createObjectURL(new Blob([frontmatter], { type: 'text/markdown;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${post.slug}.md`
    document.body.append(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <button type="button" className="button" onClick={download}>
      <Icon name="download" /> Download Markdown
    </button>
  )
}
