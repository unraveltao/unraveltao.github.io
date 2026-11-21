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
    note: '发起 QQ 对话',
  },
  {
    id: 'wechat',
    label: '微信号',
    handle: 'unravel_tom',
    note: '复制微信号后，在微信中搜索添加。',
  },
]

/** Public content and social accounts belong here once their URLs are confirmed. */
export const CONTENT_ACCOUNTS: readonly ContactLink[] = [
  { id: 'bilibili', label: '哔哩哔哩', href: 'https://space.bilibili.com/510983368', icon: 'bilibili' },
  { id: 'zhihu', label: '知乎', href: 'https://www.zhihu.com/people/31-45-52-26-68-20', icon: 'zhihu' },
]
