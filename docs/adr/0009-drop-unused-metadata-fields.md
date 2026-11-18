# Remove Unused `titleEn`, `summaryEn`, and `cover` Fields

The `posts` fields `titleEn`, `summaryEn`, and `cover`, and the `projects` field `cover`, were removed because no code consumed them. The site used one static `public/og.png`; no page displayed English titles or cover images. Schema fields should describe working capabilities, not hypothetical ones.

**Considered Options**: Keeping the fields would continue to impose a decision every time someone authored content without producing a result. Generating per-post Open Graph images would require a renderer such as `satori` and font processing, adding complexity for a small site. Displaying English summaries would turn the site into partially bilingual content, which ADR-0008 rejected.

**Consequences**: English readers receive no English article summary, and sharing previews remain Chinese. The core decision in ADR-0008 (no `/en` routes and a Chinese-first site) remains active, while its proposed metadata mechanism is removed. If per-post social images are implemented, reintroduce English title data only when it has a real consumer. Do not reintroduce `cover`; generate images from titles and Series instead of requiring manual artwork for every post.

This decision changes the implementation of ADR-0008, not its conclusion. Reintroduce `titleEn` or `summaryEn` only alongside a working per-post Open Graph feature.
