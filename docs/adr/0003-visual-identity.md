# Continue the Visual Language of the Profile README

The original site continued the language of the Profile README: paper-white backgrounds, one accent color (`#0F6E56`), monospaced metadata, and no cards or shadows. A separate visual identity would make the transition from the README to the site feel disconnected.

**Consequences**: The accent must be brighter in dark contexts: `#0F6E56` on `#121211` has only 3.05:1 contrast, below the AA requirement for normal text. Theme-specific tokens must therefore be defined as pairs rather than using one unchanged accent value. The current six-theme implementation has since diverged from some of this original specification; see [Design System](../03-Design-System.md).
