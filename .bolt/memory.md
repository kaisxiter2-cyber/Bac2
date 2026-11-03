# Project memory

## Product intent & audience

- Baccalaureate Student Portal for students in the **Bac Lettres / Literature stream**, with coverage of all six subjects:
  - Arabic language & literature
  - Philosophy
  - History & geography
  - Islamic education
  - French
  - English
- Core experience: instant lesson/summary search, subject-based browsing, and monetizable ad placements.
- Audience is Arabic-speaking high-school students, likely within a Maghreb curriculum context.

## Brand personality & voice

- Arabic-first, educational, approachable, and clear.
- Messaging should explicitly communicate that the portal serves all Bac Lettres subjects.
- Subject labels should distinguish French and English as separate sections rather than combining them into a generic languages category.

## Visual design & UX direction

- Mobile-friendly responsive experience suitable for frequent student use.
- Subject navigation/filtering should expose all six subjects clearly and make switching between them quick.
- Search and lesson discovery should remain prominent, with concise metadata and readable educational content layouts.
- Use polished, distinctive production-quality UI rather than generic templates.
- Prefer the project’s established React/Tailwind/Lucide implementation patterns and `@/` imports.

## Decisions, constraints & rationale

- Scope is the complete Bac Lettres curriculum, not only Arabic, philosophy, history/geography, and one combined language section.
- Islamic education is an active subject and must not be omitted.
- French and English are separate subject categories.
- Content/upload handling is aligned to the same six-subject taxonomy.
- Existing sample content includes Arabic poetry, novels, philosophy, history (including the November 1954 Revolution), and Islamic education topics; future content can be filed under any of the six subjects.
- Build and type checks currently pass.
- Browser validation of subject buttons/navigation has not yet been completed.
- Ad inventory remains part of the product concept, but exact placements and behavior are still undecided.

## Open questions & assumptions

- Exact national curriculum and geographic target remain unconfirmed.
- French and English curriculum level, lesson taxonomy, and content source need definition.
- Search architecture and indexing strategy (client-side versus backend) remain open.
- Full curriculum coverage versus an initial curated lesson library is not yet specified.
- Ad provider, formats, frequency, and placement rules are undecided.