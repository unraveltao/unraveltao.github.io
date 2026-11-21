# Project Positioning and Scope

> Updated on 2026-11-22 under ADR-0012.

The site is primarily a personal homepage and portfolio, supported by selected technical writing. It should help visitors understand what I care about, what I have built, and how I make decisions.

## Goals

- Introduce my background and interests, then link to representative projects and selected writing.
- Explain each project using verified information about its problem, implementation, status, and important trade-offs. Use only real screenshots, demos, and outcomes.
- Publish methods, technical decisions, and retrospectives when they have a clear conclusion supported by practice or reasoning. Do not optimize for article count or posting frequency.
- Keep writing and project maintenance in repository files. Do not add a backend, database, or CMS.

## Content selection

Before publishing, check that a post has a clear conclusion, evidence or reasoning behind it, and lasting reference value. Keep routine study notes and fragments in personal note-taking tools. Methods remain Posts; do not introduce another content entity.

## Success criteria

Visitors should be able to understand the site's owner, find credible project information, and locate writing that demonstrates technical judgment within a few minutes. The maintainer should be able to write, validate, and deploy by following the README. There is no minimum article count or update schedule. Technical and accessibility acceptance criteria are defined in [Product Requirements](02-Product-Requirements.md).

## Scope

The site presents public information; publishing to external platforms is a separate project. Keep the personal introduction on the homepage rather than adding an About route. Preserve RSS, series, projects, writing, and the four-card Personal OS index. Keep the legacy Workshop and Workflow URLs accessible, but do not make them primary entry points. Evaluate new tools only when they have clear display value or are needed repeatedly. The Writing archive already uses pagination; consider subscriptions or comments only when actual reader needs justify them.

