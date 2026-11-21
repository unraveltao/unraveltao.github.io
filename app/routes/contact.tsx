import type { MetaFunction } from 'react-router'
import { ContactDetails } from '~/components/ContactDetails'
import { SITE_NAME } from '~/lib/site'

export const meta: MetaFunction = () => [
  { title: `联系我与其他平台 · ${SITE_NAME}` },
  { name: 'description', content: `查看联系 ${SITE_NAME} 的方式，以及其他平台上的公开账号。` },
]

export default function ContactRoute() {
  return (
    <>
      <header className="page-head contact-head">
        <div className="eyebrow">CONTACT & ELSEWHERE</div>
        <h1>联系我</h1>
        <p>这里汇总可以联系我的方式，以及我在其他平台发布的内容。</p>
      </header>
      <ContactDetails />
    </>
  )
}
