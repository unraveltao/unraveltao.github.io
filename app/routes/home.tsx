import { Link } from 'react-router'
import { GardenArt } from '~/components/GardenArt'
import { Icon } from '~/components/Icon'
import { PostRow } from '~/components/PostRow'
import { ProjectFeature } from '~/components/ProjectFeature'
import { getProjects, getPublishedPosts } from '~/lib/content'
import { pageMeta } from '~/lib/seo'
import { SITE_NAME, SITE_REPO, SITE_TAGLINE } from '~/lib/site'

export const meta = () => pageMeta({ path: '/' })

/** 首页以代表项目和人工精选写作为入口，不用更新频率决定展示顺序。 */
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
            个人主页 · 项目与精选写作
          </div>
          <h1>
            把想法做成项目，
            <br />
            <em>把经验沉淀成方法。</em>
          </h1>
          <p>
            我是 {SITE_NAME}。 {SITE_TAGLINE}
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/projects/">
              查看项目 <Icon name="arrow" />
            </Link>
            <Link className="text-link" to="/posts/">
              阅读精选 <Icon name="out" />
            </Link>
          </div>
        </div>
        <GardenArt />
      </section>

      <div className="intro-strip">
        <span>
          <Icon name="leaf" /> <strong>实践 · 思考 · 方法</strong>
        </span>
        <span>
          正在构建 <strong>Lattice</strong>
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
                全部项目 <Icon name="arrow" />
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
                  全部写作 <Icon name="arrow" />
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
            <div className="eyebrow">关于这里</div>
            <h3>
              用项目展示实践，
              <br />
              用文字解释判断。
            </h3>
            <p>
              这里收录我正在做的项目，以及值得长期保留的方法论、技术取舍和实践总结。
            </p>
            <ul className="focus-list">
              <li>
                <i />
                项目：问题、实现与取舍
              </li>
              <li>
                <i />
                写作：有实践支撑的结论
              </li>
              <li>
                <i />
                方法：可以反复使用的经验
              </li>
            </ul>
            <a className="text-link" href={SITE_REPO} target="_blank" rel="noopener noreferrer">
              在 GitHub 找到我 <Icon name="out" />
            </a>
          </div>
        </aside>
      </div>

      <div className="home-note">
        <span>只留下值得展示的项目，和值得反复阅读的文字。</span>
        <span>PROJECTS & WRITING ↗</span>
      </div>
    </>
  )
}
