
      window.gdprAppliesGlobally = true;
      (function () {
        function a(e) {
          if (!window.frames[e]) {
            if (document.body && document.body.firstChild) {
              var t = document.body;
              var n = document.createElement("iframe");
              n.style.display = "none";
              n.name = e;
              n.title = e;
              t.insertBefore(n, t.firstChild);
            } else {
              setTimeout(function () {
                a(e);
              }, 5);
            }
          }
        }
        function e(n, r, o, c, s) {
          function e(e, t, n, a) {
            if (typeof n !== "function") {
              return;
            }
            if (!window[r]) {
              window[r] = [];
            }
            var i = false;
            if (s) {
              i = s(e, t, n);
            }
            if (!i) {
              window[r].push({
                command: e,
                parameter: t,
                callback: n,
                version: a,
              });
            }
          }
          e.stub = true;
          function t(a) {
            if (!window[n] || window[n].stub !== true) {
              return;
            }
            if (!a.data) {
              return;
            }
            var i = typeof a.data === "string";
            var e;
            try {
              e = i ? JSON.parse(a.data) : a.data;
            } catch (t) {
              return;
            }
            if (e[o]) {
              var r = e[o];
              window[n](
                r.command,
                r.parameter,
                function (e, t) {
                  var n = {};
                  n[c] = { returnValue: e, success: t, callId: r.callId };
                  a.source.postMessage(i ? JSON.stringify(n) : n, "*");
                },
                r.version
              );
            }
          }
          if (typeof window[n] !== "function") {
            window[n] = e;
            if (window.addEventListener) {
              window.addEventListener("message", t, false);
            } else {
              window.attachEvent("onmessage", t);
            }
          }
        }
        e("__tcfapi", "__tcfapiBuffer", "__tcfapiCall", "__tcfapiReturn");
        a("__tcfapiLocator");
        (function (e) {
          var t = document.createElement("script");
          t.id = "spcloader";
          t.type = "text/javascript";
          t.async = true;
          t.src =
            "https://sdk.privacy-center.org/" +
            e +
            "/loader.js?target=" +
            document.location.hostname;
          t.charset = "utf-8";
          var n = document.getElementsByTagName("script")[0];
          n.parentNode.insertBefore(t, n);
        })("923bcadb-dc92-44c8-b6eb-1dc9fe53085d");
      })();

    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-JJYZ8S51VX"
    ></script>


      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-JJYZ8S51VX");

      window.$crisp = [];
      window.CRISP_WEBSITE_ID = "33bde3ac-5cc8-412f-bccb-a74a9a941252";
      (function () {
        d = document;
        s = d.createElement("script");
        s.src = "https://client.crisp.chat/l.js";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);
      })();
