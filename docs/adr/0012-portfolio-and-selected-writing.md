# Focus on the Personal Homepage and Portfolio, with Selected Writing

> Confirmed by the author on 2026-11-02. This partially supersedes the engineering-narrative focus in ADR-0001. The content model remains Post and Project; no additional content entity is introduced.

The site prioritizes the personal homepage and portfolio, with technical writing as supporting material. Publish selected notes, such as methods and decisions, rather than treating every update as a chronological blog entry.

**Considered Options**: A frequently updated chronological blog can let placeholder and routine posts dominate the homepage. A full digital garden requires more navigation and upkeep. A portfolio with selected writing can show both real work and technical judgment.

**Consequences**: The homepage presents representative projects before published Posts manually marked `featured`; the writing section is hidden when no Post is featured. At most one Post is featured, while the writing index remains available to browse all published Posts. Workshop leaves the homepage and primary navigation, but its URL and the Workflow route remain available. Manual curation is required, and auxiliary tools are less discoverable. Article count and posting frequency are not success criteria. Project accuracy, access paths, and maintenance cost are the acceptance priorities. This decision did not approve or redo the visual design; ADR-0003 remains historical context pending reconciliation with the current UI.
