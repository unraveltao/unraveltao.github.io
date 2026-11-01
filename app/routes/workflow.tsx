import { Link } from 'react-router'
import { Icon } from '~/components/Icon'
import { pageMeta } from '~/lib/seo'

export const meta = () =>
  pageMeta({
    path: '/workflow',
    title: 'Workflow',
    description:
      'Write with familiar tools. Keep your work as plain text. Publish deliberately.',
  })

/** 版式取自参考站 workflow()：三步条 + 一段 article-body 正文 */
export default function Workflow() {
  return (
    <>
      <header className="page-head">
        <div className="eyebrow">ONE SOURCE OF TRUTH</div>
        <h1>From your vault to the garden.</h1>
        <p>Write with familiar tools. Keep your work as plain text. Publish deliberately.</p>
      </header>

      <div className="workflow-steps">
        <div className="workflow-step">
          <span>01 / WRITE</span>
          <h2>Think in Obsidian.</h2>
          <p>
            Open the source repository as a vault. Keep articles in <code>content/posts/</code> — one
            folder per note, with an <code>index.mdx</code> inside.
          </p>
        </div>
        <div className="workflow-step">
          <span>02 / REVIEW</span>
          <h2>Track it with Git.</h2>
          <p>
            Review your changes. A note without a <code>draft</code> flag is published; the build fails
            loudly if the frontmatter doesn’t match the schema.
          </p>
        </div>
        <div className="workflow-step">
          <span>03 / DEPLOY</span>
          <h2>Grow the garden.</h2>
          <p>
            Build the site and push. Every page is prerendered to static HTML, so a push to the default
            branch is the whole deployment.
          </p>
        </div>
      </div>

      <div className="workflow-body article-body">
        <h2>The smallest working loop</h2>
        <ol>
          <li>
            Create a note in the <Link to="/workshop/">Workshop</Link> and download the Markdown file.
          </li>
          <li>
            Move it into <code>content/posts/&lt;slug&gt;/index.mdx</code> in your source checkout.
          </li>
          <li>
            Edit it in Obsidian. Drop <code>draft: true</code> when it is ready to be seen.
          </li>
          <li>Run the checks and the build, then commit the reviewed files.</li>
          <li>Push. The prerendered HTML goes out with it — there is no separate deploy step.</li>
        </ol>
        <pre>
          <code>{`pnpm validate\npnpm check\npnpm build\npnpm test\ngit add content\ngit commit -m "Add a garden note"`}</code>
        </pre>

        <h2>Plain text, with a clear boundary.</h2>
        <p>
          The build includes every published Markdown file from <code>content/posts/</code>. Drafts stay
          out of the generated site. Frontmatter is validated against a schema at build time, so a typo
          in a field stops the build instead of shipping a broken page.
        </p>
        <p>
          The repository’s README documents the content fields, assets, and deployment steps.{' '}
          <a href="https://github.com/unraveltao/unraveltao.github.io" target="_blank" rel="noopener noreferrer">
            Read the source →
          </a>
        </p>
      </div>

      <div className="article-bottom">
        <Link className="text-link" to="/workshop/">
          <Icon name="arrow" /> Back to the workshop
        </Link>
        <Link className="text-link" to="/posts/">
          Read the notes <Icon name="out" />
        </Link>
      </div>
    </>
  )
}
