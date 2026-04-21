# AXK Theme

A Frappe theme app that applies the AXK Network brand to your bench.
It ships brand colors, desk polish, branded public pages (login,
signup, verify, contact, privacy, terms), a Website Theme record, and
one starter workspace with a small home dashboard. No business logic,
no DocTypes.

## Install

```bash
bench get-app https://github.com/rukundo-joe/axk-theme
bench --site <site> install-app axk_theme
bench build --app axk_theme
bench restart
```

## Customize

### Colors

Brand tokens live in `axk_theme/public/css/axk_brand.css`. Load your
own stylesheet after it and override what you need:

```css
:root {
  --axk-primary: #5B2E91;
}
```

One variable retints the whole theme. For more control, also set
`--axk-primary-hover`, `--axk-primary-active`, `--axk-accent`, or
`--font-stack`.

### Page titles

Set `window.AXKThemeConfig` before the theme JS loads:

```js
window.AXKThemeConfig = {
  brandName: "Acme ERP",
  faviconPath: "/assets/my_app/favicon.ico",
};
```

Leave it unset and the Frappe defaults stay.

### Templates and images

Fork the repo and edit:

* `axk_theme/www/login.html` for the heading, tagline, and illustration
* `axk_theme/www/verify.html`, `contact.html`, `privacy.html`, `terms.html`
* `axk_theme/public/images/` for the favicon, logo, and illustration

## Workspaces

The app installs one starter workspace called **AXK Home**. It is a
small dashboard that works on any bench because every count and table
points at a standard Frappe DocType (User, Role, Email Template,
Notification). Swap those attributes for your own DocTypes when you
fork.

What you get:

* A greeting hero that picks up the time of day and the logged in
  user's first name.
* Five KPI tiles. Each tile has a `data-axk-count="DocType"` attribute
  that the theme JS fills in via `frappe.db.count`.
* Two chart card placeholders and a recent records table with
  `data-axk-table="DocType"`, fed by `frappe.db.get_list`.
* Four sidebar shortcut cards into Users, Roles, Email Templates, and
  Notifications.

### How a Frappe workspace actually renders

Mostly it is JSON. The `tabWorkspace.content` field holds an array of
blocks (header, paragraph, card, shortcut, number_card, chart, spacer,
custom_block) and Frappe's built in widget JS renders each block. Four
child tables (`Workspace Link`, `Workspace Shortcut`, `Workspace
Number Card`, `Workspace Chart`) hold the rows those blocks reference
by name.

`custom_block` is the escape hatch for fully bespoke widgets. Frappe
looks up a registered JS handler by name and hands it the block data.
AXK's internal workspaces use this for ApexChart dashboards, which we
do not ship here so the theme stays portable.

AXK Home skips `custom_block` entirely. It uses `paragraph` blocks
with inline styles and `data-axk-*` hooks that the theme JS fills in
on page load and on every route change.

See `reference/WORKSPACE-ANATOMY.md` for a field by field breakdown
and `reference/WORKSPACE-PATTERNS.md` for five reusable layouts.

## Uninstall

```bash
bench --site <site> uninstall-app axk_theme
```

This removes the Website Theme record, the AXK Home workspace, its
Number Cards and Dashboard Charts, and the module def. The standard
Website Theme takes over again.

## License

MIT.
