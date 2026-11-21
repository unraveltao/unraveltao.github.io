import { useState } from 'react'
import { CONTENT_ACCOUNTS, CONTACT_METHODS, type ContactLink } from '~/lib/contact-links'

function ContactEntry({ link }: { link: ContactLink }) {
  const [copyStatus, setCopyStatus] = useState<'copied' | 'manual' | null>(null)

  const copyHandle = async () => {
    if (!link.handle) return
    try {
      await navigator.clipboard.writeText(link.handle)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('manual')
    }
  }

  return (
    <li>
      <div className="contact-link-row">
        {link.href ? (
          <a
            href={link.href}
            target={link.href.startsWith('mailto:') ? undefined : '_blank'}
            rel={link.href.startsWith('mailto:') ? undefined : 'me noopener noreferrer'}
          >
            <span>{link.label}</span>
            {link.handle && <span className="contact-handle">{link.handle}</span>}
          </a>
        ) : (
          <span className="contact-link-label">
            <span>{link.label}</span>
            {link.handle && <span className="contact-handle">{link.handle}</span>}
          </span>
        )}
        {link.handle && (
          <button type="button" className="contact-copy" aria-label={`复制 ${link.label}`} onClick={copyHandle}>
            {copyStatus === 'copied' ? '已复制' : '复制'}
          </button>
        )}
      </div>
      {copyStatus === 'manual' && <p className="contact-copy-status" role="status">无法复制，请手动选择账号。</p>}
      {link.note && <p>{link.note}</p>}
    </li>
  )
}

function ContactGroup({
  title,
  eyebrow,
  links,
  emptyMessage,
  headingLevel,
}: {
  title: string
  eyebrow: string
  links: readonly ContactLink[]
  emptyMessage: string
  headingLevel: 2 | 3
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <section className="contact-group">
      <div className="contact-group-heading">
        <span className="contact-eyebrow">{eyebrow}</span>
        <Heading>{title}</Heading>
      </div>
      {links.length > 0 ? (
        <ul className="contact-links">
          {links.map((link) => <ContactEntry key={link.id} link={link} />)}
        </ul>
      ) : (
        <p className="contact-pending" role="status">{emptyMessage}</p>
      )}
    </section>
  )
}

export function ContactDetails({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  return (
    <div className="contact-page">
      <ContactGroup
        eyebrow="01 / CONTACT"
        title="直接联系"
        links={CONTACT_METHODS}
        emptyMessage="公开联系方式正在整理，确认后会在这里补充。"
        headingLevel={headingLevel}
      />
      <ContactGroup
        eyebrow="02 / ELSEWHERE"
        title="其他平台"
        links={CONTENT_ACCOUNTS}
        emptyMessage="B 站、小红书、公众号、知乎等账号链接会在确认后补充。"
        headingLevel={headingLevel}
      />
      <p className="contact-file-note">
        邮箱联系方式开放后，访客可以通过邮件发送文件；附件需要在邮件编辑界面中自行添加。
      </p>
    </div>
  )
}
