/*!Name: stock.js
 * Date: 2023-10-17 14:22:9 */
define("MOD_ROOT/address/stock", function(require, exports, module) {
    var e = require("PUBLIC_ROOT/conf")
      , t = require("MOD_ROOT/common/core")
      , o = require("MOD_ROOT/common/tools/tools")
      , i = require("MOD_ROOT/common/tools/abtest")
      , n = require("MOD_ROOT/common/tools/event").Event
      , s = require("MOD_ROOT/buybtn/buybtn").addToCartBtn;
    function a(e, i, n, s) {
        var a = this.cfg = window && window.pageConfig && window.pageConfig.product || {};
        this.params = {},
        this.onSuccess = "function" == typeof i ? i : function() {}
        ,
        this.onError = "function" == typeof n ? n : function() {}
        ,
        this.onlyData = s || !1;
        var r = this.areas = o.getAreaId().areaIds
          , c = {
            skuId: a.skuid || "",
            area: r.join("_"),
            venderId: a.venderId || 0,
            buyNum: $("#buy-num").val() || 1,
            choseSuitSkuIds: a.suitSkuids || "",
            cat: a.cat instanceof Array ? a.cat.join(",") : "",
            extraParam: a.isHeYue ? '{"originid":"1","heYueJi":"1"}' : '{"originid":"1"}',
            fqsp: t.onAttr("fqsp-1") && 1 || t.onAttr("fqsp-2") && 2 || t.onAttr("fqsp-3") && 3 || 0,
            pdpin: readCookie("pin") || "",
            pduid: o.getUUID(),
            ch: 1
        };
        a.locStoreId && (c.storeId = a.locStoreId);
        var d = readCookie("detailedAdd_coord");
        d && (c.coord = d);
        var p = readCookie("detailedAdd");
        p && (c.detailedAdd = p);
        var l = readCookie("detailedAdd_areaid");
        l && p && (c.area = l.split("-").join("_")),
        this.params = $.extend(c, e),
        this.init()
    }
    a.prototype = {
        constructor: a,
        init: function() {
            this.bindEvent();
            var e = t.serializeUrl(location.href).param.bbtf
              , i = "";
            pageConfig.product.bybtShieldSwitch && e && e.length > 0 && (i = "1");
            var n = {
                skuId: pageConfig.product.skuid,
                cat: pageConfig.product.cat.join(","),
                area: o.getAreaId().areaIds.join("_"),
                shopId: pageConfig.product.shopId,
                venderId: pageConfig.product.venderId,
                paramJson: pageConfig.product.paramJson,
                num: pageConfig.product.countNum || "1",
                bbTraffic: i
            }
              , s = JSON.stringify(n)
              , a = (new Date).getTime()
              , r = {
                appid: "pc-item-soa",
                functionId: "pc_detailpage_wareBusiness",
                client: "pc",
                clientVersion: "1.0.0",
                t: a,
                body: s
            }
              , c = this;
            try {
                var d = JSON.parse(JSON.stringify(r));
                d.body = SHA256(s).toString(),
                window.PSign.sign(d).then(function(e) {
                    r.h5st = encodeURI(e.h5st);
                    try {
                        getJsToken(function(e) {
                            e && e.jsToken && (r["x-api-eid-token"] = e.jsToken),
                            r.loginType = "3",
                            r.uuid = getCookie("__jda") || "",
                            c.getDataColor(r)
                        }, 600)
                    } catch (e) {
                        r.loginType = "3",
                        r.uuid = getCookie("__jda") || "",
                        c.getDataColor(r);
                        try {
                            jmfe.jsagentReport(jmfe.JSAGENT_EXCEPTION_TYPE.net, 200, "\u878d\u5408\u8bbe\u5907\u6307\u7eb9\u8c03\u7528\u5f02\u5e38" + r.functionId, {
                                fid: r.functionId,
                                resp: e,
                                body: r.body
                            })
                        } catch (e) {
                            console.log("\u4e0a\u62a5\u8bbe\u5907\u6307\u7eb9\u9519\u8bef", e)
                        }
                    }
                })
            } catch (e) {
                r.loginType = "3",
                r.uuid = getCookie("__jda") || "",
                c.getDataColor(r);
                try {
                    jmfe.jsagentReport(jmfe.JSAGENT_EXCEPTION_TYPE.net, 200, "\u878d\u5408\u52a0\u56fa\u8c03\u7528\u5f02\u5e38" + r.functionId, {
                        fid: r.functionId,
                        resp: e,
                        body: r.body
                    })
                } catch (e) {
                    console.log("\u4e0a\u62a5\u52a0\u56fa\u9519\u8bef", e)
                }
            }
        },
        getDataColor: function(t) {
            var i = this;
            if (e.get("GLOBAL.isStockV2"))
                return o.getStockV2().done(function(e) {
                    e = e || {},
                    i.handleData(e.stock)
                }).fail(function(e) {
                    i.error(),
                    i.onError.call(i, e)
                });
            var n = "//api.m.jd.com";
            return pageConfig.product && pageConfig.product.colorApiDomain && (n = pageConfig.product && pageConfig.product.colorApiDomain),
            $.ajax({
                url: n,
                data: t,
                dataType: "json",
                xhrFields: {
                    withCredentials: !0
                },
                success: function(e) {
                    if (e)
                        if (e.code && parseInt(e.code) < 10 && e.echo)
                            try {
                                var o = e.echo.length > 1e3 ? e.echo.substring(0, 999) : e.echo;
                                jmfe.jsagentReport(jmfe.JSAGENT_EXCEPTION_TYPE.business, 200, "\u878d\u5408\u63a5\u53e3\u8c03\u7528\u5f02\u5e38" + t.functionId, {
                                    fid: t.functionId,
                                    resp: o,
                                    body: t.bodyData
                                })
                            } catch (e) {
                                console.log("\u4e0a\u62a5pc_detailpage_wareBusiness\u9519\u8bef", e)
                            }
                        else
                            try {
                                var n = e && e.promotion && e.promotion.limitBuyInfo && e.promotion.limitBuyInfo.resultExt && e.promotion.limitBuyInfo.resultExt.noSaleReason
                                  , s = e && e.wareInfo && e.wareInfo.extend && e.wareInfo.extend.qtpbsp;
                                "9" == n && pageConfig.product && pageConfig.product.noSaleReasonSwitch ? window.location.href = "//www.jd.com?from=pc_item&reason=9" : "1" == s ? window.location.href = "//www.jd.com?from=pc_item&qtpbsp=1" : i.handleData({
                                    type: "onWareBusinessReady",
                                    data: e
                                })
                            } catch (t) {
                                i.handleData({
                                    type: "onWareBusinessReady",
                                    data: e
                                })
                            }
                },
                error: function(e) {
                    try {
                        jmfe.jsagentReport(jmfe.JSAGENT_EXCEPTION_TYPE.net, 200, "\u878d\u5408\u63a5\u53e3\u8c03\u7528\u9519\u8bef" + t.functionId, {
                            fid: t.functionId,
                            resp: e,
                            body: t.bodyData
                        })
                    } catch (e) {
                        console.log("\u4e0a\u62a5pc_detailpage_wareBusiness\u9519\u8bef", e)
                    }
                }
            })
        },
        bindEvent: function() {
            var e = this.cfg
              , t = "//api.m.jd.com";
            pageConfig.product && pageConfig.product.colorApiDomain && (t = pageConfig.product && pageConfig.product.colorApiDomain),
            $.ajax({
                url: t + "/new/cdpPromotionQuery?skuId=" + e.skuid + "&venderId=" + (e.venderId ? e.venderId : "") + "&source=PC&jdPin=",
                dataType: "jsonp",
                data: {
                    appid: "item-v3",
                    functionId: "pc_new_cdpPromotionQuery"
                },
                success: function(e) {
                    if (e && e.couponDesc && e.jumpUrl) {
                        var t = [];
                        t.push('<div id="summary-presale-wellfare" class="li" clstag="shangpin|keycount|product|jinrongquan_ys">'),
                        t.push('<div class="dt">\u9884\u552e\u798f\u5229</div>'),
                        t.push('<div class="dd"><a class="J-open-tb" href="' + e.jumpUrl + '" target="_blank"><span class="quan-item" title="' + e.couponDesc + '"><s></s><b></b><span class="text">' + e.couponDesc + '</span></span><span class="more-btn">\u66f4\u591a&gt;&gt;</span></a></div>'),
                        t.push("</div>"),
                        t = t.join(""),
                        setTimeout(function() {
                            $("#summary-presale-wellfare").length > 0 && $("#summary-presale-wellfare").remove(),
                            $(".summary.p-choose-wrap").prepend(t)
                        }, 200)
                    }
                }
            })
        },
        handleData: function(e) {
            var t = e && e.data;
            if (!t.stockInfo)
                return this.error(),
                this.onError.call(this),
                !1;
            var o = pageConfig.product
              , i = t.stockInfo.stockState;
            o._area = t.stockInfo.area ? t.stockInfo.area : 0,
            o.unSupportedArea = 2 === t.stockInfo.code,
            o.havestock = t.stockInfo.isStock,
            !1 === t.stockInfo.supportHKMOShip && (o.havestock = !1);
            34 == i || 2 == t.stockInfo.code || function() {
                return !!o.koEndOffset || (!!(o.specialAttrs && o.specialAttrs instanceof Array && -1 != o.specialAttrs.join(",").indexOf("isKO")) || !!o.fsEndOffset)
            }() ? $("#choose-period-buy").hide() : window.PeriodicalBuy && window.PeriodicalBuy.init(o),
            this.onlyData || this.set(t),
            this.onSuccess.call(this, e)
        },
        set: function(t) {
            this.setStockInfo(t),
            this.setSupportedServices(t),
            this.setSupportIcons(t),
            this.setDJDAreaSku(t),
            this.setLDP(t.stockInfo),
            e.get("GLOBAL.PLUS.giftPackageSignal") && this.setOpenPlusGift(t)
        },
        error: function() {
            "undefined" != typeof console && console.error("Stock service maybe error or timeout.")
        },
        setStockInfo: function(e) {
            var t = $("#store-prompt")
              , o = $("#summary-service")
              , i = $("#summary-supply")
              , n = $(".J-dcashDesc")
              , s = ""
              , a = ""
              , r = $("#summary-weight");
            if (!e)
                return !1;
            e && e.weightInfo && e.weightInfo.content ? r.show().find(".dd").text(e.weightInfo.content) : r.hide().find(".dd").text(""),
            e.stockInfo && e.stockInfo.serviceInfo && (a += e.stockInfo.serviceInfo),
            e.stockInfo && e.stockInfo.promiseResult && (a += e.stockInfo.promiseResult),
            o.html(a),
            a ? i.show() : i.hide();
            var c = $("#summary-stock");
            a && c.length ? c.show() : c.hide(),
            e.stockInfo && e.stockInfo.stockDesc && (s += e.stockInfo.stockDesc),
            t.html(s),
            e.stockInfo && e.stockInfo.dcashDesc && n.html(e.stockInfo.dcashDesc)
        },
        setSupportIcons: function(e) {
            var t = $("#summary-support");
            if (!e.stockInfo || !e.stockInfo.support || !e.stockInfo.support.length)
                return t.hide(),
                !1;
            pageConfig.__supportABTest = new i(o.getUUID(),.5);
            for (var n = "A" === pageConfig.__supportABTest.isHitVersion(), s = 0; s < e.stockInfo.support.length; s++) {
                if ("baina" === e.stockInfo.support[s].id && !n) {
                    e.stockInfo.support.splice(s, 1);
                    break
                }
            }
            /debug=zz/.test(location.href) && e.stockInfo.support.push({
                id: "zengzhi",
                showName: "\u589e\u503c\u670d\u52a1"
            }),
            e.stockInfo.support.length ? t.show() : t.hide(),
            t.find(".choose-support").html('            {for item in support}            <li id="support-${item.id}" clstag="shangpin|keycount|product|zhichi_${item.id}_${cat2}">                <a {if item.helpLink} target="_blank" href="${item.helpLink}" {else} href="#none" {/if}                     data-title="${item.iconTip}">                <i class="sprite-${item.id}"></i>                <span>${item.showName}</span>                </a>            </li>            {/for}'.process({
                support: e.stockInfo.support,
                cat2: pageConfig.product.cat[2]
            })),
            this.showTip(t),
            this.bindDialog()
        },
        showTip: function(e) {
            e.find("[data-title]").each(function() {
                $(this).data("title") && $(this).ETooltips({
                    pos: "bottom",
                    zIndex: 10,
                    width: 200,
                    defaultTitleAttr: "data-title"
                })
            })
        },
        setDJDAreaSku: function(e) {
            if (!e.stockInfo || !e.stockInfo.realSkuId)
                return !1;
            var o = e.stockInfo.realSkuId;
            if (o != pageConfig.product.skuid) {
                var i = [t.isPop ? "0" : "1", t.isPOPSku(o) ? "0" : "1"].join("")
                  , n = "?jt=" + i;
                if (location.search && (n = /jt=\d+/.test(location.search) ? location.search.replace(/jt=\d+/, "jt=" + i) : location.search + "&jt=" + i),
                /debug=disableJump/.test(location.href))
                    return !1;
                var s = '                <p style="padding: 40px 30px;font-size: 14px;font-weight: 600;color: #999;">\u8be5\u5546\u54c1\u5728\u5f53\u524d\u533a\u57df\u6682\u4e0d\u652f\u6301\u914d\u9001\u6216\u65e0\u8d27\uff0c\u662f\u5426\u5207\u6362\u5230\u76f8\u4f3c\u5546\u54c1\u3002</p>                <div class="btn" style="text-align: center;">                    <a href="#none" onclick="$.closeDialog()" style="height: 46px;line-height: 46px;font-weight: 700;padding: 0 26px;font-size: 18px;background-color: #df3033;color: #fff;display: inline-block;">\u53d6\u6d88</a>                    <a href=//item.jd.com/' + o + ".html" + n + ' style="height: 46px;font-weight: 700;line-height: 46px;padding: 0 26px;font-size: 18px;background-color: #85C363;color: #fff;display: inline-block;">\u5207\u6362\u76f8\u4f3c\u5546\u54c1</a>                </div>';
                $("body").dialog({
                    width: 392,
                    title: "",
                    height: 200,
                    type: "text",
                    maskClose: !0,
                    source: s,
                    onReady: function() {}
                })
            }
        },
        setLDP: function(e) {
            var t = $("#choose-luodipei");
            if (/debug=ldp/.test(location.href) && (e.luodipei = [{
                desc: "\u9001\u8d27\u670d\u52a1\uff1a\u7535\u68af\u4f4f\u6237\u62167\u5c42\u4ee5\u4e0b\u6b65\u68af\u4f4f\u6237\u53ef\u4eab\u53d7\u6b64\u670d\u52a1\uff0c7\u5c42\u4ee5\u4e0a\u6b65\u68af\u4f4f\u6237\u5219\u9700\u6309\u914d\u9001\u516c\u53f8\u89c4\u5b9a\u52a0\u6536\u8d39\u7528\u3002\uff08\u74f7\u7816\u5730\u677f\u7c7b\uff0c\u4ec5\u7535\u68af\u4f4f\u6237\u62161\u5c42\u6b65\u68af\u4f4f\u6237\u53ef\u4eab\uff09\u3002\n\u5b89\u88c5\u670d\u52a1\uff1a\u6b64\u7c7b\u5546\u54c1\u9700\u4e13\u4eba\u5b89\u88c5\uff0c\u7b7e\u6536\u540e\u8bf7\u8054\u7cfb\u5546\u5bb6\u786e\u8ba4\u4e0a\u95e8\u5b89\u88c5\u65f6\u95f4\u3002\n\u5982\u5546\u5bb6\u672a\u5c65\u884c\u670d\u52a1\uff0c\u6d88\u8d39\u8005\u53ef\u83b7200\u5143/\u5355\u7684\u8d54\u4ed8\u3002",
                id: 1103,
                url: "//help.jd.com/Vender/question-1043.html",
                seq: 1,
                name: "\u9001\u8d27\u4e0a\u95e8\u5b89\u88c5",
                charge: 2
            }, {
                desc: "\u9001\u8d27\u670d\u52a1\uff1a\u7535\u68af\u4f4f\u6237\u62167\u5c42\u4ee5\u4e0b\u6b65\u68af\u4f4f\u6237\u53ef\u4eab\u53d7\u6b64\u670d\u52a1\uff0c7\u5c42\u4ee5\u4e0a\u6b65\u68af\u4f4f\u6237\u5219\u9700\u6309\u914d\u9001\u516c\u53f8\u89c4\u5b9a\u52a0\u6536\u8d39\u7528\u3002\uff08\u74f7\u7816\u5730\u677f\u7c7b\uff0c\u4ec5\u7535\u68af\u4f4f\u6237\u62161\u5c42\u6b65\u68af\u4f4f\u6237\u53ef\u4eab\uff09\u3002\n\u5982\u5546\u5bb6\u672a\u5c65\u884c\u670d\u52a1\uff0c\u6d88\u8d39\u8005\u53ef\u83b7200\u5143/\u5355\u7684\u8d54\u4ed8\u3002",
                id: 1102,
                url: "//help.jd.com/Vender/question-1043.html",
                seq: 2,
                name: "\u9001\u8d27\u4e0a\u95e8",
                charge: 1
            }, {
                desc: "\u5546\u54c1\u9001\u81f3\u60a8\u4e0b\u5355\u5730\u5740\u6240\u5728\u5730\u7ea7\u5e02\u540e\uff0c\u914d\u9001\u516c\u53f8\u4f1a\u901a\u77e5\u60a8\u7269\u6d41\u70b9\u5730\u5740\uff0c\u60a8\u9700\u81ea\u884c\u524d\u5f80\u7269\u6d41\u70b9\u63d0\u8d27\uff0c\u81ea\u884c\u642c\u8fd0\u8d27\u7269\u5e76\u5b89\u88c5\u3002\n\u5982\u5546\u5bb6\u672a\u5c65\u884c\u670d\u52a1\uff0c\u6d88\u8d39\u8005\u53ef\u83b7200\u5143/\u5355\u7684\u8d54\u4ed8\u3002",
                id: 1101,
                url: "//help.jd.com/Vender/question-1043.html",
                seq: 3,
                name: "\u5e02\u533a\u7ad9\u70b9\u81ea\u63d0",
                charge: 0
            }]),
            !(t.length && e && e.luodipei && e.luodipei.length))
                return t.hide(),
                !1;
            t.show(),
            t.find(".dd").html('            {for item in luodipei}            <div class="item {if Number(item_index)==0} selected{/if}">                <b></b>                <a href="#none" data-id="${item.platformPid}">${item.sortName} \uffe5${item.price}</a>                <script type="text/html">${item.desc} {if item.url }<a class="hl_blue" href="${item.url}" target="_blank">\u8be6\u60c5 &raquo;</a>{/if}<\/script>            </div>            {/for}'.process(e)),
            t.find(".item").each(function() {
                var e = $(this)
                  , t = e.find("script").html();
                e.ETooltips({
                    autoHide: !0,
                    close: !1,
                    content: t,
                    width: 300,
                    pos: "bottom",
                    zIndex: 10
                })
            });
            function o(e) {
                e = e || t.find(".selected a").attr("data-id");
                var o = s.$el.attr("href")
                  , i = "";
                o && "#none" != o && (i = /did=/.test(o) ? o.replace(/did=\d+/, "did=" + e) : o + "&did=" + e,
                s.enabled(i)),
                n.fire({
                    type: "onLDPSelected",
                    did: e
                })
            }
            function i(e) {
                t.find(".item").removeClass("selected"),
                e.parent().addClass("selected")
            }
            function a(e) {
                var t = $(e.target)
                  , n = t.data("id");
                i(t),
                o(n)
            }
            t.delegate(".item a", "click", a),
            o(t.find(".selected a").attr("data-id")),
            n.fire({
                type: "onLDPSelected",
                did: e.luodipei[0].platformPid
            })
        },
        bindDialog: function() {
            this.suitDialog(),
            this.zzDialog()
        },
        suitDialog: function() {
            var e = $("#support-tcbg")
              , t = this.areas;
            e.bind("click", function() {
                var e = "//ctc.jd.com/popupDialog.action?showSp=1|2&" + $.param({
                    skuId: pageConfig.product.skuid,
                    provinceId: t[0],
                    cityId: t[1],
                    popId: pageConfig.product.venderId,
                    r: Math.random()
                });
                pageConfig.bTypeIframe = $("body").dialog({
                    type: "iframe",
                    width: 710,
                    height: 610,
                    title: "\u5957\u9910\u53d8\u66f4",
                    autoIframe: !1,
                    iframeTimestamp: !1,
                    source: e,
                    onReady: function() {
                        var e = $(this.el).width();
                        $(this.el).addClass("popup-phone-service"),
                        $(this.content).width(e)
                    }
                })
            })
        },
        zzDialog: function() {
            $("#support-zengzhi").bind("click", function() {
                var e = "//scp.jd.com/settlement.action?" + $.param({
                    skuId: pageConfig.product.skuid,
                    pcount: $("#buy-num").val(),
                    venderId: pageConfig.product.venderId,
                    r: Math.random()
                })
                  , t = '<div class="zengzhi-layer" style="width:630px;">                    <h3><i class="icon-zengzhi"></i>\u963f\u51e1\u63d0\u4e3b\u9898\u9986\u201c\u589e\u503c\u4ea4\u6613\u201d\u6a21\u5f0f\u8bf4\u660e</h3>                    <p class="zengzhi-intr">\u9009\u62e9\u201c\u589e\u503c\u4ea4\u6613\u201d\u6a21\u5f0f\u7684\u5ba2\u6237\uff0c\u53ef\u4ee5\u53c2\u4e0e\u5546\u5bb6\u6307\u5b9a\u7684\u76f8\u5173\u4ea4\u6613\u670d\u52a1\u3002\u8d2d\u4e70\u540e\u8bf7\u5728\u4e2a\u4eba\u4e2d\u5fc3\u5de6\u4fa7\u201c\u7279\u8272\u670d\u52a1\u201d\u7684\u201c\u9ec4\u91d1|\u6536\u85cf\u670d\u52a1\u201d\u4e2d\u67e5\u770b\u4ea4\u6613\u51ed\u8bc1\uff0c\u51ed\u4ea4\u6613\u51ed\u8bc1\u8054\u7cfb\u5546\u5bb6\u5b8c\u6210\u540e\u7eed\u670d\u52a1\u3002</p>                    <div class="zengzhi-info">                        \u8bf7\u6ce8\u610f\uff1a                        <ol>                            <li>1. \u9009\u62e9\u201c\u589e\u503c\u4ea4\u6613\u201d\u6a21\u5f0f\u7684\u5ba2\u6237\uff0c\u7cfb\u7edf\u9ed8\u8ba4\u4e3a\u4e0d\u53d1\u8d27\uff0c\u5982\u60a8\u5e0c\u671b\u63d0\u53d6\u8d27\u7269\uff0c\u8bf7\u60a8\u8054\u7cfb\u5546\u5bb6\uff0c\u51ed\u4ea4\u6613\u51ed\u8bc1\u529e\u7406\u3002</li>                            <li>2. \u9009\u62e9\u201c\u589e\u503c\u4ea4\u6613\u201d\u6a21\u5f0f\u7684\u5ba2\u6237\uff0c\u987b\u4e3a\u4e2d\u534e\u4eba\u6c11\u5171\u548c\u56fd\u516c\u6c11\uff0c\u6301\u6709\u8eab\u4efd\u8bc1\u3001\u62a4\u7167\u7b49\u6709\u6548\u8eab\u4efd\u8bc1\u4ef6\u3002\u987b\u5e74\u6ee118\u5c81\uff0c\u4e3a\u5b8c\u5168\u6c11\u4e8b\u884c\u4e3a\u80fd\u529b\u4eba\u3002</li>                            <li>3. \u201c\u589e\u503c\u4ea4\u6613\u201d\u6a21\u5f0f\u4e2d\u6240\u542b\u670d\u52a1\u5305\u62ec\u4f46\u4e0d\u9650\u4e8e\uff1a\u6307\u5b9a\u673a\u6784\u4ee3\u7406\u529e\u7406\u4ea7\u54c1\u5c01\u88c5\u3001\u4ea4\u6613\u6258\u7ba1\u3001\u4ea4\u6613\u5165\u5e93\u3001\u4ea4\u6613\u63d0\u8d27\u3001\u4ea4\u6613\u7ed3\u7b97\u3001\u4e8c\u624b\u8f6c\u8ba9\u7b49\u670d\u52a1\u5f62\u5f0f\u3002\u8be5\u670d\u52a1\u6700\u7ec8\u89e3\u91ca\u6743\u5f52\u963f\u51e1\u63d0\u4e3b\u9898\u9986\u6240\u6709\u3002</li>                            <li>4. \u201c\u589e\u503c\u4ea4\u6613\u201d\u6a21\u5f0f\u4e2d\u6240\u542b\u670d\u52a1\u5bf9\u5e94\u7684\u54c1\u79cd\u8bbe\u7acb\u3001\u4ea4\u6613\u6258\u7ba1\u3001\u4ea4\u6613\u7533\u8d2d\u3001\u4ea4\u6613\u6d41\u901a\u7b49\u4fe1\u606f\uff0c\u5747\u4ee5\u56fd\u9645\u7248\u963f\u51e1\u63d0\u4e3b\u4f53\u6587\u5316\u4ea4\u6613\u5e73\u53f0\u5bf9\u5916\u516c\u544a\u4e3a\u51c6\u3002</li>                            <li>                                5. \u201c\u589e\u503c\u4ea4\u6613\u201d\u6a21\u5f0f\u540e\u7eed\u670d\u52a1\u64cd\u4f5c\u6d41\u7a0b\u793a\u610f\u5982\u4e0b\uff1a                                <div class="process">                                    <div class="process-item">                                        \u5ba2\u6237\u5728\u4eac\u4e1c\u4e2a\u4eba\u4e2d\u5fc3<span>\u3010\u9ec4\u91d1|\u6536\u85cf\u670d\u52a1\u3011</span>\u5f20\u83b7\u53d6\u4ea4\u6613\u51ed\u8bc1                                    </div>                                    <i class="arrow"></i>                                    <div class="process-item">                                        \u5ba2\u6237\u901a\u8fc7\u5fae\u4fe1\u5173\u6ce8<span>\u3010\u56fd\u9645\u7248\u963f\u51e1\u63d0\u4e3b\u4f53\u6587\u5316\u4ea4\u6613\u5e73\u53f0\u3011</span>                                    </div>                                    <i class="arrow"></i>                                    <div class="process-item">                                        \u5728<span>\u3010\u56fd\u9645\u7248\u963f\u51e1\u63d0\u4e3b\u4f53\u6587\u5316\u4ea4\u6613\u5e73\u53f0\u3011</span>\u7684<span>\u3010\u5ba2\u6237\u670d\u52a1\u3011</span>\u4e2d<span>\u3010\u4eac\u4e1c\u5ba2\u6237\u767b\u8bb0\u3011</span>\u6309\u7cfb\u7edf\u6307\u5f15\u5b8c\u6210\u540e\u7eed\u64cd\u4f5c                                    </div>                                </div>                            </li>                        </ol>                        <a clstag="shangpin|keycount|product|button_ZengZhiJiaoYi" target="_blank" href="' + e + '" class="btn-confirm">\u589e\u503c\u4ea4\u6613</a>                    </div>                </div>';
                $("body").dialog({
                    type: "html",
                    width: 690,
                    height: 600,
                    title: "\u589e\u503c\u4ea4\u6613",
                    autoIframe: !1,
                    iframeTimestamp: !1,
                    source: t,
                    onReady: function() {}
                })
            })
        },
        setSupportedServices: function(e) {
            void 0 == e.stockInfo && (e = {});
            var t = e.isJdkd
              , o = e.isJdwl
              , i = e.price && e.price.p
              , n = $.isArray(e.stockInfo.serverIcon && e.stockInfo.serverIcon.basicIcons) ? e.stockInfo.serverIcon.basicIcons : []
              , s = $.isArray(e.stockInfo.serverIcon && e.stockInfo.serverIcon.trustworthyIcon) ? e.stockInfo.serverIcon.trustworthyIcon : []
              , a = $.isArray(e.stockInfo.serverIcon && e.stockInfo.serverIcon.wlfwIcons) ? e.stockInfo.serverIcon.wlfwIcons : []
              , r = "";
            e.stockInfo.serverIcon && 3 == e.stockInfo.serverIcon.relaxType && (r = "extra3");
            function c(e, t) {
                if (!(e instanceof Array))
                    return [];
                t = "number" == typeof t && t >= 1 ? t : 3;
                var o = e.length;
                if (o <= t)
                    return [e];
                for (var i = [], n = 0; n < o; n += t)
                    i.push(e.slice(n, n + t));
                return i
            }
            function d(e, t, o, n) {
                if (!(e instanceof Array) || 0 === e.length)
                    return "";
                t = "string" == typeof t ? t : "";
                for (var s = "string" == typeof o && "string" == typeof n && o.length > 0 && n.length > 0, a = [], r = ["clstag='shangpin|keycount|product|promisefw_" + pageConfig.product.pType + "'", "onclick=\"log('PC_shangxiang', 'zyfxg_shangxiang', '', '', 'zyfxg_fuwu2', '" + pageConfig.product.skuid + "', '" + i + "')\""], c = 0; c < e.length; c++) {
                    var d = e[c];
                    if (void 0 != d && d.tip && d.text) {
                        var p = r[d.__MARK__];
                        p = p || "",
                        "string" == typeof d.helpLink && d.helpLink.length > 0 ? a.push("<a target='_blank' title='" + d.tip + "' href='" + d.helpLink + "'" + p + ">" + d.text + "</a>") : a.push("<span title='" + d.tip + "'" + p + ">" + d.text + "</span>")
                    }
                }
                var l = "";
                return a.length && (l = a.join(t),
                s && (l = o + l + n)),
                l
            }
            function p(e) {
                if (!(e instanceof Array) || 0 === e.length)
                    return "";
                for (var t = "", o = 0; o < e.length; o++)
                    t += d(e[o], "<i>|</i>", "<div>", "</div>");
                return t && (t = e.length > 1 ? "<div class='services services--more' id='ns_services'>" + t + "<span class='arrow'></span></div>" : "<div class='services' id='ns_services'>" + t + "</div>"),
                t
            }
            var l = $(".J-promise-icon.promise-icon")
              , f = $("#J_SelfAssuredPurchase")
              , u = $("#J_LogisticsService");
            if (l.hide().html(""),
            f.hide().html(""),
            u.hide().html(""),
            !pageConfig.product.isHeYue) {
                if (o || t) {
                    var h = "";
                    o && (h = "<div class='icon-wl" + r + "'></div>"),
                    t && (h = "<div class='icon-kd" + r + "'></div>"),
                    a.length > 0 ? (h += p(c(a)),
                    h = "<div class='dd'>" + h + "</div>",
                    u.html(h),
                    u.show()) : $("#summary-service").prepend(h)
                }
                if (s.length > 0) {
                    var h = "";
                    1 == e.stockInfo.fxgCode ? h = "<div class='icon-SelfAssuredPurchase" + r + "' title='\u65e0\u5fe7\u552e\u540e\uff0c\u653e\u5fc3\u9009\u8d2d\uff08\u5177\u4f53\u53ef\u4eab\u53d7\u670d\u52a1\u4ee5\u552e\u540e\u7533\u8bf7\u9875\u4e3a\u51c6\uff09'></div>" : 2 == e.stockInfo.fxgCode ? h = "<div class='icon-qyService" + r + "' title='\u8ba9\u670d\u52a1\u53d8\u5f97\u66f4\u7b80\u5355'></div>" : 3 == e.stockInfo.fxgCode && (h = "<div class='icon-freeBuy" + r + "' title='\u65e0\u5fe7\u552e\u540e\uff0c\u653e\u5fc3\u9009\u8d2d\uff08\u5177\u4f53\u53ef\u4eab\u53d7\u670d\u52a1\u4ee5\u552e\u540e\u7533\u8bf7\u9875\u4e3a\u51c6\uff09'></div>"),
                    h += p(c(s)),
                    h += n.length > 0 ? d(n, "", "<div class='promises'>", "</div>") : "",
                    h = "<div class='dt'>\u670d\u52a1\u652f\u6301</div><div class='dd'>" + h + "</div>",
                    f.html(h),
                    f.show()
                } else if (n.length > 0) {
                    var h = "<div class='fl'>\u652f\u6301</div>";
                    h += p(c(n, 4)),
                    l.html(h),
                    l.show()
                }
            }
        },
        setQualityGuaranteePeriod: function(e) {
            var o = window.pageConfig.product
              , i = "1534" == o.cat[2]
              , n = t.onAttr("zsscrq")
              , s = e.expiration
              , a = $("#summary-weight")
              , r = $("#J_QualityGuaranteePeriod");
            if (i && n && s) {
                var c = s.split("#")
                  , d = c[0]
                  , p = c[1];
                if (d && p)
                    var l = "\u751f\u4ea7\u65e5\u671f\u5728" + "".format.apply("{0}\u5e74{1}\u6708{2}\u65e5", $.map(d.split("-"), function(e) {
                        return isNaN(+e) ? e : +e
                    })) + "\u4e4b\u540e\uff0c\u4fdd\u8d28\u671f" + p + "\u5929";
                else
                    var l = "";
                l ? r.length ? $(".dd", r).html(l) : a.length && a.after('<div id="J_QualityGuaranteePeriod" class="li"><div class="dt">\u65e5&#x3000;&#x3000;\u671f</div><div class="dd">' + l + "</div></div>") : r.remove()
            } else
                r.remove()
        },
        setOpenPlusGift: function(e) {
            var t = {
                isWithinDate: function(e, t) {
                    var o = /(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/
                      , i = function(e, t, o, i, n, s) {
                        return +new Date(e,t - 1,o,i,n,s)
                    };
                    if (o.test(e) && o.test(t)) {
                        e = i.apply(null, o.exec(e).slice(1, 7)),
                        t = i.apply(null, o.exec(t).slice(1, 7));
                        var n = +new Date;
                        return !(n < e || n > t)
                    }
                    return !1
                }
            }
              , o = t.isWithinDate("2019-01-08 00:00:01", "2019-02-08 23:59:59") ? "\u5f00\u901a\u4f1a\u5458\uff0c\u4eab140\u5143\u5168\u54c1\u7c7b\u5238\u793c\u5305+30\u5143\u65e0\u95e8\u69db\u5238" : "\u5f00\u901aPLUS\u5e74\u5361\uff0c\u7acb\u4eab\u4ef7\u503c140\u5143\u5168\u54c1\u7c7b\u5238\u793c\u5305"
              , i = pageConfig.product
              , n = '<div id="J-summary-openPlusGift" class="open-plusgift">';
            n += '   <div class="dt">PLUS\u793c\u5305</div>',
            n += '   <div class="dd">',
            n += '      <a class="icon-plus" href="//plus.jd.com/index" target="_blank" clstag="shangpin|keycount|PC140PLUS_1545882013014|2"></a>',
            n += "      <em>" + o + "</em>&nbsp;",
            n += '      <a class="a-topluspage" href="//plus.jd.com/index" target="_blank" clstag="shangpin|keycount|PC140PLUS_1545882013014|2">\u8be6\u60c5 <s class="s-arrow">&gt;&gt;</s></a>',
            n += "   </div>",
            n += "</div>";
            var s = !!(e && e.jdPrice && e.jdPrice.p && Number(e.jdPrice.p) >= 2e3 && Number(e.jdPrice.p) <= 6e3)
              , a = !(!i || !i.specialAttrs || -1 === i.specialAttrs.join(",").indexOf("isCanUseJQ-0"))
              , r = !!(e && e.jdPrice && e.jdPrice.tpp)
              , c = {
                13922: 13922,
                13923: 13923,
                13924: 13924,
                13925: 13925,
                13926: 13926,
                13927: 13927,
                13928: 13928,
                13929: 13929,
                13930: 13930,
                1444: 1444,
                6151: 6151,
                6152: 6152,
                13212: 13212,
                13220: 13220,
                13531: 13531,
                13532: 13532,
                4835: 4835,
                4833: 4833,
                6980: 6980
            }
              , d = !!(i && i.cat && i.cat[2] && void 0 !== c[i.cat[2]]);
            !s || a || r || d || function(e) {
                $.ajax({
                    url: "//passport.jd.com/user/petName/getUserInfoForMiniJd.action",
                    dataType: "jsonp",
                    success: function(t) {
                        "function" == typeof e && e(t)
                    },
                    error: function(e) {
                        "undefined" != typeof console && console.log("\u83b7\u53d6\u7528\u6237\u4fe1\u606f\u5931\u8d25")
                    }
                })
            }(function(e) {
                var t = $("#J-summary-openPlusGift").length > 0;
                if (e && "3" != e.plusStatus && "4" != e.plusStatus && !t) {
                    $("#summary-support").before(n);
                    var o = pageConfig && pageConfig.product && pageConfig.product.skuid || "-";
                    try {
                        expLogJSON("PC140PLUS_1545882013014", "1", '{"sku": ' + o + "}")
                    } catch (e) {
                        "undefined" != typeof console && console.log("PLUS\u793c\u5305\u66dd\u5149\u57cb\u70b9\u9519\u8bef")
                    }
                }
            })
        }
    },
    module.exports = a
});
