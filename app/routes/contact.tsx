import type { MetaFunction } from 'react-router'
import { ContactDetails } from '~/components/ContactDetails'
import { SITE_NAME } from '~/lib/site'

export const meta: MetaFunction = () => [
  { title: `Contact & Elsewhere · ${SITE_NAME}` },
  { name: 'description', content: `Ways to contact ${SITE_NAME} and find public accounts on other platforms.` },
]

export default function ContactRoute() {
  return (
    <>
      <header className="page-head contact-head">
        <div className="eyebrow">CONTACT & ELSEWHERE</div>
        <h1>Get in touch</h1>
        <p>Ways to contact me and find my work on other platforms.</p>
      </header>
      <ContactDetails />
    </>
  )
}

