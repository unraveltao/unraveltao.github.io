export type ContactLink = {
  id: string
  label: string
  href?: string
  handle?: string
  note?: string
}

/** Add only public contact details the author has explicitly approved. */
export const CONTACT_METHODS: readonly ContactLink[] = []

/** Public content and social accounts belong here once their URLs are confirmed. */
export const CONTENT_ACCOUNTS: readonly ContactLink[] = []
