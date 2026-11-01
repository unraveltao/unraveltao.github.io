import { Link } from 'react-router'
import { GardenArt } from '~/components/GardenArt'
import { Icon } from '~/components/Icon'
import { PostRow } from '~/components/PostRow'
import { ProjectFeature } from '~/components/ProjectFeature'
import { getProjects, getPublishedPosts } from '~/lib/content'
import { pageMeta } from '~/lib/seo'
import { SITE_NAME, SITE_REPO, SITE_TAGLINE } from '~/lib/site'

export const meta = () => pageMeta({ path: '/' })

/**
 * 首页版式逐块取自参考站 app.js 的 home()：
 * hero + 季节插画 → intro-strip → 两栏（左：精选项目 / 最新笔记，右：sidebar + 工坊入口）→ home-note。
 * 文案保留参考站的英文口吻，只把身份换成 unraveltao。
 */
export default function Home() {
  const projects = getProjects()
  const posts = getPublishedPosts().slice(0, 3)
  const featured = projects[0]

  return (
    <>
      <section className="hero">
        <div>
          <div className="eyebrow">
            <span className="dot" />
            A PERSONAL CORNER OF THE INTERNET
          </div>
          <h1>
            Unravel the world,
            <br />
            <em>play the game.</em>
          </h1>
          <p>
            Hi, I’m {SITE_NAME}. {SITE_TAGLINE}
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/projects/">
              Explore my projects <Icon name="arrow" />
            </Link>
            <Link className="text-link" to="/posts/">
              Read the notes <Icon name="out" />
            </Link>
          </div>
        </div>
        <GardenArt />
      </section>

      <div className="intro-strip">
        <span>
          <Icon name="leaf" /> <strong>Learning. Building. Sharing.</strong>
        </span>
        <span>
          Currently exploring <strong>AI agents &amp; thoughtful tools</strong>
        </span>
        <span>EST. 2026</span>
      </div>

      <div className="home-content">
        <div>
          <section>
            <div className="section-heading">
              <h2>
                <span className="small-index">01</span>Selected work
              </h2>
              <Link className="text-link" to="/projects/">
                All projects <Icon name="arrow" />
              </Link>
            </div>
            {featured && <ProjectFeature project={featured} />}
          </section>

          <section className="writing-section">
            <div className="section-heading">
              <h2>
                <span className="small-index">02</span>Fresh from the garden
              </h2>
              <Link className="text-link" to="/posts/">
                All writing <Icon name="arrow" />
              </Link>
            </div>
            {posts.map((post) => (
              <PostRow key={post.slug} post={post} compact />
            ))}
          </section>
        </div>

        <aside className="home-sidebar">
          <div className="sidebar-box">
            <div className="eyebrow">A WORK IN PROGRESS</div>
            <h3>
              Less consuming.
              <br />
              More creating.
            </h3>
            <p>
              This is my space to think out loud, document the process, and make useful things along the
              way.
            </p>
            <ul className="focus-list">
              <li>
                <i />
                Building Lattice
              </li>
              <li>
                <i />
                Learning how agents work
              </li>
              <li>
                <i />
                Turning notes into knowledge
              </li>
            </ul>
            <a className="text-link" href={SITE_REPO} target="_blank" rel="noopener noreferrer">
              Find me on GitHub <Icon name="out" />
            </a>
          </div>

          <div className="workshop-teaser">
            <Icon name="code" />
            <h4>The little workshop</h4>
            <p>Small tools for the things I do often. Starting with a Markdown packager.</p>
            <Link className="text-link" to="/workshop/">
              Step inside <Icon name="arrow" />
            </Link>
          </div>
        </aside>
      </div>

      <div className="home-note">
        <span>A digital garden, not a finished monument. Things grow here.</span>
        <span>BUILT WITH INTENTION ↗</span>
      </div>
    </>
  )
}
