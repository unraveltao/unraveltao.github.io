import { Link } from 'react-router'
import { GardenArt } from '~/components/GardenArt'
import { Icon } from '~/components/Icon'
import { PostRow } from '~/components/PostRow'
import { ProjectFeature } from '~/components/ProjectFeature'
import { getProjects, getPublishedPosts } from '~/lib/content'
import { pageMeta } from '~/lib/seo'
import { SITE_REPO, SITE_TAGLINE } from '~/lib/site'

export const meta = () => pageMeta({ path: '/' })

export default function Home() {
  const posts = getPublishedPosts()
  const projects = getProjects()
  const lead = projects[0]

  return (
    <>
      <section className="hero shell">
        <div>
          <p className="eyebrow">
            <span className="dot" />
            拆解真实项目里的设计取舍
          </p>
          <h1>
            把工程判断
            <br />
            <em>写成能引用的结论。</em>
          </h1>
          <p>{SITE_TAGLINE}</p>
          <div className="hero-actions">
            <Link className="button primary" to="/projects/">
              看项目 <Icon name="arrow" />
            </Link>
            <Link className="text-link" to="/posts/">
              读文章 <Icon name="out" />
            </Link>
          </div>
        </div>
        <GardenArt />
      </section>

      <div className="shell">
        <div className="intro-strip">
          <span>
            <Icon name="leaf" /> <strong>学习 · 构建 · 记录</strong>
          </span>
          <span>
            正在拆解 <strong>Lattice 的架构取舍</strong>
          </span>
          <span>EST. 2024</span>
        </div>

        <div className="home-content">
          <div>
            {lead && (
              <section>
                <div className="section-heading">
                  <h2>
                    <span className="small-index">01</span>在做的事
                  </h2>
                  <Link className="text-link" to="/projects/">
                    全部项目 <Icon name="arrow" />
                  </Link>
                </div>
                <ProjectFeature project={lead} />
              </section>
            )}

            <section className="writing-section">
              <div className="section-heading">
                <h2>
                  <span className="small-index">{lead ? '02' : '01'}</span>最近的笔记
                </h2>
                <Link className="text-link" to="/posts/">
                  全部文章 <Icon name="arrow" />
                </Link>
              </div>
              {posts.length > 0 ? (
                posts.slice(0, 3).map((post) => <PostRow key={post.slug} post={post} compact />)
              ) : (
                <p className="result-count">还没有文章。</p>
              )}
            </section>
          </div>

          <aside className="home-sidebar">
            <div className="sidebar-box">
              <p className="eyebrow">IN PROGRESS</p>
              <h3>
                先写清楚，
                <br />
                再写多一点。
              </h3>
              <p>
                这里不写入门教程，只记录自己真实踩过的取舍：为什么这样分层、为什么放弃那个方案、代价是什么。
              </p>
              <ul className="focus-list">
                <li>
                  <i />
                  拆解 Lattice 的边界
                </li>
                <li>
                  <i />
                  状态机与 UI 的分工
                </li>
                <li>
                  <i />
                  把笔记变成可检索的知识
                </li>
              </ul>
              <a className="text-link" href={SITE_REPO} target="_blank" rel="me noopener noreferrer">
                在 GitHub 上找到我 <Icon name="out" />
              </a>
            </div>

            <div className="workshop-teaser">
              <Icon name="file" />
              <h4>RSS 订阅</h4>
              <p>不想每次手动来看？把新文章推到你的阅读器里。</p>
              <a className="text-link" href="/rss.xml">
                拿订阅地址 <Icon name="arrow" />
              </a>
            </div>
          </aside>
        </div>

        <div className="home-note">
          <span>用 Velite + React Router 预渲染，共 {posts.length} 篇文章 · {projects.length} 个项目</span>
          <span>NO CMS · NO DATABASE</span>
        </div>
      </div>
    </>
  )
}
