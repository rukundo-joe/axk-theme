# Workspace anatomy — reading a Frappe Workspace JSON

Every file under `reference/workspaces/<name>/<name>.json` is one Workspace
DocType record with attached child rows. They reference AXK-specific DocTypes
and will **not install cleanly** on a bench without the `axk_network` app —
this directory is reference material, not a fixture.

Read the JSONs to understand layout patterns; rebuild equivalents in your
own app using your own DocTypes.

## The record shape

```json
{
  "label": "Platform Administration",
  "title": "Platform Administration",
  "module": "AXK Network",
  "public": 1,
  "is_hidden": 0,
  "icon": "settings",
  "content": "[ ... grid blob, see below ... ]",
  "shortcuts": [ ... rows linking to DocTypes / reports / pages ... ],
  "links":     [ ... sidebar nav rows ... ],
  "number_cards": [ ... metric widgets ... ],
  "charts":    [ ... Dashboard Chart references ... ]
}
```

Four child tables plus the `content` grid JSON drive everything the user
sees. All four reference DocTypes by name — rename `"link_to": "Lot"` to
your equivalent and the layout is yours.

## The `content` grid

`content` is a JSON-encoded array of blocks, each with `id`, `type`, `data`.
Types you'll see most:

| `type` | Purpose | Key `data` fields |
|---|---|---|
| `header` | Section title | `text` (HTML allowed), `col` (1–12 grid span) |
| `number_card` | Metric tile | `number_card_name` — must match a `name` in the `number_cards` array |
| `shortcut` | Big button | `shortcut_name` — must match a `name` in the `shortcuts` array |
| `card` | Card with link list | `card_name` — built from `links` entries via Card Break |
| `chart` | Dashboard chart tile | `chart_name` — must match a public Dashboard Chart |
| `spacer` | Vertical space | `col` |
| `paragraph` | Prose block | `text` |

The `col` value is a 1–12 Bootstrap-style span. Rows flow naturally; a
header with `col: 12` fills the row, three `number_card`s with `col: 4`
each fill the next.

## The four child tables

**`shortcuts`** — the big colored buttons near the top. Each row carries
`shortcut_name` (display + id), `link_to` (a DocType / Report / Page /
Dashboard), `type` (which of those), and optional filters / colors.

**`links`** — the left sidebar. Mix of `Card Break` rows (section headers)
and `Link` rows (clickable items). `link_type` selects between `DocType`,
`Report`, `Page`, `URL`.

**`number_cards`** — referenced from the grid by name. Each row has
`number_card_name` (must already exist as a Number Card record — these are
public Number Cards, not inlined data).

**`charts`** — same pattern: referenced by name, must correspond to an
existing public Dashboard Chart record.

## How to use this directory

1. Pick a workspace whose layout resembles what you want (e.g.
   `platform_administration` for admin dashboards, `buyer_marketplace` for
   role-scoped entry points).
2. Read the `content` array to see the block composition.
3. Read the `shortcuts` / `links` / `number_cards` / `charts` rows.
4. In your own app, build an equivalent workspace: same composition, but
   swap every `link_to` / `shortcut_name` / `number_card_name` /
   `chart_name` to something your bench actually has.

See `WORKSPACE-PATTERNS.md` for five distilled layout patterns and which
source workspaces exemplify each.
