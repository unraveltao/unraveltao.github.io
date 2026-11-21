import { useState } from 'react'
import { Icon } from '~/components/Icon'
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

  if (link.icon && link.href) {
    return (
      <li className="contact-social-item">
        <a
          className="contact-social-link"
          href={link.href}
          target="_blank"
          rel="me noopener noreferrer"
          aria-label={`打开${link.label}主页`}
          title={link.label}
        >
          <Icon name={link.icon} />
        </a>
      </li>
    )
  }

  return (
    <li>
      <div className="contact-link-row">
        <div className="contact-link-label">
          <span className="contact-address"><span>{link.label}:</span> <span className="contact-handle">{link.handle}</span></span>
          {link.note && (link.href ? (
            <a className="contact-link-note contact-action-link" href={link.href} target="_blank" rel="noopener noreferrer">{link.note}</a>
          ) : (
            <span className="contact-link-note">{link.note}</span>
          ))}
        </div>
        {link.handle && (
          <button
            type="button"
            className="contact-copy"
            aria-label={copyStatus === 'copied' ? `${link.label}已复制` : `复制${link.label}账号`}
            title={copyStatus === 'copied' ? '已复制' : '复制账号'}
            onClick={copyHandle}
          >
            <Icon name={copyStatus === 'copied' ? 'check' : 'copy'} />
          </button>
        )}
      </div>
      {copyStatus === 'copied' && <span className="contact-copy-status" role="status">已复制</span>}
      {copyStatus === 'manual' && <p className="contact-copy-status" role="status">复制失败，请手动选择账号复制。</p>}
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
  const isSocialGroup = links.some((link) => link.icon)
  return (
    <section className={`contact-group${isSocialGroup ? ' contact-social-group' : ''}`}>
      <div className="contact-group-heading">
        <span className="contact-eyebrow">{eyebrow}</span>
        <Heading>{title}</Heading>
      </div>
      {links.length > 0 ? (
        <ul className={`contact-links${isSocialGroup ? ' contact-social-links' : ''}`}>
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
        eyebrow="01 / 直接联系"
        title="联系方式"
        links={CONTACT_METHODS}
        emptyMessage="公开联系方式确认后会显示在这里。"
        headingLevel={headingLevel}
      />
      <ContactGroup
        eyebrow="02 / 内容平台"
        title="我的平台账号"
        links={CONTENT_ACCOUNTS}
        emptyMessage="平台账号链接确认后会显示在这里。"
        headingLevel={headingLevel}
      />
      <p className="contact-file-note">
        邮箱联系方式暂未公开；开放后，可以通过邮件联系并添加附件。
      </p>
    </div>
  )
}
