from . import __version__ as app_version

app_name = "axk_theme"
app_title = "AXK Theme"
app_publisher = "Afrikabal"
app_description = "AXK Network brand styling and public page templates."
app_email = "team@afrikabal.org"
app_license = "MIT"

app_include_css = [
    "/assets/axk_theme/css/axk_brand.css",
    "/assets/axk_theme/css/axk_desk.css",
]
app_include_js = [
    "/assets/axk_theme/js/axk_theme.js",
]

web_include_css = [
    "/assets/axk_theme/css/axk_brand.css",
    "/assets/axk_theme/css/axk_login.css",
    "/assets/axk_theme/css/axk_pages.css",
]
web_include_js = [
    "/assets/axk_theme/js/axk_theme.js",
]

fixtures = [
    {"dt": "Website Theme", "filters": [["name", "in", ["AXK"]]]},
    {"dt": "Workspace", "filters": [["name", "in", ["AXK Home"]]]},
    {"dt": "Number Card", "filters": [["name", "like", "AXK Home —%"]]},
    {"dt": "Dashboard Chart", "filters": [["name", "like", "AXK Home —%"]]},
]
