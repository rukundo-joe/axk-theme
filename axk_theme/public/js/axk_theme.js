(function () {
    "use strict";

    var cfg = Object.assign(
        {
            brandName: null,
            faviconPath: null,
            enableLinkFieldHoverAffordance: true,
            enableNotificationBellFix: true,
        },
        window.AXKThemeConfig || {}
    );
    window.AXKThemeConfig = cfg;

    function rebrand() {
        if (!cfg.brandName) return;

        if (document.title === "Frappe" || document.title === "Setup") {
            document.title = cfg.brandName;
        }

        if (cfg.faviconPath) {
            var favicon = document.querySelector(
                'link[rel="shortcut icon"], link[rel="icon"]'
            );
            if (favicon) favicon.href = cfg.faviconPath;
        }

        try {
            var descriptor =
                Object.getOwnPropertyDescriptor(Document.prototype, "title") ||
                Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "title");
            if (descriptor && descriptor.set) {
                Object.defineProperty(document, "title", {
                    get: function () {
                        return descriptor.get.call(document);
                    },
                    set: function (val) {
                        val = (val || "").replace(/Frappe/g, cfg.brandName);
                        descriptor.set.call(document, val);
                    },
                });
            }
        } catch (e) {}

        setTimeout(function () {
            document
                .querySelectorAll(".page-card-head h4")
                .forEach(function (el) {
                    if (el.textContent.indexOf("Frappe") > -1) {
                        el.textContent = el.textContent.replace(
                            /Frappe/g,
                            cfg.brandName
                        );
                    }
                });
        }, 50);
    }

    function updateGreeting() {
        var hour = new Date().getHours();
        var timeWord = "morning";
        if (hour >= 12 && hour < 17) timeWord = "afternoon";
        else if (hour >= 17) timeWord = "evening";

        document.querySelectorAll(".axk-greeting-time").forEach(function (el) {
            el.textContent = timeWord;
        });

        var userFullname = "there";
        try {
            if (typeof frappe !== "undefined" && frappe.session) {
                userFullname = frappe.session.user_fullname || frappe.session.user || "there";
            }
        } catch (e) {}
        var firstName = (userFullname || "there").split(" ")[0];
        document.querySelectorAll(".axk-greeting-user").forEach(function (el) {
            el.textContent = firstName;
        });

        try {
            var date = new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
            });
            document.querySelectorAll(".axk-greeting-date").forEach(function (el) {
                el.textContent = date;
            });
        } catch (e) {}
    }

    function hookGreetingIntoRouter() {
        if (typeof frappe === "undefined" || !frappe.router || !frappe.router.on) return;
        frappe.router.on("change", function () {
            setTimeout(updateGreeting, 200);
        });
    }

    function populateCount(el) {
        if (el._axkPopulated) return;
        var dt = el.getAttribute("data-axk-count");
        if (!dt || typeof frappe === "undefined" || !frappe.db) return;
        el._axkPopulated = true;
        frappe.db.count(dt).then(function (n) {
            el.textContent = (n || 0).toLocaleString();
        }).catch(function () { el.textContent = "—"; el._axkPopulated = false; });
    }

    function populateTable(el) {
        if (el._axkPopulated) return;
        var dt = el.getAttribute("data-axk-table");
        if (!dt || typeof frappe === "undefined" || !frappe.db) return;
        el._axkPopulated = true;
        var cols = (el.getAttribute("data-axk-columns") || "name,creation").split(",");
        frappe.db.get_list(dt, {
            fields: cols.concat(["name"]),
            limit: 5,
            order_by: "creation desc",
        }).then(function (rows) {
            if (!rows || !rows.length) {
                el.innerHTML = '<span style="display:block;padding:14px;font-size:12px;color:var(--axk-text-secondary);text-align:center;">No records yet.</span>';
                return;
            }
            var headCells = cols.map(function (c) {
                return '<th style="text-align:left;font-weight:500;color:var(--axk-text-secondary);padding:8px 10px;border-bottom:1px solid var(--axk-border);font-size:11px;text-transform:uppercase;letter-spacing:0.04em;">' + c.replace(/_/g, " ") + "</th>";
            }).join("");
            var bodyRows = rows.map(function (r) {
                var href = "/app/" + dt.toLowerCase().replace(/ /g, "-") + "/" + encodeURIComponent(r.name);
                var tds = cols.map(function (c, i) {
                    var v = r[c];
                    if (v && c === "creation") {
                        try { v = new Date(v).toLocaleDateString(); } catch (e) {}
                    }
                    v = v == null ? "—" : String(v);
                    var cellStyle = "padding:10px;border-bottom:1px solid var(--axk-border);color:var(--axk-text);";
                    return i === 0
                        ? '<td style="' + cellStyle + '"><a href="' + href + '" style="color:var(--axk-primary);text-decoration:none;font-weight:500;">' + v + "</a></td>"
                        : '<td style="' + cellStyle + '">' + v + "</td>";
                }).join("");
                return "<tr>" + tds + "</tr>";
            }).join("");
            el.innerHTML =
                '<table style="width:100%;font-size:13px;border-collapse:collapse;"><thead><tr>' + headCells + "</tr></thead><tbody>" +
                bodyRows + "</tbody></table>";
        }).catch(function () {
            el.innerHTML = '<span style="display:block;padding:14px;font-size:12px;color:var(--axk-text-secondary);text-align:center;">Could not load.</span>';
            el._axkPopulated = false;
        });
    }

    function populateHomeDashboard() {
        document.querySelectorAll("[data-axk-count]").forEach(populateCount);
        document.querySelectorAll("[data-axk-table]").forEach(populateTable);
    }

    function installDashboardObserver() {
        var target = document.body || document.documentElement;
        if (!target || typeof MutationObserver === "undefined") return;
        var mo = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                    var n = mutations[i].addedNodes[j];
                    if (n.nodeType !== 1) continue;
                    if (n.hasAttribute && n.hasAttribute("data-axk-count")) populateCount(n);
                    if (n.hasAttribute && n.hasAttribute("data-axk-table")) populateTable(n);
                    if (n.querySelectorAll) {
                        n.querySelectorAll("[data-axk-count]").forEach(populateCount);
                        n.querySelectorAll("[data-axk-table]").forEach(populateTable);
                    }
                    if (n.querySelectorAll) {
                        n.querySelectorAll(".axk-greeting-time, .axk-greeting-user, .axk-greeting-date").forEach(function () { updateGreeting(); });
                    }
                }
            }
        });
        mo.observe(target, { childList: true, subtree: true });
    }

    var pollTimer = null;
    function startDashboardPolling() {
        if (pollTimer) return;
        var attempts = 0;
        pollTimer = setInterval(function () {
            attempts++;
            updateGreeting();
            populateHomeDashboard();
            var remaining = document.querySelectorAll(
                "[data-axk-count]:not([data-axk-done]), [data-axk-table]:not([data-axk-done])"
            );
            remaining.forEach(function (el) {
                if (el._axkPopulated) el.setAttribute("data-axk-done", "1");
            });
            if (remaining.length === 0 || attempts > 75) {
                clearInterval(pollTimer);
                pollTimer = null;
            }
        }, 200);
    }

    function boot() {
        rebrand();
        installDashboardObserver();
        hookGreetingIntoRouter();
        startDashboardPolling();

        if (typeof frappe !== "undefined" && frappe.router && frappe.router.on) {
            frappe.router.on("change", function () {
                document.querySelectorAll("[data-axk-done]").forEach(function (el) {
                    el.removeAttribute("data-axk-done");
                    el._axkPopulated = false;
                });
                startDashboardPolling();
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
