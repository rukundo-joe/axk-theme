# Five reusable workspace layout patterns

Distilled from the 24 AXK workspaces in `reference/workspaces/`. Each
pattern below describes the composition + which source workspace(s)
to read as the canonical example. Rebuild the *composition* in your own
app with your own DocType references.

## Pattern 1 — Admin Dashboard

```
┌────────────────────────────────────────────────┐
│ Header: "<area> — <subtitle>"            col=12 │
├──────────────┬──────────────┬──────────────────┤
│ Number Card  │ Number Card  │ Number Card col=4│
├──────────────┴──────────────┴──────────────────┤
│ Shortcut │ Shortcut │ Shortcut │ Shortcut col=3│
├────────────────────────────────────────────────┤
│ Card: <area> Management                  col=4 │
│   - Link  - Link  - Link                       │
└────────────────────────────────────────────────┘
```

Header → KPI row (3–4 number cards) → primary-action row (4 shortcuts) →
card-based navigation. Exemplar: `platform_administration/`.

Use when the user's first question is "what's the state of <domain>?"

## Pattern 2 — Role-Scoped Workspace

```
┌────────────────────────────────────────────────┐
│ Header                                   col=12 │
├──────────┬──────────┬──────────┬──────────────┤
│ Shortcut │ Shortcut │ Shortcut │ Shortcut col=3│
├──────────────────────────┬─────────────────────┤
│ Card: Primary Actions    │ Chart         col=4 │
│   - List                 │                     │
│   - List                 │                     │
└──────────────────────────┴─────────────────────┘
```

Header → breadcrumb-style shortcut row → filtered list view links + one
chart. Sidebar drives drill-down. Exemplars: `buyer_marketplace/`,
`exporter_portal/`, `farmer_dashboard/`.

Use for per-role entry pages where the user has a narrow set of actions.

## Pattern 3 — Operational Queue

```
┌────────────────────────────────────────────────┐
│ Header                                   col=12 │
├────────────────────────────┬───────────────────┤
│ Number Card: "Pending"     │ Chart       col=4 │
│ Number Card: "Today"       │                   │
├────────────────────────────┴───────────────────┤
│ Shortcut: "Review next item"             col=6 │
│ Shortcut: "Bulk action"                  col=6 │
├────────────────────────────────────────────────┤
│ Card: Filters / Saved Views              col=4 │
└────────────────────────────────────────────────┘
```

KPI stack (left) + trend chart (right) → two wide action shortcuts → card
of saved/filtered list views. Exemplars: `inspector_dashboard/`,
`verification_ledger/`.

Use for workflows where the user processes a queue.

## Pattern 4 — Financial / Treasury

```
┌────────────────────────────────────────────────┐
│ Header                                   col=12 │
├──────────┬──────────┬──────────┬──────────────┤
│ Metric   │ Metric   │ Metric   │ Metric  col=3│
├────────────────────────────┬───────────────────┤
│ Chart: Timeseries          │ Chart: Distrib    │
│                          col=6                 │
├────────────────────────────┴───────────────────┤
│ Card: Reports                           col=4  │
│ Card: Pending Approvals                 col=4  │
│ Card: Settings                          col=4  │
└────────────────────────────────────────────────┘
```

Dense metrics row → side-by-side charts → three small cards.
Exemplar: `finance_intelligence/`.

Use for finance/ops/exec dashboards where numbers come first.

## Pattern 5 — Content Hub

```
┌────────────────────────────────────────────────┐
│ Header + paragraph intro                 col=12 │
├────────────────────────────────────────────────┤
│ Card Break: "Getting Started"                   │
│   - Link  - Link  - Link                        │
│ Card Break: "Advanced"                          │
│   - Link  - Link                                │
└────────────────────────────────────────────────┘
```

Light on widgets, heavy on sidebar links organized by topic. Exemplar:
`content_and_knowledge/`.

Use for help centers, documentation hubs, onboarding pages.

## How to rebuild one in your own app

1. Create a new Workspace via the desk UI, or drop a JSON in
   `<your_app>/<your_app>/workspace/<slug>/<slug>.json` following the
   shape in `WORKSPACE-ANATOMY.md`.
2. Reference YOUR DocTypes, YOUR Number Cards, YOUR Dashboard Charts.
3. Copy the `content` grid composition from the pattern above, adjusting
   `number_card_name` / `shortcut_name` / `card_name` to match rows you
   actually defined in `shortcuts` / `links` / `number_cards` / `charts`.
4. Run `bench --site <site> migrate` to sync the workspace.
5. `bench --site <site> build --app <your_app>` to refresh assets.

The AXK Theme app already ships the CSS that styles these layouts — the
card padding, shortcut button treatment, number card chrome, and chart
tile polish all apply to any workspace with this shape, regardless of
which DocTypes you link.
