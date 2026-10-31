import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { SITE_NAME } from '~/lib/site'
import styles from './Nav.module.css'
import { ThemeToggle } from './ThemeToggle'

const ITEMS = [
  { href: '/projects/', label: 'work' },
  { href: '/posts/', label: 'writing' },
  { href: '/tags/', label: 'tags' },
  { href: '/about/', label: 'about' },
]

export function Nav() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', sync, { passive: true })
    sync()
    return () => window.removeEventListener('scroll', sync)
  }, [])

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link className={styles.brand} to="/">
          {SITE_NAME}
        </Link>
        <nav className={styles.links} aria-label="主导航">
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              className={`${styles.link} ${pathname.startsWith(item.href) ? styles.active : ''}`}
              to={item.href}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
