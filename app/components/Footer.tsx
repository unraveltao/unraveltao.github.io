import { SITE_EMAIL, SITE_NAME, SITE_REPO } from '~/lib/site'
import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} meta`}>
        <span>
          © {year} {SITE_NAME}
        </span>
        <span className={styles.sep}>·</span>
        <a href="/rss.xml">rss</a>
        <span className={styles.sep}>·</span>
        <a href={SITE_REPO} rel="me noopener" target="_blank">
          github
        </a>
        <span className={styles.sep}>·</span>
        <a href={`mailto:${SITE_EMAIL}`}>mail</a>
      </div>
    </footer>
  )
}
