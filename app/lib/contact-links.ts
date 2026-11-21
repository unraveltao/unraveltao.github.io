export type ContactLink = {
  id: string
  label: string
  href?: string
  handle?: string
  note?: string
  icon?: 'bilibili' | 'zhihu'
}

/** Add only public contact details the author has explicitly approved. */
export const CONTACT_METHODS: readonly ContactLink[] = [
  {
    id: 'qq',
    label: 'QQ',
    href: 'https://wpa.qq.com/msgrd?v=3&uin=1664266873&site=qq&menu=yes',
    handle: '1664266873',
    note: 'Start a QQ conversation',
  },
  {
    id: 'wechat',
    label: 'WeChat',
    handle: 'unravel_tom',
    note: 'Copy the WeChat ID and search for it in WeChat to add me.',
  },
]

/** Public content and social accounts belong here once their URLs are confirmed. */
export const CONTENT_ACCOUNTS: readonly ContactLink[] = [
  { id: 'bilibili', label: 'Bilibili', href: 'https://space.bilibili.com/510983368', icon: 'bilibili' },
  { id: 'zhihu', label: 'Zhihu', href: 'https://www.zhihu.com/people/31-45-52-26-68-20', icon: 'zhihu' },
]

