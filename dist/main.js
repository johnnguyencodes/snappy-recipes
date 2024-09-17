(() => {
  var e = {
      998: (e, t, a) => {
        const n = a(16),
          i = a(848),
          r = a(667),
          o = a(682),
          s = a(56).version,
          c =
            /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
        function l(e) {
          console.log(`[dotenv@${s}][DEBUG] ${e}`);
        }
        function d(e) {
          return e && e.DOTENV_KEY && e.DOTENV_KEY.length > 0
            ? e.DOTENV_KEY
            : "MISSING_ENV_VAR".DOTENV_KEY &&
                "MISSING_ENV_VAR".DOTENV_KEY.length > 0
              ? "MISSING_ENV_VAR".DOTENV_KEY
              : "";
        }
        function p(e, t) {
          let a;
          try {
            a = new URL(t);
          } catch (e) {
            if ("ERR_INVALID_URL" === e.code) {
              const e = new Error(
                "INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development"
              );
              throw ((e.code = "INVALID_DOTENV_KEY"), e);
            }
            throw e;
          }
          const n = a.password;
          if (!n) {
            const e = new Error("INVALID_DOTENV_KEY: Missing key part");
            throw ((e.code = "INVALID_DOTENV_KEY"), e);
          }
          const i = a.searchParams.get("environment");
          if (!i) {
            const e = new Error("INVALID_DOTENV_KEY: Missing environment part");
            throw ((e.code = "INVALID_DOTENV_KEY"), e);
          }
          const r = `DOTENV_VAULT_${i.toUpperCase()}`,
            o = e.parsed[r];
          if (!o) {
            const e = new Error(
              `NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${r} in your .env.vault file.`
            );
            throw ((e.code = "NOT_FOUND_DOTENV_ENVIRONMENT"), e);
          }
          return { ciphertext: o, key: n };
        }
        function m(e) {
          let t = null;
          if (e && e.path && e.path.length > 0)
            if (Array.isArray(e.path))
              for (const a of e.path)
                n.existsSync(a) &&
                  (t = a.endsWith(".vault") ? a : `${a}.vault`);
            else t = e.path.endsWith(".vault") ? e.path : `${e.path}.vault`;
          else t = i.resolve(process.cwd(), ".env.vault");
          return n.existsSync(t) ? t : null;
        }
        function u(e) {
          return "~" === e[0] ? i.join(r.homedir(), e.slice(1)) : e;
        }
        const g = {
          configDotenv: function (e) {
            const t = i.resolve(process.cwd(), ".env");
            let a = "utf8";
            const r = Boolean(e && e.debug);
            e && e.encoding
              ? (a = e.encoding)
              : r && l("No encoding is specified. UTF-8 is used by default");
            let o,
              s = [t];
            if (e && e.path)
              if (Array.isArray(e.path)) {
                s = [];
                for (const t of e.path) s.push(u(t));
              } else s = [u(e.path)];
            const c = {};
            for (const t of s)
              try {
                const i = g.parse(n.readFileSync(t, { encoding: a }));
                g.populate(c, i, e);
              } catch (e) {
                r && l(`Failed to load ${t} ${e.message}`), (o = e);
              }
            let d = "MISSING_ENV_VAR";
            return (
              e && null != e.processEnv && (d = e.processEnv),
              g.populate(d, c, e),
              o ? { parsed: c, error: o } : { parsed: c }
            );
          },
          _configVault: function (e) {
            console.log(
              `[dotenv@${s}][INFO] Loading env from encrypted .env.vault`
            );
            const t = g._parseVault(e);
            let a = "MISSING_ENV_VAR";
            return (
              e && null != e.processEnv && (a = e.processEnv),
              g.populate(a, t, e),
              { parsed: t }
            );
          },
          _parseVault: function (e) {
            const t = m(e),
              a = g.configDotenv({ path: t });
            if (!a.parsed) {
              const e = new Error(
                `MISSING_DATA: Cannot parse ${t} for an unknown reason`
              );
              throw ((e.code = "MISSING_DATA"), e);
            }
            const n = d(e).split(","),
              i = n.length;
            let r;
            for (let e = 0; e < i; e++)
              try {
                const t = p(a, n[e].trim());
                r = g.decrypt(t.ciphertext, t.key);
                break;
              } catch (t) {
                if (e + 1 >= i) throw t;
              }
            return g.parse(r);
          },
          config: function (e) {
            if (0 === d(e).length) return g.configDotenv(e);
            const t = m(e);
            return t
              ? g._configVault(e)
              : ((a = `You set DOTENV_KEY but you are missing a .env.vault file at ${t}. Did you forget to build it?`),
                console.log(`[dotenv@${s}][WARN] ${a}`),
                g.configDotenv(e));
            var a;
          },
          decrypt: function (e, t) {
            const a = Buffer.from(t.slice(-64), "hex");
            let n = Buffer.from(e, "base64");
            const i = n.subarray(0, 12),
              r = n.subarray(-16);
            n = n.subarray(12, -16);
            try {
              const e = o.createDecipheriv("aes-256-gcm", a, i);
              return e.setAuthTag(r), `${e.update(n)}${e.final()}`;
            } catch (e) {
              const t = e instanceof RangeError,
                a = "Invalid key length" === e.message,
                n =
                  "Unsupported state or unable to authenticate data" ===
                  e.message;
              if (t || a) {
                const e = new Error(
                  "INVALID_DOTENV_KEY: It must be 64 characters long (or more)"
                );
                throw ((e.code = "INVALID_DOTENV_KEY"), e);
              }
              if (n) {
                const e = new Error(
                  "DECRYPTION_FAILED: Please check your DOTENV_KEY"
                );
                throw ((e.code = "DECRYPTION_FAILED"), e);
              }
              throw e;
            }
          },
          parse: function (e) {
            const t = {};
            let a,
              n = e.toString();
            for (n = n.replace(/\r\n?/gm, "\n"); null != (a = c.exec(n)); ) {
              const e = a[1];
              let n = a[2] || "";
              n = n.trim();
              const i = n[0];
              (n = n.replace(/^(['"`])([\s\S]*)\1$/gm, "$2")),
                '"' === i &&
                  ((n = n.replace(/\\n/g, "\n")),
                  (n = n.replace(/\\r/g, "\r"))),
                (t[e] = n);
            }
            return t;
          },
          populate: function (e, t, a = {}) {
            const n = Boolean(a && a.debug),
              i = Boolean(a && a.override);
            if ("object" != typeof t) {
              const e = new Error(
                "OBJECT_REQUIRED: Please check the processEnv argument being passed to populate"
              );
              throw ((e.code = "OBJECT_REQUIRED"), e);
            }
            for (const a of Object.keys(t))
              Object.prototype.hasOwnProperty.call(e, a)
                ? (!0 === i && (e[a] = t[a]),
                  n &&
                    l(
                      !0 === i
                        ? `"${a}" is already defined and WAS overwritten`
                        : `"${a}" is already defined and was NOT overwritten`
                    ))
                : (e[a] = t[a]);
          },
        };
        (e.exports.configDotenv = g.configDotenv),
          (e.exports._configVault = g._configVault),
          (e.exports._parseVault = g._parseVault),
          (e.exports.config = g.config),
          (e.exports.decrypt = g.decrypt),
          (e.exports.parse = g.parse),
          (e.exports.populate = g.populate),
          (e.exports = g);
      },
      682: () => {},
      16: () => {},
      667: () => {},
      848: () => {},
      56: (e) => {
        "use strict";
        e.exports = JSON.parse(
          '{"name":"dotenv","version":"16.4.5","description":"Loads environment variables from .env file","main":"lib/main.js","types":"lib/main.d.ts","exports":{".":{"types":"./lib/main.d.ts","require":"./lib/main.js","default":"./lib/main.js"},"./config":"./config.js","./config.js":"./config.js","./lib/env-options":"./lib/env-options.js","./lib/env-options.js":"./lib/env-options.js","./lib/cli-options":"./lib/cli-options.js","./lib/cli-options.js":"./lib/cli-options.js","./package.json":"./package.json"},"scripts":{"dts-check":"tsc --project tests/types/tsconfig.json","lint":"standard","lint-readme":"standard-markdown","pretest":"npm run lint && npm run dts-check","test":"tap tests/*.js --100 -Rspec","test:coverage":"tap --coverage-report=lcov","prerelease":"npm test","release":"standard-version"},"repository":{"type":"git","url":"git://github.com/motdotla/dotenv.git"},"funding":"https://dotenvx.com","keywords":["dotenv","env",".env","environment","variables","config","settings"],"readmeFilename":"README.md","license":"BSD-2-Clause","devDependencies":{"@definitelytyped/dtslint":"^0.0.133","@types/node":"^18.11.3","decache":"^4.6.1","sinon":"^14.0.1","standard":"^17.0.0","standard-markdown":"^7.1.0","standard-version":"^9.5.0","tap":"^16.3.0","tar":"^6.1.11","typescript":"^4.8.4"},"engines":{"node":">=12"},"browser":{"fs":false}}'
        );
      },
    },
    t = {};
  function a(n) {
    var i = t[n];
    if (void 0 !== i) return i.exports;
    var r = (t[n] = { exports: {} });
    return e[n](r, r.exports, a), r.exports;
  }
  (a.n = (e) => {
    var t = e && e.__esModule ? () => e.default : () => e;
    return a.d(t, { a: t }), t;
  }),
    (a.d = (e, t) => {
      for (var n in t)
        a.o(t, n) &&
          !a.o(e, n) &&
          Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
    }),
    (a.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (() => {
      "use strict";
      var e = a(998);
      function t(e) {
        return (
          (t =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                }),
          t(e)
        );
      }
      function n(e, t) {
        for (var a = 0; a < t.length; a++) {
          var n = t[a];
          (n.enumerable = n.enumerable || !1),
            (n.configurable = !0),
            "value" in n && (n.writable = !0),
            Object.defineProperty(e, i(n.key), n);
        }
      }
      function i(e) {
        var a = (function (e) {
          if ("object" != t(e) || !e) return e;
          var a = e[Symbol.toPrimitive];
          if (void 0 !== a) {
            var n = a.call(e, "string");
            if ("object" != t(n)) return n;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return String(e);
        })(e);
        return "symbol" == t(a) ? a : a + "";
      }
      a.n(e)().config();
      var r = (function () {
        return (
          (e = function e() {
            !(function (e, t) {
              if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
              (this.favoriteArray = []),
              (this.restrictionsString = ""),
              (this.intolerancesString = ""),
              (this.chunkedRecipeArray = []),
              (this.chunkedRecipeArrayIndex = 0),
              (this.favoriteYPosition = null),
              (this.rect = {}),
              (this.imgurAPIKey = "70e69aa8ac79c9e4e4b0d4655bcfefb1eb5a2df8"),
              (this.imgurAlbumID = "mrTx7fF"),
              (this.imgurAccessToken =
                "17216dcc1d6f7ad57c6bf49de19491eec19b8038"),
              (this.googleAPIKey = "AIzaSyB5BwtYjKkrAEwxD-DdQkpio9h3NeL-CXY"),
              (this.spoonacularAPIKey = "f4e6431e5f814317bb427f0aa522df24"),
              (this.updateState = this.updateState.bind(this)),
              (this.getState = this.getState.bind(this));
          }),
          (t = [
            {
              key: "updateState",
              value: function (e, t) {
                this.hasOwnProperty(e)
                  ? (this[e] = t)
                  : console.warn('State key "'.concat(e, '" does not exist'));
              },
            },
            {
              key: "getState",
              value: function (e) {
                return this[e];
              },
            },
          ]) && n(e.prototype, t),
          Object.defineProperty(e, "prototype", { writable: !1 }),
          e
        );
        var e, t;
      })();
      function o(e) {
        return (
          (o =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                }),
          o(e)
        );
      }
      function s(e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      }
      function c(e, t) {
        for (var a = 0; a < t.length; a++) {
          var n = t[a];
          (n.enumerable = n.enumerable || !1),
            (n.configurable = !0),
            "value" in n && (n.writable = !0),
            Object.defineProperty(e, d(n.key), n);
        }
      }
      function l(e, t, a) {
        return (
          t && c(e.prototype, t),
          a && c(e, a),
          Object.defineProperty(e, "prototype", { writable: !1 }),
          e
        );
      }
      function d(e) {
        var t = (function (e) {
          if ("object" != o(e) || !e) return e;
          var t = e[Symbol.toPrimitive];
          if (void 0 !== t) {
            var a = t.call(e, "string");
            if ("object" != o(a)) return a;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return String(e);
        })(e);
        return "symbol" == o(t) ? t : t + "";
      }
      var p = (function () {
          return l(
            function e() {
              s(this, e), this.initAppElements();
            },
            [
              {
                key: "initAppElements",
                value: function () {
                  (this.searchRecipesDownloadText = document.getElementById(
                    "search_recipes_download_text"
                  )),
                    (this.searchRecipesDownloadProgress =
                      document.getElementById(
                        "search_recipes_download_progress"
                      )),
                    (this.favoriteRecipesDownloadProgress =
                      document.getElementById(
                        "favorite_recipes_download_progress"
                      )),
                    (this.noSearchRecipesText = document.getElementById(
                      "no_search_recipes_text"
                    )),
                    (this.uploadedImage =
                      document.getElementById("uploaded_image")),
                    (this.restrictionsCheckboxes =
                      document.getElementsByClassName("restriction-checkbox")),
                    (this.intolerancesCheckboxes =
                      document.getElementsByClassName("intolerance-checkbox")),
                    (this.imageRecognitionStatusText = document.getElementById(
                      "image_recognition_status"
                    )),
                    (this.imageRecognitionFailedText = document.getElementById(
                      "image_recognition_failed"
                    )),
                    (this.emptyFavoriteTextContainer = document.getElementById(
                      "empty_favorite_text_container"
                    )),
                    (this.favoriteRecipesStatusText = document.getElementById(
                      "favorite_recipes_status_text"
                    )),
                    (this.searchResultsQuantityDiv = document.getElementById(
                      "search_results_quantity_div"
                    )),
                    (this.resultsShownQuantityDiv = document.getElementById(
                      "results_shown_quantity_div"
                    )),
                    (this.imgurAPIError =
                      document.getElementById("imgur_api_error")),
                    (this.spoonacularSearchError = document.getElementById(
                      "spoonacular_search_error"
                    )),
                    (this.spoonacularFavoriteError = document.getElementById(
                      "spoonacular_favorite_error"
                    )),
                    (this.spoonacularFavoriteTimeoutError =
                      document.getElementById(
                        "spoonacular_favorite_timeout_error"
                      )),
                    (this.titleContainer =
                      document.getElementById("title_container")),
                    (this.percentageBarContainer = document.getElementById(
                      "percentage_bar_container"
                    )),
                    (this.uploadedImageContainer = document.getElementById(
                      "uploaded_image_container"
                    )),
                    (this.formElement = document.getElementById("form")),
                    (this.favoriteRecipesSection = document.getElementById(
                      "favorite_recipes_section"
                    )),
                    (this.inputs = document.querySelectorAll(".input")),
                    (this.searchRecipesDownloadContainer =
                      document.getElementById(
                        "search_recipes_download_container"
                      )),
                    (this.imageProcessingContainer = document.getElementById(
                      "image_processing_container"
                    )),
                    (this.dietMenu = document.getElementById("diet_menu")),
                    (this.closePreviewXButton = document.getElementById(
                      "close_preview_x_button"
                    )),
                    (this.recipeInformation = null),
                    (this.dataForImageRecognition = {
                      requests: [
                        {
                          image: { source: { imageUri: null } },
                          features: [{ type: "LABEL_DETECTION" }],
                        },
                      ],
                    }),
                    (this.spoonacularDataToSend = {
                      diet: null,
                      intolerances: null,
                    });
                },
              },
            ]
          );
        })(),
        m = (function () {
          return l(
            function e() {
              s(this, e), this.initFormElements();
            },
            [
              {
                key: "initFormElements",
                value: function () {
                  (this.fileLabel =
                    document.getElementById("custom_file_label")),
                    (this.fileInputForm =
                      document.getElementById("file_input_form")),
                    (this.recipeSearchInput = document.getElementById(
                      "recipe_search_input"
                    )),
                    (this.searchButton =
                      document.getElementById("search_button")),
                    (this.toggleFavoritesButton = document.getElementById(
                      "toggle_favorites_button"
                    )),
                    (this.toggleDietButton =
                      document.getElementById("toggle_diet_button")),
                    (this.mainContent =
                      document.getElementById("main_content")),
                    (this.errorContainer =
                      document.getElementById("error_container")),
                    (this.errorSpoonacularSearch = document.getElementById(
                      "spoonacular_search_error"
                    )),
                    (this.errorImgurCORSIssue =
                      document.getElementById("imgur_api_error")),
                    (this.errorNoFile =
                      document.getElementById("error_no_file")),
                    (this.errorIncorrectFile = document.getElementById(
                      "error_incorrect_file"
                    )),
                    (this.errorFileExceedsSize = document.getElementById(
                      "error_file_exceeds_size"
                    )),
                    (this.errorNoSearchResults = document.getElementById(
                      "no_search_recipes_text"
                    )),
                    (this.openSideMenuButton = document.getElementById(
                      "open_side_menu_button"
                    )),
                    (this.closeSideMenuButton = document.getElementById(
                      "close_side_menu_button"
                    )),
                    (this.sideMenuContainer = document.getElementById(
                      "side_menu_container"
                    )),
                    (this.userInputContainer = document.getElementById(
                      "user_input_container"
                    )),
                    (this.headerElement =
                      document.getElementById("header_element")),
                    (this.favoriteStickyDiv = document.getElementById(
                      "favorite_sticky_div"
                    ));
                },
              },
            ]
          );
        })(),
        u = (function () {
          return l(
            function e() {
              s(this, e), this.initRecipeElements();
            },
            [
              {
                key: "initRecipeElements",
                value: function () {
                  (this.searchResultsQuantityText = document.getElementById(
                    "search_results_quantity_text"
                  )),
                    (this.modalContainer =
                      document.getElementById("modal_container")),
                    (this.resultsShownQuantityText = document.getElementById(
                      "results_shown_quantity_text"
                    )),
                    (this.body = document.querySelector("body")),
                    (this.backToTopButton =
                      document.getElementById("back_to_top_button")),
                    this.backToTopButton ||
                      console.error(
                        "Element with ID 'backToTopButton' not found."
                      ),
                    (this.recipeInstructions = document.getElementById(
                      "recipe_instructions"
                    )),
                    (this.recipeIngredients =
                      document.getElementById("recipe_ingredients")),
                    (this.modalButtonContainer = document.getElementById(
                      "modal_button_container"
                    )),
                    (this.overlayPreview =
                      document.getElementById("overlay_preview")),
                    (this.modalDialog =
                      document.getElementById("modal_dialog"));
                },
              },
            ]
          );
        })(),
        g = l(function e() {
          s(this, e),
            (this.app = new p()),
            (this.form = new m()),
            (this.recipes = new u());
        });
      function h(e) {
        return (
          (h =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                }),
          h(e)
        );
      }
      function f(e, t) {
        for (var a = 0; a < t.length; a++) {
          var n = t[a];
          (n.enumerable = n.enumerable || !1),
            (n.configurable = !0),
            "value" in n && (n.writable = !0),
            Object.defineProperty(e, v(n.key), n);
        }
      }
      function v(e) {
        var t = (function (e) {
          if ("object" != h(e) || !e) return e;
          var t = e[Symbol.toPrimitive];
          if (void 0 !== t) {
            var a = t.call(e, "string");
            if ("object" != h(a)) return a;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return String(e);
        })(e);
        return "symbol" == h(t) ? t : t + "";
      }
      var y = (function () {
        return (
          (e = function e(t, a) {
            !(function (e, t) {
              if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
              (this.domManager = t),
              this.domManager.app.favoriteRecipesSection.addEventListener(
                "scroll",
                this.keepUserInputContainerPosition.bind(this)
              ),
              this.domManager.form.openSideMenuButton.addEventListener(
                "click",
                this.openSideMenu.bind(this)
              ),
              this.domManager.form.closeSideMenuButton.addEventListener(
                "click",
                this.closeSideMenu.bind(this)
              ),
              this.domManager.form.toggleFavoritesButton.addEventListener(
                "click",
                this.toggleFavorites.bind(this)
              ),
              this.domManager.form.toggleDietButton.addEventListener(
                "click",
                this.toggleDiet.bind(this)
              ),
              this.domManager.form.searchButton.addEventListener(
                "click",
                this.search.bind(this)
              ),
              this.domManager.form.fileInputForm.addEventListener(
                "change",
                this.imgValidation.bind(this)
              ),
              (this.appStateManager = a),
              overlay.addEventListener("click", this.closeSideMenu.bind(this)),
              this.domManager.form.recipeSearchInput.addEventListener(
                "keyup",
                this.enterSearch.bind(this)
              ),
              this.domManager.form.fileLabel.addEventListener(
                "dragover",
                this.imgValidation.bind(this)
              ),
              document.addEventListener("drop", function (e) {
                "file_input_form" !== e.target.id && e.preventDefault();
              });
          }),
          (t = [
            {
              key: "clickDietInfo",
              value: function (e) {
                this.dietInfo = e;
              },
            },
            {
              key: "clickPostImage",
              value: function (e) {
                this.postImage = e;
              },
            },
            {
              key: "clickGetRecipes",
              value: function (e) {
                this.getRecipes = e;
              },
            },
            {
              key: "clickGetFavoriteRecipes",
              value: function (e) {
                this.getFavoriteRecipes = e;
              },
            },
            {
              key: "clickGetRandomRecipes",
              value: function (e) {
                this.getRandomRecipes = e;
              },
            },
            {
              key: "enterSearch",
              value: function () {
                13 === event.keyCode &&
                  (event.preventDefault(), this.search(event));
              },
            },
            {
              key: "toggleFavorites",
              value: function () {
                event.preventDefault(),
                  (this.domManager.app.favoriteRecipesSection.classList =
                    "d-flex flex-column justify-content-center"),
                  (this.domManager.app.dietMenu.classList =
                    "d-none flex-column justify-content-center align-items-center"),
                  this.domManager.form.toggleFavoritesButton.classList.add(
                    "font-weight-bold"
                  ),
                  this.domManager.form.toggleDietButton.classList.remove(
                    "font-weight-bold"
                  );
              },
            },
            {
              key: "toggleDiet",
              value: function () {
                event.preventDefault(),
                  (this.domManager.app.favoriteRecipesSection.classList =
                    "d-none flex-column justify-content-center"),
                  (this.domManager.app.dietMenu.classList =
                    "d-flex flex-column justify-content-center align-items-center"),
                  this.domManager.form.toggleFavoritesButton.classList.remove(
                    "font-weight-bold"
                  ),
                  this.domManager.form.toggleDietButton.classList.add(
                    "font-weight-bold"
                  );
              },
            },
            {
              key: "openFavorites",
              value: function () {
                event.preventDefault(),
                  this.appStateManager.updateState(
                    "favoriteYPosition",
                    window.scrollY
                  ),
                  (this.domManager.app.favoriteRecipesSection.classList =
                    "favorite-recipes-visible d-flex flex-column justify-content-center"),
                  (localStorage.getItem("favoriteArray") &&
                    "[]" === localStorage.getItem("favoriteArray")) ||
                    (this.domManager.app.emptyFavoriteTextContainer.classList =
                      "d-none"),
                  (this.domManager.form.mainContent.classList =
                    "row main-content-right noscroll"),
                  (this.domManager.form.mainContent.style.top = "-".concat(
                    this.appStateManager.getState("favoriteYPosition"),
                    "px"
                  )),
                  (this.domManager.app.formElement.style.top = "0px"),
                  (this.domManager.app.formElement.classList =
                    "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center form-element-left"),
                  (overlay.classList = ""),
                  this.getFavoriteRecipes();
              },
            },
            {
              key: "closeFavorites",
              value: function () {
                event.preventDefault(),
                  (this.domManager.app.favoriteRecipesSection.classList =
                    "favorite-recipes-hidden d-flex flex-column justify-content-center"),
                  (this.domManager.form.mainContent.classList = "row"),
                  (overlay.classList = "d-none"),
                  window.scroll(
                    0,
                    this.appStateManager.getState("favoriteYPosition")
                  ),
                  (this.domManager.app.formElement.classList =
                    "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center"),
                  (this.domManager.app.favoriteRecipesDownloadProgress.classList =
                    "recipe-progress-hidden mt-3 text-center"),
                  (this.domManager.app.spoonacularFavoriteError.classList =
                    "d-none"),
                  (this.domManager.app.spoonacularFavoriteTimeoutError.classList =
                    "d-none");
              },
            },
            {
              key: "openSideMenu",
              value: function () {
                event.preventDefault(),
                  this.appStateManager.updateState(
                    "favoriteYPosition",
                    window.scrollY
                  ),
                  this.appStateManager.updateState(
                    "rect",
                    this.domManager.form.userInputContainer.getBoundingClientRect()
                  ),
                  (this.domManager.form.closeSideMenuButton.classList =
                    "close-side-menu-button-visible d-flex justify-content-center align-items-center text-danger p-0 m-0"),
                  (this.domManager.form.toggleFavoritesButton.classList =
                    "favorites-toggle-visible toggle btn btn-danger text-white m-2 px-2 py-0 d-flex justify-content-center align-items-center font-weight-bold"),
                  (this.domManager.form.favoriteStickyDiv.classList =
                    "favorite-sticky-div-visible m-0 p-0"),
                  (this.domManager.form.toggleDietButton.classList =
                    "diet-toggle-visible toggle btn btn-primary text-white m-2 px-2 py-0 d-flex justify-content-center align-items-center"),
                  (this.domManager.form.sideMenuContainer.classList =
                    "side-menu-visible d-flex flex-column justify-content-center align-items-center"),
                  (this.domManager.app.favoriteRecipesSection.classList =
                    "d-flex flex-column justify-content-center"),
                  (this.domManager.app.dietMenu.classList =
                    "d-none flex-column justify-content-center align-items-center"),
                  (this.domManager.form.mainContent.classList =
                    "row main-content-right noscroll"),
                  (overlay.classList = ""),
                  (this.domManager.form.mainContent.style.top = "-".concat(
                    this.appStateManager.getState("favoriteYPosition"),
                    "px"
                  )),
                  (this.domManager.form.headerElement.classList =
                    "d-flex flex-column align-items-center justify-content-center my-2 px-0"),
                  (this.domManager.app.formElement.style.top = "0px"),
                  (this.domManager.app.formElement.classList =
                    "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center form-element-left"),
                  (this.domManager.form.userInputContainer.classList =
                    "col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-3 px-0"),
                  (this.domManager.form.mainContent.style.top = "-".concat(
                    this.appStateManager.getState("favoriteYPosition"),
                    "px - 50px"
                  )),
                  this.getFavoriteRecipes();
              },
            },
            {
              key: "keepUserInputContainerPosition",
              value: function () {
                document
                  .getElementById("side_menu_container")
                  .classList.contains("side-menu-visible") &&
                  document
                    .getElementById("diet_menu")
                    .classList.contains("d-none") &&
                  (this.domManager.form.userInputContainer.scrollY =
                    this.appStateManager.getState("rect").top);
              },
            },
            {
              key: "closeSideMenu",
              value: function () {
                event.preventDefault(),
                  (this.domManager.form.closeSideMenuButton.classList =
                    "close-side-menu-button-hidden d-flex justify-content-center align-items-center text-danger p-0 m-0"),
                  (this.domManager.form.toggleFavoritesButton.classList =
                    "favorites-toggle-hidden toggle btn btn-danger text-white m-0 px-2 py-0 d-flex justify-content-center align-items-center"),
                  (this.domManager.form.toggleDietButton.classList =
                    "diet-toggle-hidden toggle btn btn-primary text-white m-0 px-2 py-0 d-flex justify-content-center align-items-center"),
                  (this.domManager.form.favoriteStickyDiv.classList =
                    "favorite-sticky-div-hidden m-0 p-0"),
                  (this.domManager.form.sideMenuContainer.classList =
                    "side-menu-hidden d-flex flex-column justify-content-center align-items-center"),
                  (this.domManager.form.mainContent.classList = "row"),
                  (overlay.classList = "d-none"),
                  window.scroll(
                    0,
                    this.appStateManager.getState("favoriteYPosition")
                  ),
                  (this.domManager.app.formElement.classList =
                    "sticky col-12 col-xl-4 offset-xl-0 d-flex flex-column align-items-center"),
                  (this.domManager.form.headerElement.classList =
                    "static d-flex flex-column align-items-center justify-content-center my-2 px-0"),
                  (this.domManager.app.favoriteRecipesDownloadProgress.classList =
                    "favorite-recipe-progress-hidden mt-3 text-center"),
                  (this.domManager.app.spoonacularFavoriteError.classList =
                    "d-none"),
                  (this.domManager.app.spoonacularFavoriteTimeoutError.classList =
                    "d-none"),
                  (this.domManager.form.userInputContainer.classList =
                    "col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-3 px-0"),
                  this.dietInfo();
              },
            },
            {
              key: "imgValidation",
              value: function (e) {
                if (
                  (e.preventDefault(),
                  this.domManager.form.fileInputForm.files[0])
                ) {
                  for (var t = 0; t < this.domManager.app.inputs.length; t++)
                    (this.domManager.app.inputs[t].disabled = !0),
                      this.domManager.app.inputs[t].classList.add("no-click");
                  for (; document.getElementById("recipe"); )
                    document.getElementById("recipe").remove();
                  document.getElementById("image_title") &&
                    document.getElementById("image_title").remove(),
                    document.getElementById("title_score") &&
                      document.getElementById("title_score").remove(),
                    document.getElementById("hr") &&
                      document.getElementById("hr").remove(),
                    (this.domManager.app.percentageBarContainer.classList =
                      "col-12 d-flex flex-column justify-content-center my-3 desktop-space-form"),
                    (this.domManager.app.uploadedImage.src = ""),
                    (this.domManager.app.searchResultsQuantityDiv.classList =
                      "d-none"),
                    (this.domManager.app.resultsShownQuantityDiv.classList =
                      "d-none"),
                    (this.domManager.app.imageRecognitionFailedText.classList =
                      "d-none"),
                    (this.domManager.form.errorContainer.classList =
                      "d-none desktop-space-form"),
                    (this.domManager.form.errorNoFile.classList = "d-none"),
                    (this.domManager.form.errorIncorrectFile.classList =
                      "d-none"),
                    (this.domManager.form.errorFileExceedsSize.classList =
                      "d-none"),
                    (this.domManager.form.errorSpoonacularSearch.classList =
                      "d-none"),
                    (this.domManager.form.errorNoSearchResults.classList =
                      "d-none"),
                    (this.domManager.form.errorImgurCORSIssue.classList =
                      "d-none"),
                    (this.domManager.form.errorNoSearchResults.classList =
                      "d-none"),
                    (this.domManager.app.titleContainer.classList =
                      "col-xs-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-around flex-column desktop-space-form mb-3"),
                    (this.domManager.app.percentageBarContainer.classList =
                      "col-12 d-flex flex-column justify-content-center my-3 desktop-space-form"),
                    (this.domManager.app.uploadedImageContainer.classList =
                      "col-xs-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-center my-3 desktop-space-form"),
                    this.domManager.form.fileInputForm.files[1] &&
                      this.domManager.form.fileInputForm.files.splice(1, 1);
                  var a = this.domManager.form.fileInputForm.files[0];
                  if (a) {
                    var n = a.type,
                      i = new FormData();
                    if (["image/jpeg", "image/png", "image/gif"].includes(n))
                      if (a.size > 10485760) {
                        (this.domManager.form.errorContainer.classList =
                          "col-12 mt-2 desktop-space-form"),
                          (this.domManager.form.errorFileExceedsSize.classList =
                            "text-danger text-center"),
                          (this.domManager.form.fileInputForm.value = "");
                        for (
                          var r = 0;
                          r < this.domManager.app.inputs.length;
                          r++
                        )
                          (this.domManager.app.inputs[r].disabled = !1),
                            this.domManager.app.inputs[r].classList.remove(
                              "no-click"
                            );
                      } else
                        this.dietInto(),
                          i.append("image", a),
                          i.append(
                            "album",
                            this.appStateManager.getState("imgurAlbumID")
                          ),
                          this.postImage(i, this.domManager),
                          (this.domManager.form.fileInputForm.value = "");
                    else {
                      (this.domManager.form.errorContainer.classList =
                        "col-12 mt-2 desktop-space-form"),
                        (this.domManager.form.errorIncorrectFile.classList =
                          "text-danger text-center"),
                        (this.domManager.form.fileInputForm.value = "");
                      for (
                        var o = 0;
                        o < this.domManager.app.inputs.length;
                        o++
                      )
                        (this.domManager.app.inputs[o].disabled = !1),
                          this.domManager.app.inputs[o].classList.remove(
                            "no-click"
                          );
                    }
                  } else {
                    (this.domManager.form.errorContainer.classList =
                      "col-12 mt-2 desktop-space-form"),
                      (this.domManager.form.errorNoFile.classList =
                        "text-danger text-center"),
                      (this.domManager.form.fileInputForm.value = "");
                    for (var s = 0; s < this.domManager.app.inputs.length; s++)
                      (this.domManager.app.inputs[s].disabled = !1),
                        this.domManager.app.inputs[s].classList.remove(
                          "no-click"
                        );
                  }
                }
              },
            },
            {
              key: "search",
              value: function (e) {
                for (e.preventDefault(); document.getElementById("recipe"); )
                  document.getElementById("recipe").remove();
                (this.domManager.app.searchResultsQuantityDiv.classList =
                  "d-none"),
                  (this.domManager.app.resultsShownQuantityDiv.classList =
                    "d-none"),
                  (this.domManager.app.imageRecognitionFailedText.classList =
                    "d-none"),
                  (this.domManager.form.errorContainer.classList =
                    "d-none desktop-space-form"),
                  (this.domManager.form.errorNoFile.classList = "d-none"),
                  (this.domManager.form.errorIncorrectFile.classList =
                    "d-none"),
                  (this.domManager.form.errorFileExceedsSize.classList =
                    "d-none"),
                  (this.domManager.form.errorSpoonacularSearch.classList =
                    "d-none"),
                  (this.domManager.form.errorNoSearchResults.classList =
                    "d-none"),
                  (this.domManager.form.errorImgurCORSIssue.classList =
                    "d-none"),
                  (this.domManager.form.errorNoSearchResults.classList =
                    "d-none");
                for (var t = 0; t < this.domManager.app.inputs.length; t++)
                  (this.domManager.app.inputs[t].disabled = !0),
                    this.domManager.app.inputs[t].classList.add("no-click");
                var a = this.domManager.form.recipeSearchInput.value;
                this.dietInfo(),
                  (this.domManager.app.titleContainer.classList =
                    "d-none desktop-space-form"),
                  (this.domManager.app.percentageBarContainer.classList =
                    "d-none desktop-space-form"),
                  (this.domManager.app.uploadedImageContainer.classList =
                    "d-none desktop-space-form"),
                  a ? this.getRecipes(a) : this.getRandomRecipes();
              },
            },
          ]) && f(e.prototype, t),
          Object.defineProperty(e, "prototype", { writable: !1 }),
          e
        );
        var e, t;
      })();
      function S(e) {
        return (
          (S =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                }),
          S(e)
        );
      }
      function b(e, t) {
        for (var a = 0; a < t.length; a++) {
          var n = t[a];
          (n.enumerable = n.enumerable || !1),
            (n.configurable = !0),
            "value" in n && (n.writable = !0),
            Object.defineProperty(e, M(n.key), n);
        }
      }
      function M(e) {
        var t = (function (e) {
          if ("object" != S(e) || !e) return e;
          var t = e[Symbol.toPrimitive];
          if (void 0 !== t) {
            var a = t.call(e, "string");
            if ("object" != S(a)) return a;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return String(e);
        })(e);
        return "symbol" == S(t) ? t : t + "";
      }
      var x = (function () {
        return (
          (e = function e(t) {
            !(function (e, t) {
              if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
              (this.domManager = t);
          }),
          (t = [
            {
              key: "postedImageDownloadProgress",
              value: function (e) {
                var t = this;
                this.domManager.app.imageProcessingContainer.classList =
                  "d-none desktop-space-form";
                var a = e,
                  n = {
                    LoadImage: function (a, n) {
                      return new Promise(function (a) {
                        var n = new XMLHttpRequest();
                        n.open("GET", e, !0),
                          (n.responseType = "arraybuffer"),
                          (n.onprogress = function (e) {
                            if (e.lengthComputable) {
                              var a = e.loaded / e.total;
                              $("#percentage_bar_download").css({
                                width: 100 * a + "%",
                              }),
                                a > 0 &&
                                  a < 1 &&
                                  $(
                                    "#percentage_download_container"
                                  ).removeClass("d-none"),
                                1 === a &&
                                  ($("#percentage_download_container").addClass(
                                    "d-none"
                                  ),
                                  (t.domManager.app.percentageBarContainer.classList =
                                    "d-none desktop-space-form"));
                            }
                          }),
                          (n.onloadend = function () {
                            var e = {},
                              i = n
                                .getAllResponseHeaders()
                                .match(/^Content-Type:\s*(.*?)$/im);
                            i && i[1] && (e.type = i[1]);
                            var r = new Blob([t.response], e);
                            a(window.URL.createObjectURL(r));
                          }),
                          n.send();
                      });
                    },
                  };
                this.imageLoaderFunction(n, a);
              },
            },
            {
              key: "imageLoaderFunction",
              value: function (e, t) {
                var a = this;
                e.LoadImage("imageURL").then(function (e) {
                  a.domManager.app.uploadedImage.src = t;
                });
              },
            },
            {
              key: "imageTitleOnPage",
              value: function (e, t) {
                var a = document.createElement("h1");
                (a.id = "image_title"),
                  (a.classList = "text-center"),
                  (a.textContent = e),
                  this.domManager.app.titleContainer.append(a);
                var n = document.createElement("p");
                (n.id = "title_score"), (n.classList = "text-center");
                var i = (100 * t).toFixed(2);
                (n.textContent = "Confidence: ".concat(i, "%")),
                  this.domManager.app.titleContainer.append(n);
                var r = document.createElement("hr");
                (r.id = "hr"),
                  (r.classList = "mx-3 my-0 py-0 d-xl-none"),
                  this.domManager.app.titleContainer.append(r);
              },
            },
          ]) && b(e.prototype, t),
          Object.defineProperty(e, "prototype", { writable: !1 }),
          e
        );
        var e, t;
      })();
      function E(e) {
        return (
          (E =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                }),
          E(e)
        );
      }
      function I(e) {
        return (
          (function (e) {
            if (Array.isArray(e)) return L(e);
          })(e) ||
          (function (e) {
            if (
              ("undefined" != typeof Symbol && null != e[Symbol.iterator]) ||
              null != e["@@iterator"]
            )
              return Array.from(e);
          })(e) ||
          (function (e, t) {
            if (e) {
              if ("string" == typeof e) return L(e, t);
              var a = {}.toString.call(e).slice(8, -1);
              return (
                "Object" === a && e.constructor && (a = e.constructor.name),
                "Map" === a || "Set" === a
                  ? Array.from(e)
                  : "Arguments" === a ||
                      /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)
                    ? L(e, t)
                    : void 0
              );
            }
          })(e) ||
          (function () {
            throw new TypeError(
              "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
            );
          })()
        );
      }
      function L(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var a = 0, n = Array(t); a < t; a++) n[a] = e[a];
        return n;
      }
      function R(e, t) {
        for (var a = 0; a < t.length; a++) {
          var n = t[a];
          (n.enumerable = n.enumerable || !1),
            (n.configurable = !0),
            "value" in n && (n.writable = !0),
            Object.defineProperty(e, k(n.key), n);
        }
      }
      function k(e) {
        var t = (function (e) {
          if ("object" != E(e) || !e) return e;
          var t = e[Symbol.toPrimitive];
          if (void 0 !== t) {
            var a = t.call(e, "string");
            if ("object" != E(a)) return a;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return String(e);
        })(e);
        return "symbol" == E(t) ? t : t + "";
      }
      var _ = (function () {
        return (
          (e = function e(t, a, n, i) {
            !(function (e, t) {
              if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
              (this.appStateManager = i),
              (this.domManager = n),
              (this.searchRecipesContainer = t),
              (this.favoriteRecipesContainer = a),
              window.addEventListener(
                "scroll",
                this.handleShowMoreScroll.bind(this)
              ),
              this.domManager.recipes.backToTopButton.addEventListener(
                "click",
                this.handleBackToTopClick
              ),
              (this.displaySearchedRecipes =
                this.displaySearchedRecipes.bind(this)),
              (this.updateResultsQuantityShown =
                this.updateResultsQuantityShown.bind(this)),
              (this.favoriteCheck = this.favoriteCheck.bind(this)),
              this.domManager.recipes.modalContainer.addEventListener(
                "click",
                this.closePreview.bind(this, event)
              ),
              this.domManager.app.closePreviewXButton.addEventListener(
                "click",
                this.closePreview.bind(this, event)
              );
          }),
          (t = [
            {
              key: "clickGetFavoriteRecipes",
              value: function (e) {
                this.getFavoriteRecipes = e;
              },
            },
            {
              key: "chunkSearchedRecipes",
              value: function (e) {
                if (
                  ((this.domManager.app.recipeInformation = e), e.results[0])
                ) {
                  (this.domManager.app.searchResultsQuantityDiv.classList =
                    "d-flex justify-content-center mt-3"),
                    (this.domManager.recipes.searchResultsQuantityText.textContent =
                      "".concat(e.results.length, " recipes found"));
                  for (var t = 0; t < e.results.length; ) {
                    var a = this.appStateManager.getState("chunkedRecipeArray");
                    a.push(e.results.slice(t, t + 12)),
                      this.appStateManager.updateState("chunkedRecipeArray", a),
                      (t += 12);
                  }
                  this.displaySearchedRecipes(
                    this.appStateManager.getState("chunkedRecipeArray"),
                    this.appStateManager.getState("chunkedRecipeArrayIndex")
                  ),
                    e.results.length > 12 &&
                      (this.domManager.app.resultsShownQuantityDiv.classList =
                        "d-flex flex-column align-items-center justify-content-center mb-3"),
                    this.updateResultsQuantityShown();
                } else {
                  (this.domManager.app.searchRecipesDownloadProgress.classList =
                    "recipe-progress-hidden mt-3"),
                    (this.domManager.app.searchRecipesDownloadText.classList =
                      "d-none"),
                    (this.domManager.app.noSearchRecipesText.classList =
                      "text-center mt-3");
                  for (var n = 0; n < this.domManager.app.inputs.length; n++)
                    (this.domManager.app.inputs[n].disabled = !1),
                      this.domManager.app.inputs[n].classList.remove(
                        "no-click"
                      );
                }
              },
            },
            {
              key: "chunkRandomRecipes",
              value: function (e) {
                if (
                  ((this.domManager.app.recipeInformation = e), e.results[0])
                ) {
                  (this.domManager.app.searchResultsQuantityDiv.classList =
                    "d-flex justify-content-center mt-3"),
                    (this.domManager.recipes.searchResultsQuantityText.textContent =
                      "".concat(e.results.length, " random recipes found"));
                  for (var t = 0; t < e.results.length; ) {
                    var a = this.appStateManager.getState("chunkedRecipeArray");
                    a.push(e.results.slice(t, t + 12)),
                      this.appStateManager.updateState("chunkedRecipeArray", a),
                      (t += 12);
                  }
                  this.displaySearchedRecipes(
                    this.appStateManager.getState("chunkedRecipeArray"),
                    this.appStateManager.getState("chunkedRecipeArrayIndex")
                  ),
                    e.results.length > 12 &&
                      (this.domManager.app.resultsShownQuantityDiv.classList =
                        "d-flex flex-column align-items-center justify-content-center mb-3"),
                    this.updateResultsQuantityShown();
                } else {
                  (this.domManager.app.searchRecipesDownloadProgress.classList =
                    "recipe-progress-hidden mt-3"),
                    (this.domManager.app.searchRecipesDownloadText.classList =
                      "d-none"),
                    (this.domManager.app.noSearchRecipesText.classList =
                      "text-center mt-3");
                  for (var n = 0; n < this.domManager.app.inputs.length; n++)
                    (this.domManager.app.inputs[n].disabled = !1),
                      this.domManager.app.inputs[n].classList.remove(
                        "no-click"
                      );
                }
              },
            },
            {
              key: "handleShowMoreScroll",
              value: function () {
                if (
                  document.documentElement.scrollTop + window.innerHeight ===
                    document.documentElement.scrollHeight &&
                  this.appStateManager.getState("chunkedRecipeArrayIndex") !==
                    this.appStateManager.getState("chunkedRecipeArray").length -
                      1
                ) {
                  var e = window.scrollY;
                  this.appStateManager.updateState(
                    "chunkedRecipeArrayIndex",
                    this.appStateManager.getState("chunkedRecipeArrayIndex") + 1
                  ),
                    this.displaySearchedRecipes(
                      this.appStateManager.getState("chunkedRecipeArray"),
                      this.appStateManager.getState("chunkedRecipeArrayIndex")
                    ),
                    window.scroll(0, e),
                    this.updateResultsQuantityShown();
                }
              },
            },
            {
              key: "handleBackToTopClick",
              value: function () {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
              },
            },
            {
              key: "updateResultsQuantityShown",
              value: function () {
                this.domManager.recipes.resultsShownQuantityText.textContent =
                  "Showing "
                    .concat(
                      document.querySelectorAll(".recipe-card").length,
                      " of "
                    )
                    .concat(
                      this.domManager.recipes.searchResultsQuantityText.textContent.substring(
                        0,
                        3
                      )
                    );
              },
            },
            {
              key: "handleFavoriteClick",
              value: function (e) {
                event.stopPropagation();
                var t = document.getElementById("heart_icon_".concat(e));
                if (
                  (t.parentNode.parentNode.parentNode.lastChild.firstChild.firstChild.firstChild.textContent
                    .split(" ")
                    .slice(0, 2)
                    .join(" "),
                  this.appStateManager.getState("favoriteArray").includes(e))
                ) {
                  var a = this.appStateManager.getState("favoriteArray"),
                    n = this.appStateManager
                      .getState("favoriteArray")
                      .indexOf(e);
                  -1 !== n &&
                    (a.splice(n, 1),
                    this.appStateManager.updateState("favoriteArray", a)),
                    (t.classList = "far fa-heart text-danger heart-icon fa-lg"),
                    (t.parentNode.parentNode.parentNode.classList =
                      "recipe-card card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100");
                } else
                  this.appStateManager.updateState(
                    "favoriteArray",
                    [].concat(
                      I(this.appStateManager.getState("favoriteArray")),
                      [e]
                    )
                  ),
                    (t.classList = "fas fa-heart text-danger heart-icon fa-lg"),
                    (t.parentNode.parentNode.parentNode.classList =
                      "recipe-card favorited card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100");
                localStorage.setItem(
                  "favoriteArray",
                  JSON.stringify(this.appStateManager.getState("favoriteArray"))
                );
              },
            },
            {
              key: "handleDeleteClick",
              value: function (e) {
                event.stopPropagation(),
                  document
                    .getElementById("".concat(e))
                    .firstChild.nextSibling.firstChild.firstChild.firstChild.textContent.split(
                      " "
                    )
                    .slice(0, 2)
                    .join(" ");
                var t = this.appStateManager.getState("favoriteArray"),
                  a = this.appStateManager.getState("favoriteArray").indexOf(e);
                -1 !== a &&
                  (t.splice(a, 1),
                  this.appStateManager.updateState("favoriteArray", t)),
                  document.getElementById("".concat(e)).remove(),
                  localStorage.setItem(
                    "favoriteArray",
                    JSON.stringify(
                      this.appStateManager.getState("favoriteArray")
                    )
                  ),
                  "[]" === localStorage.getItem("favoriteArray") &&
                    ((this.domManager.app.emptyFavoriteTextContainer.classList =
                      "d-flex justify-content-center"),
                    (this.domManager.app.favoriteRecipesSection.classList =
                      "favorite-recipes-visible d-flex flex-column justify-content-center")),
                  this.domManager.app.favoriteRecipesSection.scrollHeight >
                  this.domManager.app.favoriteRecipesSection.clientHeight
                    ? (this.domManager.app.favoriteRecipesSection.classList =
                        "favorite-recipes-visible d-flex flex-column justify-content-start")
                    : (this.domManager.app.favoriteRecipesSection.classList =
                        "favorite-recipes-visible d-flex flex-column justify-content-center"),
                  this.favoriteCheck(e);
              },
            },
            {
              key: "handleFavoriteButtonClick",
              value: function (e) {
                event.stopPropagation();
                var t = document.getElementById("favorite_button");
                if (
                  (document
                    .getElementById("recipe_title")
                    .textContent.split(" ")
                    .slice(2, 4)
                    .join(" "),
                  !this.appStateManager.getState("favoriteArray").includes(e))
                )
                  return (
                    this.appStateManager.updateState(
                      "favoriteArray",
                      [].concat(
                        I(this.appStateManager.getState("favoriteArray")),
                        [e]
                      )
                    ),
                    (t.classList = "btn btn-danger"),
                    (t.textContent = "Remove from Favorites"),
                    document.getElementById("heart_icon_".concat(e)) &&
                      (document.getElementById(
                        "heart_icon_".concat(e)
                      ).classList =
                        "fas fa-heart text-danger heart-icon fa-lg"),
                    localStorage.setItem(
                      "favoriteArray",
                      JSON.stringify(
                        this.appStateManager.getState("favoriteArray")
                      )
                    ),
                    void (
                      this.domManager.app.favoriteRecipesSection.classList.contains(
                        "favorite-recipes-visible"
                      ) &&
                      (this.getFavoriteRecipes(),
                      (this.domManager.app.spoonacularFavoriteError.classList =
                        "d-none"),
                      (this.domManager.app.spoonacularFavoriteTimeoutError.classList =
                        "d-none"))
                    )
                  );
                var a = this.appStateManager.getState("favoriteArray"),
                  n = this.appStateManager.getState("favoriteArray").indexOf(e);
                -1 !== n &&
                  (a.splice(n, 1),
                  this.appStateManager.updateState("favoriteArray", a)),
                  localStorage.setItem(
                    "favoriteArray",
                    JSON.stringify(
                      this.appStateManager.getState("favoriteArray")
                    )
                  ),
                  (t.classList = "btn btn-outline-danger"),
                  (t.textContent = "Save to Favorites"),
                  document.getElementById("heart_icon_".concat(e)) &&
                    (document.getElementById(
                      "heart_icon_".concat(e)
                    ).classList = "far fa-heart text-danger heart-icon fa-lg"),
                  document.getElementById("".concat(e)) &&
                    document.getElementById("".concat(e)).remove(),
                  this.domManager.app.favoriteRecipesSection.scrollHeight >
                    this.domManager.app.favoriteRecipesSection.clientHeight &&
                  this.domManager.app.favoriteRecipesSection.classList.contains(
                    "favorite-recipes-visible"
                  )
                    ? (this.domManager.app.favoriteRecipesSection.classList =
                        "favorite-recipes-visible d-flex flex-column justify-content-start")
                    : (this.domManager.app.favoriteRecipesSection.classList =
                        "favorite-recipes-visible d-flex flex-column justify-content-center"),
                  localStorage.setItem(
                    "favoriteArray",
                    JSON.stringify(
                      this.appStateManager.getState("favoriteArray")
                    )
                  ),
                  (localStorage.getItem("favoriteArray") &&
                    "[]" !== localStorage.getItem("favoriteArray")) ||
                    (this.domManager.app.emptyFavoriteTextContainer.classList =
                      "d-flex justify-content-center");
              },
            },
            {
              key: "favoriteCheck",
              value: function () {
                if (localStorage.getItem("favoriteArray"))
                  for (
                    var e = document.querySelectorAll("#heart_container i"),
                      t = JSON.parse(localStorage.getItem("favoriteArray")),
                      a = 0;
                    a < e.length;
                    a++
                  )
                    t.includes(parseInt(e[a].id.substring(11)))
                      ? (e[a].classList =
                          "fas fa-heart text-danger heart-icon fa-lg")
                      : (e[a].classList =
                          "far fa-heart text-danger heart-icon fa-lg");
              },
            },
            {
              key: "modalHandler",
              value: function (e, t, a, n, i, r, o) {
                if (r) {
                  document.getElementById("recipe_body");
                  var s = document.getElementById("recipe_title"),
                    c = document.getElementById("recipe_image"),
                    l = document.getElementById("recipe_summary"),
                    d = document.createElement("button");
                  (this.domManager.recipes.overlayPreview.classList = ""),
                    (d.id = "external_link_button"),
                    (d.classList = "btn btn-primary text-white"),
                    (d.textContent = "Recipe Page");
                  var p = document.createElement("button");
                  (p.id = "favorite_button"),
                    (this.domManager.app.closePreviewXButton.classList =
                      "close-preview-x-button-visible justify-content-center align-items-center text-danger p-0 m-0"),
                    this.domManager.recipes.modalButtonContainer.append(d),
                    this.domManager.recipes.modalButtonContainer.append(p);
                  for (var m = 0; m < r.length; m++) {
                    var u = document.createElement("li");
                    (u.textContent = ""
                      .concat(r[m].amount, " ")
                      .concat(r[m].unit, " ")
                      .concat(r[m].name)),
                      this.domManager.recipes.recipeIngredients.append(u);
                  }
                  var g = DOMPurify.sanitize(o);
                  (this.domManager.recipes.modalContainer.classList = ""),
                    (s.textContent = "Recipe Preview: ".concat(t)),
                    (c.src = e),
                    (l.innerHTML = g),
                    (this.domManager.recipes.body.classList =
                      "bg-light freeze"),
                    d.addEventListener("click", function () {
                      window.open(a, "_blank");
                    }),
                    p.addEventListener(
                      "click",
                      this.handleFavoriteButtonClick.bind(this, n)
                    ),
                    this.appStateManager.getState("favoriteArray").includes(n)
                      ? ((p.classList = "btn btn-danger"),
                        (p.textContent = "Remove from Favorites"))
                      : ((p.classList = "btn btn-outline-danger"),
                        (p.textContent = "Save to Favorites"));
                  for (var h = 0; h < i.length; h++) {
                    if ("var article" === i[h]) return;
                    var f = document.createElement("li");
                    (f.textContent = i[h]),
                      this.domManager.recipes.recipeInstructions.append(f);
                  }
                }
              },
            },
            {
              key: "closePreview",
              value: function () {
                if (
                  "modal_container" === event.target.id ||
                  "close_preview_x_icon" === event.target.id
                ) {
                  for (
                    document
                      .querySelector(".modal-body")
                      .scrollTo({ top: 0, behavior: "auto" }),
                      this.domManager.recipes.modalContainer.classList =
                        "d-none justify-content-center",
                      this.domManager.recipes.body.classList = "bg-light",
                      this.domManager.recipes.overlayPreview.classList =
                        "d-none";
                    this.domManager.recipes.recipeInstructions.firstChild;

                  )
                    this.domManager.recipes.recipeInstructions.removeChild(
                      this.domManager.recipes.recipeInstructions.firstChild
                    );
                  for (; this.domManager.recipes.recipeIngredients.firstChild; )
                    this.domManager.recipes.recipeIngredients.removeChild(
                      this.domManager.recipes.recipeIngredients.firstChild
                    );
                  for (
                    ;
                    this.domManager.recipes.modalButtonContainer.firstChild;

                  )
                    this.domManager.recipes.modalButtonContainer.removeChild(
                      this.domManager.recipes.modalButtonContainer.firstChild
                    );
                }
              },
            },
            {
              key: "displaySearchedRecipes",
              value: function (e, t) {
                for (var a = 0; a < e[t].length; a++) {
                  var n = "".concat(
                      e[t][a].image.substring(0, e[t][a].image.length - 11),
                      "480x360.jpg"
                    ),
                    i = e[t][a].title,
                    r = e[t][a].readyInMinutes,
                    o = e[t][a].servings,
                    s = e[t][a].sourceUrl,
                    c = Math.round(e[t][a].nutrition.nutrients[0].amount),
                    l = Math.round(e[t][a].nutrition.nutrients[8].amount),
                    d = Math.round(e[t][a].nutrition.nutrients[1].amount),
                    p = Math.round(e[t][a].nutrition.nutrients[3].amount),
                    m = Math.round(e[t][a].nutrition.nutrients[7].amount),
                    u = e[t][a].id,
                    g = [];
                  if (e[t][a].analyzedInstructions)
                    for (
                      var h = 0;
                      h < e[t][a].analyzedInstructions[0].steps.length;
                      h++
                    )
                      g.push(e[t][a].analyzedInstructions[0].steps[h].step);
                  else g.push("Instructions are available on the Recipe Page.");
                  var f = e[t][a].nutrition.ingredients,
                    v = e[t][a].summary,
                    y = document.createElement("div");
                  (y.classList =
                    "recipe-card card col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2 m-3 px-0 h-100"),
                    (y.id = "recipe");
                  var S = document.createElement("div"),
                    b = document.createElement("a");
                  S.classList = "d-flex justify-content-center";
                  var M = document.createElement("img");
                  (S.classList =
                    "card-image-top d-flex justify-content-center mt-3"),
                    (M.src = n),
                    (M.alt = "Recipe Image"),
                    (M.classList = "mb-1 p-0"),
                    (M.width = "240"),
                    (M.height = "180");
                  var x = document.createElement("span");
                  (x.id = "heart_container"),
                    (x.classList =
                      "badge badge-light m-1 p-1 border border-danger rounded");
                  var E = document.createElement("i");
                  (E.id = "heart_icon_".concat(u)),
                    this.appStateManager.getState("favoriteArray").includes(u)
                      ? (E.classList =
                          "fas fa-heart text-danger heart-icon fa-lg")
                      : (E.classList =
                          "far fa-heart text-danger heart-icon fa-lg"),
                    x.append(E),
                    S.append(x),
                    x.addEventListener(
                      "click",
                      this.handleFavoriteClick.bind(this, u, event)
                    );
                  var I = document.createElement("div");
                  I.classList = "card-body py-0 mb-2";
                  var L = document.createElement("div");
                  L.classList = "card-title mb-2";
                  var R = document.createElement("h5");
                  R.textContent = i;
                  var k = document.createElement("div");
                  k.classList = "card-text";
                  var _ = document.createElement("span");
                  (_.classList = "badge badge-dark mr-1 mb-1"),
                    (_.textContent = "".concat(r, " Minutes"));
                  var w = document.createElement("span");
                  (w.classList = "badge badge-dark mb-1"),
                    (w.textContent = "".concat(o, " Servings")),
                    k.append(_),
                    k.append(w);
                  var C = document.createElement("div");
                  C.classList = "card-text d-flex flex-wrap";
                  var T = document.createElement("span");
                  (T.classList = "badge badge-secondary mb-1 mr-1"),
                    (T.textContent = "".concat(c, " Calories"));
                  var B = document.createElement("span");
                  (B.classList = "badge badge-secondary mb-1 mr-1"),
                    (B.textContent = "".concat(p, "g Carbs"));
                  var A = document.createElement("span");
                  (A.classList = "badge badge-secondary mb-1 mr-1"),
                    (A.textContent = "".concat(d, "g Total Fat"));
                  var D = document.createElement("span");
                  (D.classList = "badge badge-secondary mb-1 mr-1"),
                    (D.textContent = "".concat(l, "g Protein"));
                  var j = document.createElement("span");
                  (j.classList = "badge badge-secondary mb-1 mr-1"),
                    (j.textContent = "".concat(m, "mg Sodium"));
                  var P = document.createElement("div");
                  P.classList = "card-text d-flex flex-wrap";
                  var F = void 0;
                  if (e[t][a].diets)
                    for (var N = 0; N < e[t][a].diets.length; N++)
                      ((F = document.createElement("span")).classList =
                        "badge badge-light mb-1 mr-1"),
                        (F.textContent = e[t][a].diets[N]),
                        P.append(F);
                  C.append(T),
                    C.append(B),
                    C.append(A),
                    C.append(D),
                    C.append(j),
                    b.append(R),
                    L.append(b),
                    I.append(L),
                    I.append(k),
                    I.append(P),
                    I.append(C),
                    S.append(M),
                    y.append(S),
                    y.append(I),
                    this.searchRecipesContainer.append(y),
                    y.addEventListener(
                      "click",
                      this.modalHandler.bind(this, n, i, s, u, g, f, v)
                    );
                }
                (this.domManager.app.searchRecipesDownloadProgress.classList =
                  "recipe-progress-hidden mt-3"),
                  (this.domManager.app.searchRecipesDownloadText.classList =
                    "d-none");
                for (var O = 0; O < this.domManager.app.inputs.length; O++)
                  (this.domManager.app.inputs[O].disabled = !1),
                    this.domManager.app.inputs[O].classList.remove("no-click");
              },
            },
            {
              key: "displayFavoriteRecipes",
              value: function (e) {
                for (var t = 0; t < e.length; t++) {
                  var a = null;
                  a =
                    "image" in e[t]
                      ? (a = "".concat(
                          e[t].image.substring(0, e[t].image.length - 11),
                          "556x370.jpg"
                        ))
                      : "https://spoonacular.com/recipeImages/342447-3480x360.jpg";
                  var n = e[t].title,
                    i = e[t].readyInMinutes,
                    r = e[t].servings,
                    o = e[t].sourceUrl,
                    s = Math.round(e[t].nutrition.nutrients[0].amount),
                    c = Math.round(e[t].nutrition.nutrients[8].amount),
                    l = Math.round(e[t].nutrition.nutrients[1].amount),
                    d = Math.round(e[t].nutrition.nutrients[3].amount),
                    p = Math.round(e[t].nutrition.nutrients[7].amount),
                    m = e[t].id,
                    u = [];
                  if (e[t].analyzedInstructions.length)
                    for (
                      var g = 0;
                      g < e[t].analyzedInstructions[0].steps.length;
                      g++
                    )
                      u.push(e[t].analyzedInstructions[0].steps[g].step);
                  else u.push("Instructions are available on the Recipe Page.");
                  var h = e[t].nutrition.ingredients,
                    f = e[t].summary,
                    v = document.createElement("div");
                  (v.classList =
                    "favorite-recipe-card favorited card m-3 px-0 col-xs-12 col-sm-5 col-md-5 col-lg-3 col-xl-2"),
                    (v.id = m);
                  var y = document.createElement("div"),
                    S = document.createElement("a");
                  y.classList = "d-flex justify-content-center";
                  var b = document.createElement("img");
                  (y.classList =
                    "card-image-top d-flex justify-content-center mt-3"),
                    (b.src = a),
                    (b.alt = "Recipe Image"),
                    (b.classList = "m-0 p-0"),
                    (b.width = "240"),
                    (b.height = "180");
                  var M = document.createElement("span");
                  (M.id = "delete_container"),
                    (M.classList =
                      "badge badge-light m-1 p-1 border border-danger rounded");
                  var x = document.createElement("i");
                  (x.classList =
                    "far fa-trash-alt text-danger delete-icon fa-lg"),
                    M.append(x),
                    y.append(M),
                    M.addEventListener(
                      "click",
                      this.handleDeleteClick.bind(this, m, event)
                    );
                  var E = document.createElement("div");
                  E.classList = "card-body py-0 mb-2";
                  var I = document.createElement("div");
                  I.classList = "card-title mb-2";
                  var L = document.createElement("h5");
                  L.textContent = n;
                  var R = document.createElement("div");
                  R.classList = "card-text";
                  var k = document.createElement("span");
                  (k.classList = "badge badge-dark mr-1 mb-1"),
                    (k.textContent = "".concat(i, " Minutes"));
                  var _ = document.createElement("span");
                  (_.classList = "badge badge-dark mb-1"),
                    (_.textContent = "".concat(r, " Servings")),
                    R.append(k),
                    R.append(_);
                  var w = document.createElement("div");
                  w.classList = "card-text d-flex flex-wrap";
                  var C = document.createElement("span");
                  (C.classList = "badge badge-secondary mb-1 mr-1"),
                    (C.textContent = "".concat(s, " Calories"));
                  var T = document.createElement("span");
                  (T.classList = "badge badge-secondary mb-1 mr-1"),
                    (T.textContent = "".concat(d, "g Carbs"));
                  var B = document.createElement("span");
                  (B.classList = "badge badge-secondary mb-1 mr-1"),
                    (B.textContent = "".concat(l, "g Total Fat"));
                  var A = document.createElement("span");
                  (A.classList = "badge badge-secondary mb-1 mr-1"),
                    (A.textContent = "".concat(c, "g Protein"));
                  var D = document.createElement("span");
                  (D.classList = "badge badge-secondary mb-1 mr-1"),
                    (D.textContent = "".concat(p, "mg Sodium"));
                  var j = document.createElement("div");
                  if (
                    ((j.classList = "card=text d-flex flex-wrap"), e[t].diets)
                  )
                    for (var P = 0; P < e[t].diets.length; P++) {
                      var F = document.createElement("span");
                      (F.classList = "badge badge-light mb-1 mr-1"),
                        (F.textContent = e[t].diets[P]),
                        j.append(F);
                    }
                  w.append(C),
                    w.append(T),
                    w.append(B),
                    w.append(A),
                    w.append(D),
                    S.append(L),
                    I.append(S),
                    E.append(I),
                    E.append(R),
                    E.append(j),
                    E.append(w),
                    y.append(b),
                    v.append(y),
                    v.append(E),
                    this.favoriteRecipesContainer.append(v),
                    v.addEventListener(
                      "click",
                      this.modalHandler.bind(this, a, n, o, m, u, h, f)
                    );
                }
                this.domManager.app.favoriteRecipesSection.scrollHeight >
                this.domManager.app.favoriteRecipesSection.clientHeight
                  ? (this.domManager.app.favoriteRecipesSection.classList =
                      "favorite-recipes-visible d-flex flex-column justify-content-start")
                  : (this.domManager.app.favoriteRecipesSection.classList =
                      "favorite-recipes-visible d-flex flex-column justify-content-center"),
                  (this.domManager.app.favoriteRecipesStatusText.classList =
                    "text-center d-none"),
                  (this.domManager.app.favoriteRecipesDownloadProgress.classList =
                    "favorite-recipe-progress-hidden"),
                  (this.domManager.app.emptyFavoriteTextContainer.classList =
                    "d-none");
              },
            },
          ]) && R(e.prototype, t),
          Object.defineProperty(e, "prototype", { writable: !1 }),
          e
        );
        var e, t;
      })();
      function w(e) {
        return (
          (w =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                }),
          w(e)
        );
      }
      function C(e, t) {
        for (var a = 0; a < t.length; a++) {
          var n = t[a];
          (n.enumerable = n.enumerable || !1),
            (n.configurable = !0),
            "value" in n && (n.writable = !0),
            Object.defineProperty(e, T(n.key), n);
        }
      }
      function T(e) {
        var t = (function (e) {
          if ("object" != w(e) || !e) return e;
          var t = e[Symbol.toPrimitive];
          if (void 0 !== t) {
            var a = t.call(e, "string");
            if ("object" != w(a)) return a;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return String(e);
        })(e);
        return "symbol" == w(t) ? t : t + "";
      }
      var B = (function () {
        return (
          (e = function e(t, a, n, i, r, o) {
            !(function (e, t) {
              if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
              (this.favoriteRecipesContainer = r),
              (this.form = t),
              (this.domManager = i),
              (this.imageTitleHandler = a),
              (this.recipesHandler = n),
              (this.appStateManager = o),
              (this.dietInfo = this.dietInfo.bind(this)),
              (this.postImage = this.postImage.bind(this)),
              (this.handlePostImageSuccess =
                this.handlePostImageSuccess.bind(this)),
              (this.handlePostImageError =
                this.handlePostImageError.bind(this)),
              (this.imageRecognition = this.imageRecognition.bind(this)),
              (this.handleImageRecognitionSuccess =
                this.handleImageRecognitionSuccess.bind(this)),
              (this.handleImageRecognitionError =
                this.handleImageRecognitionError.bind(this)),
              (this.getRecipes = this.getRecipes.bind(this)),
              (this.handleGetRecipesSuccess =
                this.handleGetRecipesSuccess.bind(this)),
              (this.handleGetRecipesError =
                this.handleGetRecipesError.bind(this)),
              (this.getFavoriteRecipes = this.getFavoriteRecipes.bind(this)),
              (this.handleGetFavoriteRecipesSuccess =
                this.handleGetFavoriteRecipesSuccess.bind(this)),
              (this.handleGetFavoriteRecipesError =
                this.handleGetFavoriteRecipesError.bind(this)),
              (this.savedDietInfoCheck = this.savedDietInfoCheck.bind(this)),
              (this.localStorageCheck = this.localStorageCheck.bind(this)),
              (this.getRandomRecipes = this.getRandomRecipes.bind(this)),
              (this.handleGetRandomRecipesSuccess =
                this.handleGetRandomRecipesSuccess.bind(this));
          }),
          (t = [
            {
              key: "start",
              value: function () {
                this.localStorageCheck(),
                  this.savedDietInfoCheck(),
                  this.getRandomRecipes(),
                  this.form.clickDietInfo(this.dietInfo),
                  this.form.clickPostImage(this.postImage),
                  this.form.clickGetRecipes(this.getRecipes),
                  this.form.clickGetRandomRecipes(this.getRandomRecipes),
                  this.form.clickGetFavoriteRecipes(this.getFavoriteRecipes),
                  this.recipesHandler.clickGetFavoriteRecipes(
                    this.getFavoriteRecipes
                  );
              },
            },
            {
              key: "localStorageCheck",
              value: function () {
                localStorage.getItem("favoriteArray")
                  ? this.appStateManager.updateState(
                      "favoriteArray",
                      JSON.parse(localStorage.getItem("favoriteArray"))
                    )
                  : (this.appStateManager.updateState("favoriteArray", []),
                    localStorage.setItem(
                      "favoriteArray",
                      JSON.stringify(
                        this.appStateManager.getState("favoriteArray")
                      )
                    )),
                  localStorage.getItem("restrictionsString")
                    ? this.appStateManager.updateState(
                        "restrictionsString",
                        JSON.parse(localStorage.getItem("restrictionsString"))
                      )
                    : this.appStateManager.updateState(
                        "restrictionsString",
                        ""
                      ),
                  localStorage.getItem("intolerancesString")
                    ? this.appStateManager.updateState(
                        "intolerancesString",
                        JSON.parse(localStorage.getItem("intolerancesString"))
                      )
                    : this.appStateManager.updateState(
                        "intolerancesString",
                        ""
                      );
              },
            },
            {
              key: "savedDietInfoCheck",
              value: function () {
                if (
                  localStorage.getItem("restrictionsString") &&
                  localStorage.getItem("intolerancesString")
                ) {
                  for (
                    var e = JSON.parse(
                        localStorage.getItem("restrictionsString")
                      ).split(","),
                      t = JSON.parse(
                        localStorage.getItem("intolerancesString")
                      ).split(","),
                      a = 0;
                    a < this.domManager.app.restrictionsCheckboxes.length;
                    a++
                  )
                    e.includes(
                      this.domManager.app.restrictionsCheckboxes[a].id
                    ) &&
                      (this.domManager.app.restrictionsCheckboxes[a].checked =
                        !0);
                  for (
                    var n = 0;
                    n < this.domManager.app.intolerancesCheckboxes.length;
                    n++
                  )
                    t.includes(
                      this.domManager.app.intolerancesCheckboxes[n].id
                    ) &&
                      (this.domManager.app.intolerancesCheckboxes[n].checked =
                        !0);
                }
              },
            },
            {
              key: "dietInfo",
              value: function () {
                for (
                  var e = "", t = "", a = 0;
                  a < this.domManager.app.restrictionsCheckboxes.length;
                  a++
                )
                  this.domManager.app.restrictionsCheckboxes[a].checked &&
                    (e +=
                      this.domManager.app.restrictionsCheckboxes[a].value +
                      ", ");
                for (
                  var n = 0;
                  n < this.domManager.app.intolerancesCheckboxes.length;
                  n++
                )
                  this.domManager.app.intolerancesCheckboxes[n].checked &&
                    (t +=
                      this.domManager.app.intolerancesCheckboxes[n].value +
                      ", ");
                (this.domManager.app.spoonacularDataToSend.diet = e
                  .slice(0, -2)
                  .replace(/\s/g, "")),
                  this.appStateManager.updateState(
                    "restrictionsString",
                    this.domManager.app.spoonacularDataToSend.diet
                  ),
                  localStorage.setItem(
                    "restrictionsString",
                    JSON.stringify(
                      this.appStateManager.getState("restrictionsString")
                    )
                  ),
                  (this.domManager.app.spoonacularDataToSend.intolerances = t
                    .slice(0, -2)
                    .replace(/\s/g, "")),
                  this.appStateManager.updateState(
                    "intolerancesString",
                    this.domManager.app.spoonacularDataToSend.intolerances
                  ),
                  localStorage.setItem(
                    "intolerancesString",
                    JSON.stringify(
                      this.appStateManager.getState("intolerancesString")
                    )
                  );
              },
            },
            {
              key: "postImage",
              value: function (e, t) {
                $.ajax({
                  method: "POST",
                  url: "https://api.imgur.com/3/image/",
                  data: e,
                  processData: !1,
                  contentType: !1,
                  cache: !1,
                  headers: {
                    Authorization: "Bearer ".concat(
                      this.appStateManager.getState("imgurAccessToken")
                    ),
                  },
                  xhr: function () {
                    var e = new window.XMLHttpRequest();
                    return (
                      e.upload.addEventListener(
                        "progress",
                        function (e) {
                          if (e.lengthComputable) {
                            var a = e.loaded / e.total;
                            $("#percentage_bar_upload").css({
                              width: 100 * a + "%",
                            }),
                              a > 0 &&
                                a < 1 &&
                                $("#percentage_upload_container").removeClass(
                                  "d-none"
                                ),
                              1 === a &&
                                ($("#percentage_upload_container").addClass(
                                  "d-none"
                                ),
                                (t.app.imageProcessingContainer.classList =
                                  "d-flex col-12 flex-column align-items-center justify-content-center desktop-space-form"));
                          }
                        },
                        !1
                      ),
                      e
                    );
                  },
                  success: this.handlePostImageSuccess,
                  error: this.handlePostImageError,
                });
              },
            },
            {
              key: "handlePostImageSuccess",
              value: function (e) {
                var t = e.data.link;
                (this.domManager.app.dataForImageRecognition.requests[0].image.source.imageUri =
                  t),
                  this.imageTitleHandler.postedImageDownloadProgress(t),
                  this.imageRecognition();
              },
            },
            {
              key: "handlePostImageError",
              value: function (e) {
                console.log("error", e),
                  (this.domManager.app.imgurAPIError.classList =
                    "text-center mt-3");
                for (var t = 0; t < this.domManager.app.inputs.length; t++)
                  (this.domManager.app.inputs[t].disabled = !1),
                    this.domManager.app.inputs[t].classList.remove("no-click");
              },
            },
            {
              key: "imageRecognition",
              value: function () {
                (this.domManager.app.imageRecognitionStatusText.classList =
                  "text-center"),
                  $.ajax({
                    url: "https://vision.googleapis.com/v1/images:annotate?fields=responses&key=".concat(
                      this.appStateManager.getState("googleAPIKey")
                    ),
                    type: "POST",
                    dataType: "JSON",
                    contentType: "application/json",
                    data: JSON.stringify(
                      this.domManager.app.dataForImageRecognition
                    ),
                    success: this.handleImageRecognitionSuccess,
                    error: this.handleImageRecognitionError,
                  });
              },
            },
            {
              key: "handleImageRecognitionSuccess",
              value: function (e) {
                if (e.responses[0].labelAnnotations) {
                  var t = e.responses[0].labelAnnotations[0].description,
                    a = e.responses[0].labelAnnotations[0].score;
                  this.imageTitleHandler.imageTitleOnPage(t, a),
                    (this.domManager.app.imageRecognitionStatusText.classList =
                      "text-center d-none"),
                    this.getRecipes(t);
                } else {
                  (this.domManager.app.imageRecognitionStatusText.classList =
                    "d-none"),
                    (this.domManager.app.imageRecognitionFailedText.classList =
                      "text-center"),
                    (this.domManager.app.uploadedImage.src = "");
                  for (var n = 0; n < this.domManager.app.inputs.length; n++)
                    (this.domManager.app.inputs[n].disabled = !1),
                      this.domManager.app.inputs[n].classList.remove(
                        "no-click"
                      );
                }
              },
            },
            {
              key: "handleImageRecognitionError",
              value: function (e) {
                console.error(e);
              },
            },
            {
              key: "getRandomRecipes",
              value: function () {
                for (var e = 0; e < this.domManager.app.inputs.length; e++)
                  (this.domManager.app.inputs[e].disabled = !0),
                    this.domManager.app.inputs[e].classList.add("no-click");
                (this.domManager.app.searchRecipesDownloadProgress.classList =
                  "recipe-progress-visible text-left mt-3"),
                  (this.domManager.app.searchRecipesDownloadText.classList =
                    "text-center mt-3"),
                  (this.domManager.app.searchRecipesDownloadText.textContent =
                    "Gathering random recipes, please wait..."),
                  (this.domManager.app.titleContainer.classList =
                    "d-none desktop-space-form"),
                  (this.domManager.app.percentageBarContainer.classList =
                    "d-none desktop-space-form"),
                  (this.domManager.app.uploadedImageContainer.classList =
                    "d-none desktop-space-form"),
                  this.appStateManager.updateState("chunkedRecipeArray", []),
                  this.appStateManager.updateState(
                    "chunkedRecipeArrayIndex",
                    0
                  );
                var t =
                  "https://api.spoonacular.com/recipes/complexSearch?apiKey=".concat(
                    this.appStateManager.getState("spoonacularAPIKey"),
                    "&addRecipeNutrition=true&636x393&number=100&sort=random"
                  );
                $.ajax({
                  method: "GET",
                  url: t,
                  data: this.domManager.app.spoonacularDataToSend,
                  headers: { "Content-Type": "application/json" },
                  success: this.handleGetRandomRecipesSuccess,
                  error: this.handleGetRecipesError,
                });
              },
            },
            {
              key: "handleGetRandomRecipesSuccess",
              value: function (e) {
                this.recipesHandler.chunkRandomRecipes(e);
              },
            },
            {
              key: "getRecipes",
              value: function (e) {
                (this.domManager.app.searchRecipesDownloadProgress.classList =
                  "recipe-progress-visible text-left mt-3"),
                  (this.domManager.app.searchRecipesDownloadText.classList =
                    "text-center mt-3"),
                  (this.domManager.app.searchRecipesDownloadText.textContent =
                    "Gathering recipes, please wait..."),
                  this.appStateManager.updateState("chunkedRecipeArray", []),
                  this.appStateManager.updateState(
                    "chunkedRecipeArrayIndex",
                    0
                  );
                var t =
                  "https://api.spoonacular.com/recipes/complexSearch?query="
                    .concat(e, "&apiKey=")
                    .concat(
                      this.appStateManager.getState("spoonacularAPIKey"),
                      "&addRecipeNutrition=true&636x393&number=100"
                    );
                $.ajax({
                  method: "GET",
                  url: t,
                  data: this.domManager.app.spoonacularDataToSend,
                  headers: { "Content-Type": "application/json" },
                  error: this.handleGetRecipesError,
                  success: this.handleGetRecipesSuccess,
                  timeout: 1e4,
                });
              },
            },
            {
              key: "handleGetRecipesSuccess",
              value: function (e) {
                this.recipesHandler.chunkSearchedRecipes(e);
              },
            },
            {
              key: "handleGetRecipesError",
              value: function (e) {
                (this.domManager.app.searchRecipesDownloadContainer.classList =
                  "d-none"),
                  (this.domManager.app.searchRecipesDownloadProgress.classList =
                    "recipe-progress-hidden text-left mt-3"),
                  (this.domManager.app.searchRecipesDownloadText.classList =
                    "d-none"),
                  (this.domManager.app.spoonacularSearchError.classList =
                    "text-center mt-3");
                for (var t = 0; t < this.domManager.app.inputs.length; t++)
                  (this.domManager.app.inputs[t].disabled = !1),
                    this.domManager.app.inputs[t].classList.remove("no-click");
                402 !== e.status
                  ? "timeout" !== e.statusText
                    ? (this.domManager.app.spoonacularSearchError.innerHTML =
                        "There is a CORS issue with the Spoonacular's API.  This issue will usually resolve itself in ten minutes.  If it does not, please notify <a href = 'mailto:john@johnnguyencodes.com?subject=Snappy%20Recipes%20API%20Key%20Refresh'> john@johnnguyencodes.com</a >, thank you.")
                    : (this.domManager.app.spoonacularSearchError.innerHTML =
                        "The ajax request to the Spoonacular API has timed out, please try again.")
                  : (this.domManager.app.spoonacularSearchError.innerHTML =
                      "The Spoonacular API has reached its daily quota for this app's current API Key. Please notify <a href = 'mailto:john@johnnguyencodes.com?subject=Snappy%20Recipes%20API%20Key%20Refresh'> john@johnnguyencodes.com</a>, thank you.");
              },
            },
            {
              key: "getFavoriteRecipes",
              value: function () {
                for (; this.favoriteRecipesContainer.firstChild; )
                  this.favoriteRecipesContainer.removeChild(
                    this.favoriteRecipesContainer.firstChild
                  );
                if (
                  localStorage.getItem("favoriteArray") &&
                  "[]" !== localStorage.getItem("favoriteArray")
                ) {
                  (this.domManager.app.favoriteRecipesSection.classList =
                    "favorite-recipes-visible d-flex flex-column justify-content-center"),
                    (this.domManager.app.emptyFavoriteTextContainer.classList =
                      "d-none"),
                    (this.domManager.app.favoriteRecipesDownloadProgress.classList =
                      "favorite-recipe-progress-visible mt-3"),
                    (this.domManager.app.favoriteRecipesStatusText.classList =
                      "text-center"),
                    this.appStateManager.updateState(
                      "favoriteArray",
                      JSON.parse(localStorage.getItem("favoriteArray"))
                    );
                  var e = this.appStateManager
                      .getState("favoriteArray")
                      .join(","),
                    t =
                      "https://api.spoonacular.com/recipes/informationBulk?ids="
                        .concat(e, "&apiKey=")
                        .concat(
                          this.appStateManager.getState("spoonacularAPIKey"),
                          "&includeNutrition=true&size=636x393"
                        );
                  $.ajax({
                    method: "GET",
                    url: t,
                    headers: { "Content-Type": "application/json" },
                    timeout: 1e4,
                    error: this.handleGetFavoriteRecipesError,
                    success: this.handleGetFavoriteRecipesSuccess,
                  });
                } else
                  this.domManager.app.emptyFavoriteTextContainer.classList =
                    "d-flex justify-content-center";
              },
            },
            {
              key: "handleGetFavoriteRecipesSuccess",
              value: function (e) {
                this.recipesHandler.displayFavoriteRecipes(e);
              },
            },
            {
              key: "handleGetFavoriteRecipesError",
              value: function (e) {
                (this.domManager.app.favoriteRecipesDownloadProgress.classList =
                  "favorite-recipe-progress-hidden"),
                  (this.domManager.app.favoriteRecipesStatusText.classList =
                    "d-none"),
                  "error" === e.statusText &&
                    (this.domManager.app.spoonacularFavoriteError.classList =
                      "mt-3 text-center"),
                  "timeout" === e.statusText &&
                    (this.domManager.app.spoonacularFavoriteTimeoutError.classList =
                      "mt-3 text-center");
              },
            },
          ]) && C(e.prototype, t),
          Object.defineProperty(e, "prototype", { writable: !1 }),
          e
        );
        var e, t;
      })();
      document.addEventListener("DOMContentLoaded", function () {
        var e = new r(),
          t = new g(),
          a = new y(t, e),
          n = new x(t),
          i = document.getElementById("search_recipes_container"),
          o = document.getElementById("favorite_recipes_container"),
          s = new _(i, o, t, e);
        new B(a, n, s, t, o, e).start();
      });
    })();
})();
