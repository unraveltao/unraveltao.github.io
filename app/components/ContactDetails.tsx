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
          aria-label={`Visit ${link.label}`}
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
            aria-label={copyStatus === 'copied' ? `${link.label} copied` : `Copy ${link.label} handle`}
            title={copyStatus === 'copied' ? 'Copied' : 'Copy handle'}
            onClick={copyHandle}
          >
            <Icon name={copyStatus === 'copied' ? 'check' : 'copy'} />
          </button>
        )}
      </div>
      {copyStatus === 'copied' && <span className="contact-copy-status" role="status">Copied</span>}
      {copyStatus === 'manual' && <p className="contact-copy-status" role="status">Could not copy. Please select and copy the handle manually.</p>}
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
        eyebrow="01 / GET IN TOUCH"
        title="Contact"
        links={CONTACT_METHODS}
        emptyMessage="Public contact details will appear here once confirmed."
        headingLevel={headingLevel}
      />
      <ContactGroup
        eyebrow="02 / ELSEWHERE"
        title="My platforms"
        links={CONTENT_ACCOUNTS}
        emptyMessage="Links to my accounts will appear here once confirmed."
        headingLevel={headingLevel}
      />
      <p className="contact-file-note">
        Email contact is not available yet. If it becomes available, you can email me and attach files in your mail app.
      </p>
    </div>
  )
}

