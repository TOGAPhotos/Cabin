(window._iconfont_svg_string_4742334 =
  '<svg><symbol id="toga-paizhao" viewBox="0 0 1024 1024"><path d="M640 576c0 70.4-57.6 128-128 128s-128-57.6-128-128 57.6-128 128-128 128 57.6 128 128z m320-224v480c0 35.2-28.8 64-64 64H128c-35.2 0-64-28.8-64-64V352c0-35.2 28.8-64 64-64h167.2L376 192h256l80.8 96H896c35.2 0 64 28.8 64 64zM704 576c0-106.4-85.6-192-192-192S320 469.6 320 576s85.6 192 192 192 192-85.6 192-192z"  ></path></symbol><symbol id="toga-bianhao" viewBox="0 0 1024 1024"><path d="M921.088 102.4c-84.992-84.992-383.488 2.048-383.488 2.048l-3.072 3.072-464.896 464.896c-7.168 7.168-7.168 19.456 0 26.624l354.304 354.304c7.168 7.168 19.456 7.168 26.624 0l464.896-464.896 3.072-3.072c0 0.512 87.04-298.496 2.56-382.976z m-118.784 280.576c-45.056 45.056-117.76 45.056-162.304 0-45.056-45.056-45.056-117.76 0-162.304 45.056-45.056 117.76-45.056 162.304 0 45.056 44.544 45.056 117.248 0 162.304z" fill="#333333" ></path></symbol><symbol id="toga-plane" viewBox="0 0 1024 1024"><path d="M512 608.3079436L801.06525215 319.24269145s48.1539718-48.1539718 0-96.3079436-96.3079436 0-96.3079436 0l-168.64496731 168.64496731L174.71006537 319.24269145l-48.15397179 48.1539718 289.06525214 144.53262607-134.91597385 134.91597385-130.10764773-14.42497833-48.1539718 48.15397179L271.08871965 752.91128035l72.26631304 168.57425664 48.1539718-48.1539718-14.42497834-130.10764774L512 608.3079436z"  ></path><path d="M704.75730855 849.28993463L639.34993129 522.53589104l-113.49063838 113.49063838 130.74404384 261.417377z"  ></path></symbol></svg>'),
  ((n) => {
    var t = (e = (e = document.getElementsByTagName("script"))[
        e.length - 1
      ]).getAttribute("data-injectcss"),
      e = e.getAttribute("data-disable-injectsvg");
    if (!e) {
      var o,
        i,
        a,
        c,
        d,
        l = function (t, e) {
          e.parentNode.insertBefore(t, e);
        };
      if (t && !n.__iconfont__svg__cssinject__) {
        n.__iconfont__svg__cssinject__ = !0;
        try {
          document.write(
            "<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>",
          );
        } catch (t) {
          console && console.log(t);
        }
      }
      (o = function () {
        var t,
          e = document.createElement("div");
        (e.innerHTML = n._iconfont_svg_string_4742334),
          (e = e.getElementsByTagName("svg")[0]) &&
            (e.setAttribute("aria-hidden", "true"),
            (e.style.position = "absolute"),
            (e.style.width = 0),
            (e.style.height = 0),
            (e.style.overflow = "hidden"),
            (e = e),
            (t = document.body).firstChild
              ? l(e, t.firstChild)
              : t.appendChild(e));
      }),
        document.addEventListener
          ? ~["complete", "loaded", "interactive"].indexOf(document.readyState)
            ? setTimeout(o, 0)
            : ((i = function () {
                document.removeEventListener("DOMContentLoaded", i, !1), o();
              }),
              document.addEventListener("DOMContentLoaded", i, !1))
          : document.attachEvent &&
            ((a = o),
            (c = n.document),
            (d = !1),
            r(),
            (c.onreadystatechange = function () {
              "complete" == c.readyState &&
                ((c.onreadystatechange = null), s());
            }));
    }
    function s() {
      d || ((d = !0), a());
    }
    function r() {
      try {
        c.documentElement.doScroll("left");
      } catch (t) {
        return void setTimeout(r, 50);
      }
      s();
    }
  })(window);
