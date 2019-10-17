! function(e, t, n) {
    function i(t, n) {
        switch (this.$content = e(t), this.options = n, this.index = emoji_index, n.animation) {
            case "none":
                this.showFunc = "show", this.hideFunc = "hide", this.toggleFunc = "toggle";
                break;
            case "slide":
                this.showFunc = "slideDown", this.hideFunc = "slideUp", this.toggleFunc = "slideToggle";
                break;
            case "fade":
                this.showFunc = "fadeIn", this.hideFunc = "fadeOut", this.toggleFunc = "fadeToggle";
                break;
            default:
                this.showFunc = "fadeIn", this.hideFunc = "fadeOut", this.toggleFunc = "fadeToggle"
        }
        this._init()
    }

    function r(e) {
        if (e.focus(), void 0 !== t.getSelection && void 0 !== n.createRange) {
            var i = n.createRange();
            i.selectNodeContents(e), i.collapse(!1);
            var r = t.getSelection();
            r.removeAllRanges(), r.addRange(i)
        } else if (void 0 !== n.body.createTextRange) {
            var a = n.body.createTextRange();
            a.moveToElementText(e), a.collapse(!1), a.select()
        }
    }

    function a(t) {
        return emoji_index++, this.each(function() {
            var n = e(this),
                r = n.data("plugin_" + s + emoji_index),
                a = e.extend({}, c, n.data(), "object" == typeof t && t);
            r || n.data("plugin_" + s + emoji_index, r = new i(this, a)), "string" == typeof t && r[t]()
        })
    }
    var o = "0",
        s = "emoji",
        c = {
            showTab: !0,
            animation: "fade",
            icons: []
        };
    t.emoji_index = 0, i.prototype = {
        _init: function() {
            var t, i, r, a, s, c = this,
                l = this.options.button,
                u = c.index;
            l || (t = '<input type="image" class="emoji_btn" id="emoji_btn_' + u + '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZBAMAAAA2x5hQAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAkUExURUxpcfTGAPTGAPTGAPTGAPTGAPTGAPTGAPTGAPTGAPTGAPTGAOfx6yUAAAALdFJOUwAzbVQOoYrzwdwkAoU+0gAAAM1JREFUGNN9kK0PQWEUxl8fM24iCYopwi0muuVuzGyKwATFZpJIU01RUG/RBMnHxfz+Oef9uNM84d1+23nO+zxHKVG2WWupRJkdcAwtpCK0lpbqWE01pB0QayonREMoIp7AawQrWSgGGb4pn6dSeSh68FAVXqHqy3wKrkJiDGDTg3dnp//w+WnwlwIOJauF+C7sXRVfdha4O4oIJfTbtdSxs2uqhs585A0ko8iLTMEcDE1n65A+29pYAlr72nz9dKu7GuNTcsL2fDQzB/wCPVJ69nZGb3gAAAAASUVORK5CYII="/>', i = this.$content.offset().top + this.$content.outerHeight() + 10, r = this.$content.offset().left + 2, e(t).appendTo(e("body")), e("#emoji_btn_" + u).css({
                top: i + "px",
                left: r + "px"
            }), l = "#emoji_btn_" + u);
            var f = this.options.showTab,
                d = this.options.icons,
                p = d.length;
            if (0 === p) return alert("Missing icons config!"), !1;
            for (var h, v, g, m, y, b, w, C, T, k, D, M = '<div class="emoji_container" id="emoji_container_' + u + '">', x = '<div class="emoji_content">', S = '<div class="emoji_tab" style="' + (1 !== p || f ? "" : "display:none;") + '"><div class="emoji_tab_prev"></div><div class="emoji_tab_list"><ul>', E = 0; p > E; E++)
                if (v = d[E].name || "group" + (E + 1), g = d[E].path, m = d[E].maxNum, y = d[E].excludeNums, b = d[E].file || ".jpg", w = d[E].placeholder || "#em" + (E + 1) + "_{alias}#", C = d[E].alias, T = d[E].title, k = 0, g && m) {
                    h = '<div id="emoji' + E + '" class="emoji_icons" style="' + (0 === E ? "" : "display:none;") + '"><ul>';
                    for (var _ = 1; m >= _; _++)
                        if (!y || y.indexOf(_) < 0) {
                            if (C) {
                                if ("object" != typeof C) {
                                    alert("Error config about alias!");
                                    break
                                }
                                D = w.replace(RegExp("{alias}", "gi"), "" + C[_])
                            } else D = w.replace(RegExp("{alias}", "gi"), "" + _); //onclick="getEmojiimage(\'' + g + _ + b + '\')"
                            h += '<li><a data-emoji_code="' + D + '" data-index="' + k + '" title="' + (T && T[_] ? T[_] : "") + '"><img src="' + g + _ + b + '" /></a></li>', k++
                        }
                    h += "</ul></div>", x += h, S += '<li data-emoji_tab="emoji' + E + '" class="' + (0 === E ? "selected" : "") + '" title="' + v + '">' + v + "</li>"
                } else alert("The " + E + " index of icon groups has error config!");
            x += "</div>", S += '</ul></div><div class="emoji_tab_next"></div></div>';
            var j = '<div class="emoji_preview"><img/></div>';
            M += x, M += S, M += j, e(M).appendTo(e(".divformojisdemo")), a = e(l).offset().top + e(l).outerHeight() + 5, s = e(l).offset().left, e("#emoji_container_" + u + " .emoji_content").mCustomScrollbar({
                theme: "minimal-dark",
                scrollbarPosition: "inside"
            });
            var A = p % 8 === 0 ? parseInt(p / 8) : parseInt(p / 8) + 1,
                R = 1;
            e(n).on({
                click: function(t) {
                    if (e("#txtxdemochat").is(":focus")) e(".emoji_container").hide(), e(".divformojisdemo").hide(), e(".emoji_btn").hide(), o = "1";
                    else if (e("#txtupchat").is(":focus")) e(".emoji_container").hide(), e(".divformojisdemo").hide(), e(".emoji_btn").hide(), o = "1";
                    else {
                        var n = e(".emoji_container,#divforsmiley,#txtxdemochat,#divforsmileyup");
                        if (n.is(t.target) || 0 !== n.has(t.target).length) {
                            var i, r, a, s, f = t.target,
                                d = c.$content[0]; //This need to change for textarea
                            f === e(l)[0] ? e("#emoji_container_" + u)[c.toggleFunc]() : e(f).parents("#emoji_container_" + u).length > 0 ? (i = e(f).data("emoji_code") || e(f).parent().data("emoji_code"), r = e(f).data("emoji_tab"), i ? ("DIV" === d.nodeName ? (a = e("#emoji_container_" + u + ' a[data-emoji_code="' + i + '"] img').attr("src"), s='<img class="emoji_icon" src="' + a + '"/>', c._insertAtCursor(d, s, !1)) : c._insertAtCursor(d, i)) : r ? e(f).hasClass("selected") || (e("#emoji_container_" + u + " .emoji_icons").hide(), e("#emoji_container_" + u + " #" + r).show(), e(f).addClass("selected").siblings().removeClass("selected")) : e(f).hasClass("emoji_tab_prev") ? R > 1 && (e("#emoji_container_" + u + " .emoji_tab_list ul").css("margin-left", "-503" * (R - 2) + "px"), R--) : e(f).hasClass("emoji_tab_next") && A > R && (e("#emoji_container_" + u + " .emoji_tab_list ul").css("margin-left", "-503" * R + "px"), R++)) : e("#emoji_container_" + u + ":visible").length > 0 , e(".emoji_container").show(), e(".divformojisdemo").show(), e(".emoji_btn").hide()
                        } else e(".emoji_container").hide(), e(".divformojisdemo").hide(), e(".emoji_btn").hide(), o = "0"
                    }
                }
            })
			//e("#emoji_container_" + u + " .emoji_icons a").mouseenter(function() {
            //    var t = e(this).data("index");
            //    e("#emoji_container_" + u + " .emoji_preview").css(parseInt(t / 5) % 2 === 0 ? {
            //        left: "auto",
            //        right: 0
            //    } : {
            //        left: 0,
            //        right: "auto"
            //    });
            //    var n = e(this).find("img").attr("src");
            //    e("#emoji_container_" + u + " .emoji_preview img").attr("src", n).parent().show()
            //}), e("#emoji_container_" + u + " .emoji_icons a").mouseleave(function() {
            //    e("#emoji_container_" + u + " .emoji_preview img").removeAttr("src").parent().hide()
            //})
        },
        _insertAtCursor: function(e, i, a) {
            "0" == o && r(e);
            var s, c;
            if ("DIV" === e.nodeName) {
                if (e.focus(), t.getSelection) {
                    if (s = t.getSelection(), s.getRangeAt && s.rangeCount) {
                        c = s.getRangeAt(0), c.deleteContents();
                        var l = n.createElement("div");
                        l.innerHTML = i;
                        for (var u, f, d = n.createDocumentFragment(); u = l.firstChild;) f = d.appendChild(u);
                        var p = d.firstChild;
                        c.insertNode(d), f && (c = c.cloneRange(), c.setStartAfter(f), a ? c.setStartBefore(p) : c.collapse(!0), s.removeAllRanges(), s.addRange(c))
                    }
                } else if ((s = n.selection) && "Control" !== s.type) {
                    var h = s.createRange();
                    h.collapse(!0), s.createRange().pasteHTML(html), a && (c = s.createRange(), c.setEndPoint("StartToStart", h), c.select())
                }
            } else if (n.selection) e.focus(), s = n.selection.createRange(), s.text = i, s.select();
            else if (e.selectionStart || 0 === e.selectionStart) {
                var v = e.selectionStart,
                    g = e.selectionEnd,
                    m = e.scrollTop;
                e.value = e.value.substring(0, v) + i + e.value.substring(g, e.value.length), m > 0 && (e.scrollTop = m), e.focus(), e.selectionStart = v + i.length, e.selectionEnd = v + i.length
            } else e.value += i, e.focus()
        },
        show: function() {
            e("#emoji_container_" + this.index)[this.showFunc]()
        },
        //hide: function() {
        //    e("#emoji_container_" + this.index)[this.hideFunc]()
        //},
        toggle: function() {
            e("#emoji_container_" + this.index)[this.toggleFunc]()
        }
    }, e.fn[s] = a, e.fn[s].Constructor = i
}(jQuery, window, document),
function(e) {
    function t(t, n) {
        this.$content = e(t), this.options = n, this._init()
    }

    function n(n) {
        //return this.each(function() {
        //    var a = e(this),
        //        o = a.data("plugin_" + i),
        //        s = e.extend({}, r, a.data(), "object" == typeof n && n);
        //    o || a.data("plugin_" + i, o = new t(this, s)), "string" == typeof n && o[n]()
        //})
    }
    var i = "emojiParse",
        r = {
            icons: []
        };
    t.prototype = {
        _init: function() {
            var e, t, n, i, r, a, o = this,
                s = this.options.icons,
                c = s.length,
                l = {};
            if (c > 0)
                for (var u = 0; c > u; u++)
                    if (e = s[u].path, t = s[u].file || ".jpg", n = s[u].placeholder, i = s[u].alias, e)
                        if (i) {
                            for (var f in i) i.hasOwnProperty(f) && (l[i[f]] = f);
                            r = n.replace(RegExp("{alias}", "gi"), "([\\s\\S]+?)"), a = RegExp(r, "gm"), o.$content.val(o.$content.val().replace(a, function(n, i) {
                                var r = l[i];
                               // return r ? '<img class="emoji_icon" src="' + e + r + t + '"/>' : n
                            }))
                        } //else r = n.replace(RegExp("{alias}", "gi"), "(\\d+?)"), o.$content.val(o.$content.val().replace(RegExp(r, "gm"), '<img class="emoji_icon" src="' + e + "$1" + t + '"/>'));
            else alert("Path not config!")
        }
    }, e.fn[i] = n, e.fn[i].Constructor = t
}(jQuery, window, document)
