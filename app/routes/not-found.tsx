import { Link } from 'react-router'
import { Icon } from '~/components/Icon'
import { pageMeta } from '~/lib/seo'

export const meta = () =>
  pageMeta({
    path: '/404',
    title: 'Not found',
    description: 'This path hasn’t grown yet.',
  })

export default function NotFound() {
  return (
    <div className="empty-state" style={{ marginTop: 60 }}>
      <h1>This path hasn’t grown yet.</h1>
      <p>The page may have moved. There’s plenty to explore back at home.</p>
      <Link className="button primary" to="/">
        Back to the garden <Icon name="arrow" />
      </Link>
    </div>
  )
}
