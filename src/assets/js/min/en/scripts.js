function debounce(e, t, n) {
    var i;
    return function() {
        var o = this,
            r = arguments,
            a = n && !i;
        clearTimeout(i), i = setTimeout(function() {
            i = null, n || e.apply(o, r)
        }, t), a && e.apply(o, r)
    }
}! function(e) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? e(require("jquery"), window, document) : e(jQuery, window, document)
}(function(e, t, n, i) {
    "use strict";
    if (!t.history.pushState) return e.fn.smoothState = function() {
        return this
    }, void(e.fn.smoothState.options = {});
    if (!e.fn.smoothState) {
        var o = e("html, body"),
            r = t.console,
            a = {
                debug: !1,
                anchors: "a",
                hrefRegex: "",
                forms: "form",
                allowFormCaching: !1,
                repeatDelay: 500,
                blacklist: ".no-smoothState",
                prefetch: !1,
                prefetchOn: "mouseover touchstart",
                prefetchBlacklist: ".no-prefetch",
                cacheLength: 0,
                loadingClass: "is-loading",
                scroll: !0,
                alterRequest: function(e) {
                    return e
                },
                alterChangeState: function(e, t, n) {
                    return e
                },
                onBefore: function(e, t) {},
                onStart: {
                    duration: 0,
                    render: function(e) {}
                },
                onProgress: {
                    duration: 0,
                    render: function(e) {}
                },
                onReady: {
                    duration: 0,
                    render: function(e, t) {
                        e.html(t)
                    }
                },
                onAfter: function(e, t) {}
            },
            s = {
                isExternal: function(e) {
                    var n = e.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
                    return "string" == typeof n[1] && n[1].length > 0 && n[1].toLowerCase() !== t.location.protocol || "string" == typeof n[2] && n[2].length > 0 && n[2].replace(new RegExp(":(" + {
                        "http:": 80,
                        "https:": 443
                    }[t.location.protocol] + ")?$"), "") !== t.location.host
                },
                stripHash: function(e) {
                    return e.replace(/#.*/, "")
                },
                isHash: function(e, n) {
                    n = n || t.location.href;
                    var i = e.indexOf("#") > -1,
                        o = s.stripHash(e) === s.stripHash(n);
                    return i && o
                },
                translate: function(t) {
                    var n = {
                        dataType: "html",
                        type: "GET"
                    };
                    return t = "string" == typeof t ? e.extend({}, n, {
                        url: t
                    }) : e.extend({}, n, t)
                },
                shouldLoadAnchor: function(e, t, n) {
                    var o = e.prop("href");
                    return !(s.isExternal(o) || s.isHash(o) || e.is(t) || e.prop("target") || typeof n !== i && "" !== n && -1 === e.prop("href").search(n))
                },
                clearIfOverCapacity: function(e, t) {
                    return Object.keys || (Object.keys = function(e) {
                        var t, n = [];
                        for (t in e) Object.prototype.hasOwnProperty.call(e, t) && n.push(t);
                        return n
                    }), Object.keys(e).length > t && (e = {}), e
                },
                storePageIn: function(t, n, i, o, r) {
                    var a = e("<html></html>").append(e(i));
                    return t[n] = {
                        status: "loaded",
                        title: a.find("title").first().text(),
                        html: a.find("#" + o),
                        doc: i,
                        state: r
                    }, t
                },
                triggerAllAnimationEndEvent: function(t, n) {
                    n = " " + n || "";
                    var i = 0;
                    t.on("animationstart webkitAnimationStart oanimationstart MSAnimationStart", function(n) {
                        e(n.delegateTarget).is(t) && (n.stopPropagation(), i++)
                    }), t.on("animationend webkitAnimationEnd oanimationend MSAnimationEnd", function(n) {
                        e(n.delegateTarget).is(t) && (n.stopPropagation(), 0 == --i && t.trigger("allanimationend"))
                    }), t.on("allanimationend" + n, function() {
                        i = 0, s.redraw(t)
                    })
                },
                redraw: function(e) {
                    e.height()
                }
            },
            c = function(a, c) {
                var l = e(a),
                    p = l.prop("id"),
                    h = null,
                    d = !1,
                    u = {},
                    f = {},
                    m = t.location.href,
                    g = function(e) {
                        (e = e || !1) && u.hasOwnProperty(e) ? delete u[e] : u = {}, l.data("smoothState").cache = u
                    },
                    v = function(t, n) {
                        n = n || e.noop;
                        var i = s.translate(t);
                        if (!(u = s.clearIfOverCapacity(u, c.cacheLength)).hasOwnProperty(i.url) || void 0 !== i.data) {
                            u[i.url] = {
                                status: "fetching"
                            };
                            var o = e.ajax(i);
                            o.done(function(e) {
                                s.storePageIn(u, i.url, e, p), l.data("smoothState").cache = u
                            }), o.fail(function() {
                                u[i.url].status = "error"
                            }), n && o.always(n)
                        }
                    },
                    w = function() {
                        if (h) {
                            var t = e(h, l);
                            if (t.length) {
                                var n = t.offset().top;
                                o.scrollTop(n)
                            }
                            h = null
                        }
                    },
                    y = function(i) {
                        var a = "#" + p,
                            s = u[i] ? e(u[i].html.html()) : null;
                        s.length ? (n.title = u[i].title, l.data("smoothState").href = i, c.loadingClass && o.removeClass(c.loadingClass), c.onReady.render(l, s), l.one("ss.onReadyEnd", function() {
                            d = !1, c.onAfter(l, s), c.scroll && w(), T(l)
                        }), t.setTimeout(function() {
                            l.trigger("ss.onReadyEnd")
                        }, c.onReady.duration)) : !s && c.debug && r ? r.warn("No element with an id of " + a + " in response from " + i + " in " + u) : t.location = i
                    },
                    k = function(e, n, i) {
                        var a = s.translate(e);
                        void 0 === n && (n = !0), void 0 === i && (i = !0);
                        var h = !1,
                            d = !1,
                            m = {
                                loaded: function() {
                                    var e = h ? "ss.onProgressEnd" : "ss.onStartEnd";
                                    d && h ? d && y(a.url) : l.one(e, function() {
                                        y(a.url), i || g(a.url)
                                    }), n && (f = c.alterChangeState({
                                        id: p
                                    }, u[a.url].title, a.url), u[a.url].state = f, t.history.pushState(f, u[a.url].title, a.url)), d && !i && g(a.url)
                                },
                                fetching: function() {
                                    h || (h = !0, l.one("ss.onStartEnd", function() {
                                        c.loadingClass && o.addClass(c.loadingClass), c.onProgress.render(l), t.setTimeout(function() {
                                            l.trigger("ss.onProgressEnd"), d = !0
                                        }, c.onProgress.duration)
                                    })), t.setTimeout(function() {
                                        u.hasOwnProperty(a.url) && m[u[a.url].status]()
                                    }, 10)
                                },
                                error: function() {
                                    c.debug && r ? r.log("There was an error loading: " + a.url) : t.location = a.url
                                }
                            };
                        u.hasOwnProperty(a.url) || v(a), c.onStart.render(l), t.setTimeout(function() {
                            c.scroll && o.scrollTop(0), l.trigger("ss.onStartEnd")
                        }, c.onStart.duration), m[u[a.url].status]()
                    },
                    b = function(t) {
                        var n, i = e(t.currentTarget);
                        s.shouldLoadAnchor(i, c.blacklist, c.hrefRegex) && !d && (t.stopPropagation(), n = s.translate(i.prop("href")), n = c.alterRequest(n), v(n))
                    },
                    $ = function(t) {
                        var n = e(t.currentTarget);
                        if (!t.metaKey && !t.ctrlKey && s.shouldLoadAnchor(n, c.blacklist, c.hrefRegex) && (t.stopPropagation(), t.preventDefault(), !E())) {
                            x();
                            var i = s.translate(n.prop("href"));
                            d = !0, h = n.prop("hash"), i = c.alterRequest(i), c.onBefore(n, l), k(i)
                        }
                    },
                    C = function(t) {
                        var n = e(t.currentTarget);
                        if (!n.is(c.blacklist) && (t.preventDefault(), t.stopPropagation(), !E())) {
                            x();
                            var o = {
                                url: n.prop("action"),
                                data: n.serialize(),
                                type: n.prop("method")
                            };
                            d = !0, "get" === (o = c.alterRequest(o)).type.toLowerCase() && (o.url = o.url + "?" + o.data), c.onBefore(n, l), k(o, i, c.allowFormCaching)
                        }
                    },
                    S = 0,
                    E = function() {
                        var e = null === c.repeatDelay,
                            t = parseInt(Date.now()) > S;
                        return !(e || t)
                    },
                    x = function() {
                        S = parseInt(Date.now()) + parseInt(c.repeatDelay)
                    },
                    T = function(e) {
                        c.anchors && c.prefetch && e.find(c.anchors).not(c.prefetchBlacklist).on(c.prefetchOn, null, b)
                    };
                return c = e.extend({}, e.fn.smoothState.options, c), null === t.history.state ? (f = c.alterChangeState({
                        id: p
                    }, n.title, m), t.history.replaceState(f, n.title, m)) : f = {}, s.storePageIn(u, m, n.documentElement.outerHTML, p, f), s.triggerAllAnimationEndEvent(l, "ss.onStartEnd ss.onProgressEnd ss.onEndEnd"),
                    function(e) {
                        c.anchors && (e.on("click", c.anchors, $), T(e)), c.forms && e.on("submit", c.forms, C)
                    }(l), {
                        href: m,
                        cache: u,
                        clear: g,
                        load: k,
                        fetch: v,
                        restartCSSAnimations: function() {
                            var e = l.prop("class");
                            l.removeClass(e), s.redraw(l), l.addClass(e)
                        }
                    }
            };
        t.onpopstate = function(n) {
            if (null !== n.state) {
                var i = t.location.href,
                    o = e("#" + n.state.id).data("smoothState"),
                    r = o.href !== i && !s.isHash(i, o.href),
                    a = n.state !== o.cache[o.href].state;
                (r || a) && (a && o.clear(o.href), o.load(i, !1))
            }
        }, e.smoothStateUtility = s, e.fn.smoothState = function(t) {
            return this.each(function() {
                var n = this.tagName.toLowerCase();
                this.id && "body" !== n && "html" !== n && !e.data(this, "smoothState") ? e.data(this, "smoothState", new c(this, t)) : !this.id && r ? r.warn("Every smoothState container needs an id but the following one does not have one:", this) : "body" !== n && "html" !== n || !r || r.warn("The smoothstate container cannot be the " + this.tagName + " tag")
            })
        }, e.fn.smoothState.options = a
    }
}),
function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof module && module.exports ? module.exports = e(require("jquery")) : e(jQuery)
}(function(e) {
    var t = Array.prototype.slice,
        n = Array.prototype.splice,
        i = {
            topSpacing: 0,
            bottomSpacing: 0,
            className: "is-sticky",
            wrapperClassName: "sticky-wrapper",
            center: !1,
            getWidthFrom: "",
            widthFromWrapper: !0,
            responsiveWidth: !1,
            zIndex: "inherit"
        },
        o = e(window),
        r = e(document),
        a = [],
        s = o.height(),
        c = function() {
            for (var t = o.scrollTop(), n = r.height(), i = n - s, c = t > i ? i - t : 0, l = 0, p = a.length; l < p; l++) {
                var h = a[l],
                    d = h.stickyWrapper.offset().top - h.topSpacing - c;
                if (h.stickyWrapper.css("height", h.stickyElement.outerHeight()), t <= d) null !== h.currentTop && (h.stickyElement.css({
                    width: "",
                    position: "",
                    top: "",
                    "z-index": ""
                }), h.stickyElement.parent().removeClass(h.className), h.stickyElement.trigger("sticky-end", [h]), h.currentTop = null);
                else {
                    var u = n - h.stickyElement.outerHeight() - h.topSpacing - h.bottomSpacing - t - c;
                    if (u < 0 ? u += h.topSpacing : u = h.topSpacing, h.currentTop !== u) {
                        var f;
                        h.getWidthFrom ? (padding = h.stickyElement.innerWidth() - h.stickyElement.width(), f = e(h.getWidthFrom).width() - padding || null) : h.widthFromWrapper && (f = h.stickyWrapper.width()), null == f && (f = h.stickyElement.width()), h.stickyElement.css("width", f).css("position", "fixed").css("top", u).css("z-index", h.zIndex), h.stickyElement.parent().addClass(h.className), null === h.currentTop ? h.stickyElement.trigger("sticky-start", [h]) : h.stickyElement.trigger("sticky-update", [h]), h.currentTop === h.topSpacing && h.currentTop > u || null === h.currentTop && u < h.topSpacing ? h.stickyElement.trigger("sticky-bottom-reached", [h]) : null !== h.currentTop && u === h.topSpacing && h.currentTop < u && h.stickyElement.trigger("sticky-bottom-unreached", [h]), h.currentTop = u
                    }
                    var m = h.stickyWrapper.parent();
                    h.stickyElement.offset().top + h.stickyElement.outerHeight() >= m.offset().top + m.outerHeight() && h.stickyElement.offset().top <= h.topSpacing ? h.stickyElement.css("position", "absolute").css("top", "").css("bottom", 0).css("z-index", "") : h.stickyElement.css("position", "fixed").css("top", u).css("bottom", "").css("z-index", h.zIndex)
                }
            }
        },
        l = function() {
            s = o.height();
            for (var t = 0, n = a.length; t < n; t++) {
                var i = a[t],
                    r = null;
                i.getWidthFrom ? i.responsiveWidth && (r = e(i.getWidthFrom).width()) : i.widthFromWrapper && (r = i.stickyWrapper.width()), null != r && i.stickyElement.css("width", r)
            }
        },
        p = {
            init: function(t) {
                return this.each(function() {
                    var n = e.extend({}, i, t),
                        o = e(this),
                        r = o.attr("id"),
                        s = r ? r + "-" + i.wrapperClassName : i.wrapperClassName,
                        c = e("<div></div>").attr("id", s).addClass(n.wrapperClassName);
                    o.wrapAll(function() {
                        if (0 == e(this).parent("#" + s).length) return c
                    });
                    var l = o.parent();
                    n.center && l.css({
                        width: o.outerWidth(),
                        marginLeft: "auto",
                        marginRight: "auto"
                    }), "right" === o.css("float") && o.css({
                        float: "none"
                    }).parent().css({
                        float: "right"
                    }), n.stickyElement = o, n.stickyWrapper = l, n.currentTop = null, a.push(n), p.setWrapperHeight(this), p.setupChangeListeners(this)
                })
            },
            setWrapperHeight: function(t) {
                var n = e(t),
                    i = n.parent();
                i && i.css("height", n.outerHeight())
            },
            setupChangeListeners: function(e) {
                window.MutationObserver ? new window.MutationObserver(function(t) {
                    (t[0].addedNodes.length || t[0].removedNodes.length) && p.setWrapperHeight(e)
                }).observe(e, {
                    subtree: !0,
                    childList: !0
                }) : window.addEventListener ? (e.addEventListener("DOMNodeInserted", function() {
                    p.setWrapperHeight(e)
                }, !1), e.addEventListener("DOMNodeRemoved", function() {
                    p.setWrapperHeight(e)
                }, !1)) : window.attachEvent && (e.attachEvent("onDOMNodeInserted", function() {
                    p.setWrapperHeight(e)
                }), e.attachEvent("onDOMNodeRemoved", function() {
                    p.setWrapperHeight(e)
                }))
            },
            update: c,
            unstick: function(t) {
                return this.each(function() {
                    for (var t = this, i = e(t), o = -1, r = a.length; r-- > 0;) a[r].stickyElement.get(0) === t && (n.call(a, r, 1), o = r); - 1 !== o && (i.unwrap(), i.css({
                        width: "",
                        position: "",
                        top: "",
                        float: "",
                        "z-index": ""
                    }))
                })
            }
        };
    window.addEventListener ? (window.addEventListener("scroll", c, !1), window.addEventListener("resize", l, !1)) : window.attachEvent && (window.attachEvent("onscroll", c), window.attachEvent("onresize", l)), e.fn.sticky = function(n) {
        return p[n] ? p[n].apply(this, t.call(arguments, 1)) : "object" != typeof n && n ? void e.error("Method " + n + " does not exist on jQuery.sticky") : p.init.apply(this, arguments)
    }, e.fn.unstick = function(n) {
        return p[n] ? p[n].apply(this, t.call(arguments, 1)) : "object" != typeof n && n ? void e.error("Method " + n + " does not exist on jQuery.sticky") : p.unstick.apply(this, arguments)
    }, e(function() {
        setTimeout(c, 0)
    })
}),
function(e, t) {
    "use strict";
    "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? module.exports = t() : e.Headroom = t()
}(this, function() {
    "use strict";

    function e(e) {
        this.callback = e, this.ticking = !1
    }

    function t(e) {
        return e && "undefined" != typeof window && (e === window || e.nodeType)
    }

    function n(e) {
        if (arguments.length <= 0) throw new Error("Missing arguments in extend function");
        var i, o, r = e || {};
        for (o = 1; o < arguments.length; o++) {
            var a = arguments[o] || {};
            for (i in a) "object" != typeof r[i] || t(r[i]) ? r[i] = r[i] || a[i] : r[i] = n(r[i], a[i])
        }
        return r
    }

    function i(e) {
        return e === Object(e) ? e : {
            down: e,
            up: e
        }
    }

    function o(e, t) {
        t = n(t, o.options), this.lastKnownScrollY = 0, this.elem = e, this.tolerance = i(t.tolerance), this.classes = t.classes, this.offset = t.offset, this.scroller = t.scroller, this.initialised = !1, this.onPin = t.onPin, this.onUnpin = t.onUnpin, this.onTop = t.onTop, this.onNotTop = t.onNotTop, this.onBottom = t.onBottom, this.onNotBottom = t.onNotBottom
    }
    var r = {
        bind: !! function() {}.bind,
        classList: "classList" in document.documentElement,
        rAF: !!(window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame)
    };
    return window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame, e.prototype = {
        constructor: e,
        update: function() {
            this.callback && this.callback(), this.ticking = !1
        },
        requestTick: function() {
            this.ticking || (requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this))), this.ticking = !0)
        },
        handleEvent: function() {
            this.requestTick()
        }
    }, o.prototype = {
        constructor: o,
        init: function() {
            return o.cutsTheMustard ? (this.debouncer = new e(this.update.bind(this)), this.elem.classList.add(this.classes.initial), setTimeout(this.attachEvent.bind(this), 100), this) : void 0
        },
        destroy: function() {
            var e = this.classes;
            this.initialised = !1, this.elem.classList.remove(e.unpinned, e.pinned, e.top, e.notTop, e.initial), this.scroller.removeEventListener("scroll", this.debouncer, !1)
        },
        attachEvent: function() {
            this.initialised || (this.lastKnownScrollY = this.getScrollY(), this.initialised = !0, this.scroller.addEventListener("scroll", this.debouncer, !1), this.debouncer.handleEvent())
        },
        unpin: function() {
            var e = this.elem.classList,
                t = this.classes;
            !e.contains(t.pinned) && e.contains(t.unpinned) || (e.add(t.unpinned), e.remove(t.pinned), this.onUnpin && this.onUnpin.call(this))
        },
        pin: function() {
            var e = this.elem.classList,
                t = this.classes;
            e.contains(t.unpinned) && (e.remove(t.unpinned), e.add(t.pinned), this.onPin && this.onPin.call(this))
        },
        top: function() {
            var e = this.elem.classList,
                t = this.classes;
            e.contains(t.top) || (e.add(t.top), e.remove(t.notTop), this.onTop && this.onTop.call(this))
        },
        notTop: function() {
            var e = this.elem.classList,
                t = this.classes;
            e.contains(t.notTop) || (e.add(t.notTop), e.remove(t.top), this.onNotTop && this.onNotTop.call(this))
        },
        bottom: function() {
            var e = this.elem.classList,
                t = this.classes;
            e.contains(t.bottom) || (e.add(t.bottom), e.remove(t.notBottom), this.onBottom && this.onBottom.call(this))
        },
        notBottom: function() {
            var e = this.elem.classList,
                t = this.classes;
            e.contains(t.notBottom) || (e.add(t.notBottom), e.remove(t.bottom), this.onNotBottom && this.onNotBottom.call(this))
        },
        getScrollY: function() {
            return void 0 !== this.scroller.pageYOffset ? this.scroller.pageYOffset : void 0 !== this.scroller.scrollTop ? this.scroller.scrollTop : (document.documentElement || document.body.parentNode || document.body).scrollTop
        },
        getViewportHeight: function() {
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        },
        getElementPhysicalHeight: function(e) {
            return Math.max(e.offsetHeight, e.clientHeight)
        },
        getScrollerPhysicalHeight: function() {
            return this.scroller === window || this.scroller === document.body ? this.getViewportHeight() : this.getElementPhysicalHeight(this.scroller)
        },
        getDocumentHeight: function() {
            var e = document.body,
                t = document.documentElement;
            return Math.max(e.scrollHeight, t.scrollHeight, e.offsetHeight, t.offsetHeight, e.clientHeight, t.clientHeight)
        },
        getElementHeight: function(e) {
            return Math.max(e.scrollHeight, e.offsetHeight, e.clientHeight)
        },
        getScrollerHeight: function() {
            return this.scroller === window || this.scroller === document.body ? this.getDocumentHeight() : this.getElementHeight(this.scroller)
        },
        isOutOfBounds: function(e) {
            var t = 0 > e,
                n = e + this.getScrollerPhysicalHeight() > this.getScrollerHeight();
            return t || n
        },
        toleranceExceeded: function(e, t) {
            return Math.abs(e - this.lastKnownScrollY) >= this.tolerance[t]
        },
        shouldUnpin: function(e, t) {
            var n = e > this.lastKnownScrollY,
                i = e >= this.offset;
            return n && i && t
        },
        shouldPin: function(e, t) {
            var n = e < this.lastKnownScrollY,
                i = e <= this.offset;
            return n && t || i
        },
        update: function() {
            var e = this.getScrollY(),
                t = e > this.lastKnownScrollY ? "down" : "up",
                n = this.toleranceExceeded(e, t);
            this.isOutOfBounds(e) || (e <= this.offset ? this.top() : this.notTop(), e + this.getViewportHeight() >= this.getScrollerHeight() ? this.bottom() : this.notBottom(), this.shouldUnpin(e, n) ? this.unpin() : this.shouldPin(e, n) && this.pin(), this.lastKnownScrollY = e)
        }
    }, o.options = {
        tolerance: {
            up: 0,
            down: 0
        },
        offset: 0,
        scroller: window,
        classes: {
            pinned: "headroom--pinned",
            unpinned: "headroom--unpinned",
            top: "headroom--top",
            notTop: "headroom--not-top",
            bottom: "headroom--bottom",
            notBottom: "headroom--not-bottom",
            initial: "headroom"
        }
    }, o.cutsTheMustard = void 0 !== r && r.rAF && r.bind && r.classList, o
}),
function(e) {
    var t = !1;
    if ("function" == typeof define && define.amd && (define(e), t = !0), "object" == typeof exports && (module.exports = e(), t = !0), !t) {
        var n = window.Cookies,
            i = window.Cookies = e();
        i.noConflict = function() {
            return window.Cookies = n, i
        }
    }
}(function() {
    function e() {
        for (var e = 0, t = {}; e < arguments.length; e++) {
            var n = arguments[e];
            for (var i in n) t[i] = n[i]
        }
        return t
    }

    function t(n) {
        function i(t, o, r) {
            var a;
            if ("undefined" != typeof document) {
                if (arguments.length > 1) {
                    if ("number" == typeof(r = e({
                            path: "/"
                        }, i.defaults, r)).expires) {
                        var s = new Date;
                        s.setMilliseconds(s.getMilliseconds() + 864e5 * r.expires), r.expires = s
                    }
                    r.expires = r.expires ? r.expires.toUTCString() : "";
                    try {
                        a = JSON.stringify(o), /^[\{\[]/.test(a) && (o = a)
                    } catch (e) {}
                    o = n.write ? n.write(o, t) : encodeURIComponent(String(o)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), t = (t = (t = encodeURIComponent(String(t))).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)).replace(/[\(\)]/g, escape);
                    var c = "";
                    for (var l in r) r[l] && (c += "; " + l, !0 !== r[l] && (c += "=" + r[l]));
                    return document.cookie = t + "=" + o + c
                }
                t || (a = {});
                for (var p = document.cookie ? document.cookie.split("; ") : [], h = /(%[0-9A-Z]{2})+/g, d = 0; d < p.length; d++) {
                    var u = p[d].split("="),
                        f = u.slice(1).join("=");
                    '"' === f.charAt(0) && (f = f.slice(1, -1));
                    try {
                        var m = u[0].replace(h, decodeURIComponent);
                        if (f = n.read ? n.read(f, m) : n(f, m) || f.replace(h, decodeURIComponent), this.json) try {
                            f = JSON.parse(f)
                        } catch (e) {}
                        if (t === m) {
                            a = f;
                            break
                        }
                        t || (a[m] = f)
                    } catch (e) {}
                }
                return a
            }
        }
        return i.set = i, i.get = function(e) {
            return i.call(i, e)
        }, i.getJSON = function() {
            return i.apply({
                json: !0
            }, [].slice.call(arguments))
        }, i.defaults = {}, i.remove = function(t, n) {
            i(t, "", e(n, {
                expires: -1
            }))
        }, i.withConverter = t, i
    }
    return t(function() {})
});
var filterWidth = function() {
        var e = 0;
        $(".filter-container nav.filter ul li").each(function() {
            e += $(this).outerWidth()
        }), $(".filter-wrapper").width(e - 60)
    },
    paperContainerWidth = function() {
        $(".paper-container").each(function() {
            var e = 0;
            $(this).find(".paper:not(.view-all)").each(function() {
                var t = $(this).outerWidth();
                e = e + t + 10
            }), e += 10, $(this).width(e)
        })
    },
    convert = {
        changeMeasurement: function(e, t) {
            $("body").data("papertype");
            $("*[data-x]").each(function() {
                var n = $(this).attr("data-x"),
                    i = $(this).attr("data-y");
                "pixels" == t ? $(this).html(parseFloat((300 * n / e).toFixed(0)) + " × " + parseFloat((300 * i / e).toFixed(0))) : $(this).html(parseFloat((n * e).toFixed(1)) + " × " + parseFloat((i * e).toFixed(1)))
            })
        },
        changeUnit: function(e) {
            $(".unit").each(function() {
                $(this).text(e)
            })
        },
        changeLabels: function(e) {
            $(".main-header .unit-label, .sizes span").text(e)
        },
        tomm: function() {
            this.changeMeasurement(1), this.changeUnit("mm"), this.changeLabels("mm")
        },
        tocm: function() {
            this.changeMeasurement(.1), this.changeUnit("cm"), this.changeLabels("cm")
        },
        tom: function() {
            this.changeMeasurement(.001), this.changeUnit("m"), this.changeLabels("m")
        },
        toinches: function() {
            this.changeMeasurement(.0393701, "inches"), this.changeUnit("inches"), this.changeLabels("inches")
        },
        topoints: function() {
            this.changeMeasurement(2.835), this.changeUnit("points"), this.changeLabels("points")
        },
        topica: function() {
            this.changeMeasurement(.2362), this.changeUnit("picas"), this.changeLabels("picas")
        },
        topixels: function() {
            this.changeMeasurement(25.4, "pixels"), this.changeUnit("px"), this.changeLabels("px @300ppi")
        }
    },
    changeMeasurements = function(e) {
        "mm" == e ? convert.tomm() : "cm" == e ? convert.tocm() : "m" == e ? convert.tom() : "inches" == e ? convert.toinches() : "points" == e ? convert.topoints() : "pica" == e ? convert.topica() : "pixels" == e && convert.topixels(), $(".dropdown .toggle").removeClass("active"), $(".dropdown ul").fadeOut(250)
    };
$(function() {
        $(".paper-filter").sticky(), $("body").on("click tap", ".dropdown .toggle", function(e) {
            e.preventDefault();
            var t = $(this);
            $(this).hasClass("active") ? (t.parents(".dropdown").find("ul").fadeOut(250), t.removeClass("active")) : ($(".dropdown .toggle").removeClass("active"), $(".dropdown ul").fadeOut(250), t.parents(".dropdown").find("ul").fadeIn(250), t.addClass("active"))
        });
        var e = function(e, t) {
            $("body").removeClass(function(e, t) {
                return (t.match(/(^|\s)pallette-\S+/g) || []).join(" ")
            }), $("body").removeClass(function(e, t) {
                return (t.match(/(^|\s)shade-\S+/g) || []).join(" ")
            }), $("body").addClass("pallette-" + e + " shade-" + t), $("header.main-header .dropdown a.toggle").removeClass(function(e, t) {
                return (t.match(/(^|\s)col-\S+/g) || []).join(" ")
            }), $("header.main-header .dropdown a.toggle").addClass("col-" + e), $(".dropdown .toggle").removeClass("active"), $(".dropdown ul").fadeOut(250), Cookies.set("pagecolor", e), Cookies.set("pageshade", t)
        };
        $("body").on("click tap", ".pallette ul li a", function(t) {
            t.preventDefault();
            var n = $(this).attr("class"),
                i = $(this).attr("data-shade");
            e(n, i)
        });
        var t;
        $("body").on("click tap", ".unit-dropdown ul li button", function(e) {
            e.preventDefault(), t = $(this).attr("class"), changeMeasurements(t), Cookies.set("measurement", t)
        }), $(window).load(function() {
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (filterWidth(), paperContainerWidth())
        }), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && $("body").addClass("mobile-device"), $(document).ready(function() {
            void 0 !== Cookies.get("pagecolor") && e(Cookies.get("pagecolor"), Cookies.get("pageshade")), void 0 !== Cookies.get("measurement") && changeMeasurements(Cookies.get("measurement"))
        })
    }),
    function() {
        if ($(".preview .outline")) {
            var e = parseInt($(".preview .outline").attr("data-outline-x")),
                t = parseInt($(".preview .outline").attr("data-outline-y"));
            if (e < t) {
                var n = e / (t / $(".preview .outline").height());
                $(".preview .outline").width(n).fadeIn(750)
            } else {
                $(".preview .outline").addClass("landscape");
                var i = $(".preview .outline").width(),
                    o = t / (e / i);
                $(".preview .outline").height(o).css({
                    "margin-top": (i - o) / 2
                }).fadeIn(750)
            }
        }
    }();
var navbuttons = function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    else {
        var e = $("nav.filter .filter-wrapper > ul > li");
        morebtn = $("nav.filter li.more-btn"), moreBtnWidth = morebtn.width(), morebtn.hide();
        var t = [],
            n = $(".filter-container nav.filter ul").width(),
            i = 0;
        $(".filter-container nav.filter ul li").show(), $("ul.more-list").empty();
        for (var o = 1; o <= e.length - 1; o++) i += $("nav.filter .filter-wrapper > ul > li:nth-child(" + o + ")").width(), t[o] = i;
        var r = t.length;
        if (i >= n - moreBtnWidth - 10) {
            for (var a = 0; a < r; a++) t[a] > n - moreBtnWidth - 10 && ($("nav.filter .filter-wrapper > ul > li:eq(" + (a - 1) + ")").clone().appendTo("ul.more-list"), $("nav.filter .filter-wrapper > ul > li:eq(" + (a - 1) + ")").hide());
            $("nav.filter li.more-btn").show()
        } else $("li.more-btn").hide()
    }
};
$(".more-btn span").click(function() {
    $(".more-btn ul.more-list").fadeToggle(150), $(this).toggleClass("selected"), $(".filter-wrapper").toggleClass("ov-hidden")
});
var compareSelects = function() {
    function nameReplace(e) {
        return e.replace(" 1/2", "½").replace(" 1/4", "¼").replace(" 3/4", "¾").replace(" 5/8", "⅝").replace("é", "é").replace("É", "É").replace("è", "è").replace("###", "'")
    }

    function nameReplaceOpposite(e) {
        return e.replace("½", " 1/2").replace("¼", " 1/4").replace("¾", " 3/4").replace("⅝", " 5/8").replace("é", "é").replace("É", "É").replace("è", "è").replace("'", "###")
    }

    function linkReplace(e) {
        return e.replace("/", "").replace(/ /g, "-").replace("###", "").replace("'", "").replace("é", "e").replace("é", "e").replace("É", "e").replace("è", "e").replace(",", "").replace("½", "-12").replace("¼", "-14").replace("¾", "-34").replace("⅝", "-58").toLowerCase()
    }

    function getUrlVars() {
        for (var e, t = [], n = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&"), i = 0; i < n.length; i++) e = n[i].split("="), t.push(e[0]), t[e[0]] = e[1];
        return t
    }
    var paper1 = {},
        paper2 = {},
        findDimensions = function(e, t, n) {
            for (var i = n[e.cat], o = n[e.cat].length, r = 0; r < o; r++)
                if (linkReplace(i[r].paperName) === e.paper) {
                    var a = i[r];
                    1 == t ? (paper1.sizeX = a.sizex, paper1.sizeY = a.sizey, $(".paper-key-1").html(paper1.sizeX + " x " + paper1.sizeY).css("display", "inline-block"), $(".paper-key-1").attr("data-x", paper1.sizeX).attr("data-y", paper1.sizeY), $(".compare-unit.unit-1").css("display", "inline-block")) : 2 == t && (paper2.sizeX = a.sizex, paper2.sizeY = a.sizey, $(".paper-key-2").html(paper2.sizeX + " x " + paper2.sizeY).css("display", "inline-block"), $(".paper-key-2").attr("data-x", paper2.sizeX).attr("data-y", paper2.sizeY), $(".compare-unit.unit-2").css("display", "inline-block"))
                }
        },
        changeHistory = function(e) {
            (e = e).closest(".picker-wrapper").attr("data-picker");
            var t = "";
            t = void 0 === paper2.cat ? "compare?c1=" + linkReplace(paper1.cat) + "&p1=" + paper1.paper : "compare?c1=" + linkReplace(paper1.cat) + "&p1=" + paper1.paper + "&c2=" + linkReplace(paper2.cat) + "&p2=" + paper2.paper, history.replaceState(null, null, t)
        },
        selectedCategoryPicker = function(e, t, n) {
            function i() {
                o.find(".js-compare-papers").select2({
                    data: a,
                    placeholder: "Select a paper...",
                    width: "100%",
                    minimumResultsForSearch: -1
                })
            }
            var o = (e = e).closest(".picker-wrapper"),
                r = t,
                a = [],
                s = 0,
                c = (o.data("papernumber"), o.attr("data-picker")),
                l = t;
            $("#papersvg").hide(), 1 == c ? ((paper1 = {}).cat = l, $(".paper-key-1").html("").hide(), $(".picker-1 .js-compare-papers").show()) : 2 == c && ((paper2 = {}).cat = l, $(".paper-key-2").html("").hide(), $(".picker-2 .js-compare-papers").show());
            n[r].map(function(e) {
                var t = {
                    text: nameReplace(e.paperName),
                    id: s
                };
                a.push({
                    text: "",
                    id: ""
                }), a.push(t), s++
            });
            o.find(".js-compare-papers").hasClass("select2-hidden-accessible") ? (o.find(".js-compare-papers").select2("destroy").find("option").remove(), i()) : i()
        },
        selectedPaperPicker = function(e, t, n) {
            var t = t,
                i = (e = e).closest(".picker-wrapper").attr("data-picker");
            if (1 == i ? (paper1.paper = linkReplace(t), findDimensions(paper1, 1, n)) : 2 == i && (paper2.paper = linkReplace(t), findDimensions(paper2, 2, n)), changeMeasurements(void 0 !== Cookies.get("measurement") ? Cookies.get("measurement") : "mm"), paper1.hasOwnProperty("paper") && paper2.hasOwnProperty("paper")) {
                var o = $("#papersvg"),
                    r = $("#paper-solid"),
                    a = $("#paper-dashed");
                o.show();
                var s = 0,
                    c = 0,
                    l = parseInt(paper1.sizeX),
                    p = parseInt(paper2.sizeX),
                    h = parseInt(paper1.sizeY),
                    d = parseInt(paper2.sizeY);
                s = l > p ? l : p, c = h > d ? h : d, document.getElementById("papersvg").setAttribute("viewBox", "0 0 " + (parseInt(s) + 5) + " " + (parseInt(c) + 5)), o.attr("width", s), o.attr("height", c), r.attr("width", l), r.attr("height", h), a.attr("width", p), a.attr("height", d)
            }
        },
        mapDataCats = function(e) {
            var t = [],
                n = 0,
                i = e;
            for (var o in e) t.push({
                id: "",
                text: ""
            }), t.push({
                id: n,
                text: o
            }), n++;
            $(".js-compare-categories").length && ($(".js-compare-categories").select2({
                placeholder: "Select a category...",
                data: t,
                width: "100%",
                minimumResultsForSearch: -1
            }), $(".js-compare-categories").on("select2:select", function(e) {
                selectedCategoryPicker($(this), e.params.data.text, i)
            }), $(".js-compare-papers").on("select2:select", function(e) {
                var t = $(this);
                selectedPaperPicker(t, e.params.data.text, i), changeHistory(t, e.params.data.text)
            }))
        },
        pageLoadCompare = function(data) {
            var querys = getUrlVars(),
                jsonData = data;
            if (void 0 !== querys.c1) var cat1 = linkReplace(querys.c1);
            if (void 0 !== querys.c2) var cat2 = linkReplace(querys.c2);
            var paper1 = querys.p1,
                paper2 = querys.p2,
                catArray = [],
                catSelectValue = "",
                paperSelectValue = "",
                changeCategoryDropdown = function(e) {
                    var t = $(".picker-wrapper.picker-" + e);
                    $(".picker-wrapper.picker-" + e + " select.js-compare-categories option").filter(function() {
                        return linkReplace($(this).text()) == linkReplace(catSelectValue)
                    }).attr("selected", "selected"), $(".picker-wrapper.picker-" + e + " select.js-compare-categories").trigger("change"), $(".picker-wrapper.picker-" + e + " .picker-category .select2-container--default .select2-selection--single .select2-selection__rendered").text(catSelectValue), $(".select2").trigger("select"), selectedCategoryPicker(t, catSelectValue, jsonData)
                },
                changePaperDropdown = function(e) {
                    var t = $(".picker-wrapper.picker-" + e);
                    $(".picker-wrapper.picker-" + e + " select.js-compare-papers option").filter(function() {
                        return linkReplace($(this).text()) == paperSelectValue
                    }).attr("selected", "selected");
                    var n = $(".picker-wrapper.picker-" + e + " select.js-compare-papers option:selected").text();
                    $(".picker-wrapper.picker-" + e + " select.js-compare-papers").trigger("change"), $(".picker-wrapper.picker-" + e + " .picker-paper .select2-container--default .select2-selection--single .select2-selection__rendered").text(n), selectedPaperPicker(t, paperSelectValue, jsonData)
                },
                loopThroughCats = function(catName, catNo) {
                    for (var cat in jsonData) linkReplace(cat) === linkReplace(catName) && (catArray = jsonData[cat], catSelectValue = cat, changeCategoryDropdown(catNo, catSelectValue));
                    loopThroughPapers(eval("paper" + catNo), catArray, catNo)
                },
                loopThroughPapers = function(paperName, paperArray, paperNo) {
                    for (var paper in paperArray) linkReplace(paperArray[paper].paperName) === eval("paper" + paperNo) && (paperSelectValue = linkReplace(catArray[paper].paperName), changePaperDropdown(paperNo))
                };
            void 0 !== cat1 && loopThroughCats(cat1, 1), void 0 !== cat2 && loopThroughCats(cat2, 2)
        };
    $(".compare-paper-pickers").length && $.ajax({
        url: "/src/assets/data/en/paperpages.json",
        success: function(e) {
            mapDataCats(e), pageLoadCompare(e)
        },
        error: function(e) {
            console.log(e)
        }
    })
};
$(document).ready(function() {
    navbuttons(), compareSelects();
    var e = location.pathname.split("/")[2],
        t = $(".filter-container nav.filter ul li > a.link-" + e);
    t.parents(".more-list").length && $(".more-btn span").addClass("active"), t.addClass("active")
});
var screenResize = debounce(function() {
    navbuttons(), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (filterWidth(), paperContainerWidth())
}, 250);
window.addEventListener("resize", screenResize);