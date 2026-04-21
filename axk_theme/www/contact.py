import frappe
from frappe import _

sitemap = 1
no_cache = 1


def get_context(context):
    doc = frappe.get_doc("Contact Us Settings", "Contact Us Settings")

    if doc.query_options:
        query_options = [opt.strip() for opt in doc.query_options.replace(",", "\n").split("\n") if opt]
    else:
        query_options = ["General", "Sales", "Technical Support", "Trading & Orders", "Compliance", "Billing"]

    context.query_options = query_options
    context.no_breadcrumbs = True
    context.full_width = True
    context.parents = [{"name": _("Home"), "route": "/"}]
