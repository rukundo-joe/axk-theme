import frappe

no_cache = 1
no_sitemap = 1


def get_context(context):
    context.no_breadcrumbs = True
    context.no_header = True
    context.full_width = True
    context.title = "AXK Network \u2014 Public Verification"
