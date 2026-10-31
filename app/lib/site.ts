import site from './site.json'

/**
 * 站点常量只存一份：app/lib/site.json。
 * 这里做转出，是为了让页面拿到字面量类型、让构建脚本（scripts/postbuild.mjs）
 * 能直接读同一个 json，而不必把站点名/域名/描述抄第二遍。
 */
export const SITE_NAME: string = site.name
export const SITE_URL: string = site.url

/** 只给 <title> / og:title 用的短标语。和 SITE_TAGLINE 不是一回事，别混用 */
export const SITE_TITLE_TAGLINE: string = site.titleTagline

/**
 * 首页 hero 可见的定位句（长）。
 * 只给首页用——塞进 <title> 会让标题变成 90 多字符，标签页与搜索结果都被截断。
 */
export const SITE_TAGLINE: string = site.tagline

export const SITE_DESCRIPTION: string = site.description
export const SITE_AUTHOR: string = site.author
export const SITE_EMAIL: string = site.email
export const SITE_REPO: string = site.repo
