---
name: ""
overview: ""
todos: []
isProject: false
---

# UX Redesign Spec: Sleek Modern Issue Tracker

## Stack and tooling

- **Component library:** [HeroUI](https://www.heroui.com/) (formerly NextUI). Prefer HeroUI over shadcn; keep existing usage and extend with HeroUI for modal, buttons, inputs, select, etc.
- **Tailwind:** HeroUI is built on Tailwind CSS and provides a Tailwind plugin for theming — **Tailwind is required** when using HeroUI. Use Tailwind for layout, spacing, and HeroUI theme customization.
- **Impeccable:** Use for AI design guidance (e.g. `/polish`, `/audit`) when implementing; complements HeroUI with typography, color, and layout patterns.
- **Theme:** Single theme only. No light/dark toggle; remove or hide the existing theme switcher. Apply the chosen palette and fonts everywhere.

---

## Design tokens (palette, typography)

**Color palette** (from reference image — modern navy/teal interior):

| Role                | Description                  | Usage                                               |
| ------------------- | ---------------------------- | --------------------------------------------------- |
| **Navy (primary)**  | Very dark navy blue (wall)   | Primary backgrounds, header/sidebar background      |
| **Navy (accent)**   | Dark navy blue               | Borders, subtle contrast, sidebar hover             |
| **Teal (deep)**     | Dark teal / deep emerald     | Secondary surfaces, status "In progress" or similar |
| **Teal (primary)**  | Medium teal / emerald (sofa) | Primary actions, links, active nav, key UI emphasis |
| **Mustard / ochre** | Golden ochre                 | CTAs (e.g. "New Issue"), active states, highlights  |
| **Sky blue**        | Medium sky / powder blue     | Softer accents, issue card backgrounds              |
| **Neutral**         | Light grey / off-white       | Card text, body text on dark, secondary text        |

**Typography:**

- **JetBrains Mono** — code, IDs, or technical labels if needed.
- **IBM Plex** family — headings (e.g. IBM Plex Sans).
- **Source Sans 3** — body text or secondary copy.

**Responsive:** App must be responsive. Sidebar collapses to drawer on small screens; issue cards and forms reflow; modals full-screen on mobile when appropriate.

---

## Scope of the redesign

1. **Design system** — HeroUI theme + CSS variables; single theme; spacing, radii, motion.
2. **Dashboard shell** — Layout, TopBar (SVG logo + "Parallel", user, logout), Sidebar (Issues, Projects, Settings) with active state; responsive (drawer on mobile).
3. **Issues list (card list)** — Horizontal cards stacked vertically; title, preview, status pill, actions; sky blue tint for card background; compact vertical padding; mustard for "New Issue" CTA.
4. **Create Issue** — HeroUI Modal; title (required), description; mustard "Create Issue" button; validation.
5. **Auth (signin / signup)** — Centered form; logo + "Parallel"; link to switch; error area.
6. **Projects & Settings** — Minimal "Coming soon" content with same shell and tokens.

---

## Implementation order

1. Tailwind + HeroUI; design tokens.
2. Logo; dashboard shell (layout, Sidebar, TopBar).
3. Issues list (card list, status pill, loading/empty/error).
4. Create Issue modal and form.
5. Auth pages; Projects & Settings.
6. Responsive pass and final review.

---

## Out of scope

- New features (filters, search, project scoping).
- GraphQL or backend changes.
- Light/dark theme toggle.
- Accessibility audit (assume HeroUI a11y).
