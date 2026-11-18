# Keep Site Content Chinese-First Without English Routes

The original plan used Chinese post bodies and `zh-CN` as the document language, with no `/en` route tree. English `titleEn` and `summaryEn` metadata were intended only for social cards and sharing previews.

**Considered Options**: Selective English translations would require i18n routes, a language switch, optional English feeds, and a repeated decision for every Post. A complete mirror would require maintaining two copies of every article.

**Consequences**: International readers would not get full English articles. The `titleEn` and `summaryEn` fields never produced visible results while the site used one static social image; [ADR-0009](./0009-drop-unused-metadata-fields.md) later removed those unused fields. The decision against `/en` routes and parallel article bodies remains active. This decision concerns public site content, not the language used for repository documentation.
