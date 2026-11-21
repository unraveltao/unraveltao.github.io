import { Link } from 'react-router'
import { GardenArt } from '~/components/GardenArt'
import { Icon } from '~/components/Icon'
import { PostRow } from '~/components/PostRow'
import { ProjectFeature } from '~/components/ProjectFeature'
import { getProjects, getPublishedPosts } from '~/lib/content'
import { pageMeta } from '~/lib/seo'
import { SITE_NAME, SITE_REPO, SITE_TAGLINE } from '~/lib/site'

export const meta = () => pageMeta({ path: '/' })

/** 首页以Featured projects和人工Selected writing为入口，不用更新频率决定展示顺序。 */
export default function Home() {
  const projects = getProjects()
  const posts = getPublishedPosts().filter((post) => post.featured)
  const featured = projects[0]

  return (
    <>
      <section className="hero">
        <div>
          <div className="eyebrow">
            <span className="dot" />
            Personal site · Projects and selected writing
          </div>
          <h1>
            Turn ideas into projects,
            <br />
            <em>and experience into practice.</em>
          </h1>
          <p>
            I’m {SITE_NAME}. {SITE_TAGLINE}
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/projects/">
              Explore projects <Icon name="arrow" />
            </Link>
            <Link className="text-link" to="/posts/">
              Read selected writing <Icon name="out" />
            </Link>
          </div>
        </div>
        <GardenArt />
      </section>

      <div className="intro-strip">
        <span>
          <Icon name="leaf" /> <strong>Practice · Ideas · Methods</strong>
        </span>
        <span>
          Currently building <strong>Lattice</strong>
        </span>
        <span>EST. 2026</span>
      </div>

      <div className="home-content">
        <div>
          <section>
            <div className="section-heading">
              <h2>
                <span className="small-index">01</span>代表项目
              </h2>
              <Link className="text-link" to="/projects/">
                All projects <Icon name="arrow" />
              </Link>
            </div>
            {featured && <ProjectFeature project={featured} />}
          </section>

          {posts.length > 0 && (
            <section className="writing-section">
              <div className="section-heading">
                <h2>
                  <span className="small-index">02</span>精选写作
                </h2>
                <Link className="text-link" to="/posts/">
                  All writing <Icon name="arrow" />
                </Link>
              </div>
              {posts.map((post) => (
                <PostRow key={post.slug} post={post} compact />
              ))}
            </section>
          )}
        </div>

        <aside className="home-sidebar">
          <div className="sidebar-box">
            <div className="eyebrow">About this site</div>
            <h3>
              Projects show what I build,
              <br />
              and writing explains why.
            </h3>
            <p>
              A record of the projects I’m working on, along with lessons, technical decisions, and notes worth revisiting.
            </p>
            <ul className="focus-list">
              <li>
                <i />
                Projects: problems, implementation, and tradeoffs
              </li>
              <li>
                <i />
                Writing: conclusions grounded in practice
              </li>
              <li>
                <i />
                Methods: lessons worth reusing
              </li>
            </ul>
            <a className="text-link" href={SITE_REPO} target="_blank" rel="noopener noreferrer">
              Find me on GitHub <Icon name="out" />
            </a>
          </div>
        </aside>
      </div>

      <div className="home-note">
        <span>A curated collection of projects and ideas worth returning to.</span>
        <span>PROJECTS & WRITING ↗</span>
      </div>
    </>
  )
}
