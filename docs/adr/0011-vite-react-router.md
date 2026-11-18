# Replace Astro with Vite and React Router 7

The site now uses Vite, React 19, React Router 7 in framework mode (`ssr: true` with prerendering), and Velite for content. Output remains static HTML. The reason was not performance: the maintainer was more familiar with React, and that familiarity reduced the cost of routine changes.

**Considered Options**:

- **Keep Astro and use `.tsx` islands**: this would preserve zero-JavaScript static rendering for most pages, but page-level logic would still use Astro concepts such as `getStaticPaths`, `Astro.props`, slots, and scoped styles. It did not address the maintenance reason for the change.
- **Use Next.js static export**: this provides React but disables features such as ISR, Server Actions, and Route Handlers, adding framework weight without using its server capabilities.
- **Use Vite and React Router as a client-only SPA**: this is simpler to configure but would emit an empty root element for every route, share one title and Open Graph preview across the site, and delay first rendering on mobile while JavaScript loads and runs.

**Consequences**:

- First-screen JavaScript increased from zero to about 122KB gzip in the migration baseline. The current documented budget is 130KB; the historical measurement is not a current performance result.
- Per-route metadata and structured data can be generated, and client-side navigation avoids full-page reloads.
- Velite replaces Astro Content Collections. The strict schema stops builds on invalid content. Post bodies are rendered as HTML strings, so they cannot currently hydrate embedded React components. Revisit the Markdown pipeline only if interactive article components become necessary.
- The source tree moved from `src/` to `app/`. Routes are listed explicitly in `app/routes.ts`; adding a static page also requires registering it in the prerender configuration.
- Trailing slashes are preserved by coordinated route configuration, postbuild output rewriting, and preview-server redirects. Omitting one part may cause production 404s.
- The original ADR-0003 visual identity remains context, but the current six-theme interface has diverged and is scheduled for a focused documentation and UI review. Do not infer that a CSS framework or component library is required.
- Per-post Open Graph images and a content scaffold remain possible future work only if actual maintenance needs justify them.
