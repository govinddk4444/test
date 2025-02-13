var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { override } from "@microsoft/decorators";
import { Log } from "@microsoft/sp-core-library";
import { BaseApplicationCustomizer, PlaceholderName } from "@microsoft/sp-application-base";
import * as strings from "TopNavigationApplicationCustomizerStrings";
import styles from "./TopNavigation.module.scss";
import * as SPTermStore from "./services/SPTermStoreService";
import pnp from "@pnp/pnpjs";
import * as jQuery from "jquery";
var NAV_TERMS_KEY = "global-navigation-terms";
var LOG_SOURCE = "TopNavigationApplicationCustomizer";
/** A Custom Action which can be run during execution of a Client Side Application */
var TopNavigationApplicationCustomizer = /** @class */ (function (_super) {
    __extends(TopNavigationApplicationCustomizer, _super);
    function TopNavigationApplicationCustomizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TopNavigationApplicationCustomizer.prototype.onInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var termStoreService, cachedTerms, _a, menuString;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Log.info(LOG_SOURCE, "Initialized " + strings.Title);
                        // Added to handle possible changes on the existence of placeholders.
                        this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
                        // Configure caching
                        pnp.setup({
                            defaultCachingStore: "session",
                            defaultCachingTimeoutSeconds: 900,
                            globalCacheDisable: true // true to disable caching in case of debugging/testing
                        });
                        termStoreService = new SPTermStore.SPTermStoreService({
                            spHttpClient: this.context.spHttpClient,
                            siteAbsoluteUrl: this.context.pageContext.web.absoluteUrl
                        });
                        if (!(this.properties.TopMenuTermSet != null)) return [3 /*break*/, 4];
                        cachedTerms = pnp.storage.session.get(NAV_TERMS_KEY);
                        if (!(cachedTerms != null)) return [3 /*break*/, 1];
                        //Use cached terms
                        this._topMenuItems = cachedTerms;
                        return [3 /*break*/, 3];
                    case 1:
                        _a = this;
                        return [4 /*yield*/, termStoreService.getTermsFromTermSetAsync(this.properties.TopMenuTermSet, this.context.pageContext.web.language)];
                    case 2:
                        _a._topMenuItems = _b.sent();
                        //Store in cache
                        pnp.storage.session.put(NAV_TERMS_KEY, this._topMenuItems);
                        _b.label = 3;
                    case 3:
                        menuString = this.generateMegaMenuLevel(this._topMenuItems);
                        //Set HTML
                        jQuery("#menu ul").html(menuString);
                        _b.label = 4;
                    case 4:
                        // Call render method for generating the HTML elements.
                        this._renderPlaceHolders();
                        jQuery("#menu > ul > li:has( > ul)").addClass("" + styles.menuDropdownIcon);
                        //Checks if li has sub (ul) and adds class for toggle icon - just an UI
                        jQuery("#menu > ul > li > ul:not(:has(ul))").addClass("" + styles.normalSub);
                        //Checks if drodown menu's li elements have anothere level (ul), if not the dropdown is shown as regular dropdown, not a mega menu (thanks Luka Kladaric)
                        jQuery("#menu > ul").before("<a href=\"#\" class=\"" + styles.menuMobile + "\" id=\"menuMobile\">Navigation</a>");
                        //Adds menu-mobile class (for mobile toggle menu) before the normal menu
                        //Mobile menu is hidden if width is more then 959px, but normal menu is displayed
                        //Normal menu is hidden if width is below 959px, and jquery adds mobile menu
                        //Done this way so it can be used with wordpress without any trouble
                        //Make sure that menu is hidden when resizing the window to desktop
                        jQuery(window).resize(function () {
                            if (jQuery(window).width() > 943) {
                                jQuery("#menu > ul > li")
                                    .children("ul")
                                    .hide();
                            }
                        });
                        jQuery("#menu > ul > li").hover(function (e) {
                            if (jQuery(window).width() > 943) {
                                jQuery(this)
                                    .children("ul")
                                    .stop(true, false)
                                    .fadeToggle(150);
                                e.preventDefault();
                            }
                        });
                        //If width is more than 943px dropdowns are displayed on hover
                        jQuery("#menu > ul > li").click(function () {
                            if (jQuery(window).width() <= 943) {
                                jQuery(this)
                                    .children("ul")
                                    .fadeToggle(150);
                            }
                        });
                        //If width is less or equal to 943px dropdowns are displayed on click (thanks Aman Jain from stackoverflow)
                        //window.showOnMobileClass = `${styles.showOnMobile}`;
                        jQuery("#menuMobile").click(function (e) {
                            jQuery("#menu > ul").toggleClass("" + styles.showOnMobile);
                            e.preventDefault();
                        });
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    TopNavigationApplicationCustomizer.prototype._renderPlaceHolders = function () {
        console.log("TopNavigationApplicationCustomizer._renderPlaceHolders()");
        console.log("Available placeholders: ", this.context.placeholderProvider.placeholderNames
            .map(function (name) { return PlaceholderName[name]; })
            .join(", "));
        console.log(this.context.placeholderProvider);
        // Handling the top placeholder
        if (!this._topPlaceholder) {
            this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, { onDispose: this._onDispose });
            // The extension should not assume that the expected placeholder is available.
            if (!this._topPlaceholder) {
                console.error("The expected placeholder (Top) was not found.");
                return;
            }
            if (this.properties) {
                if (this._topPlaceholder.domElement) {
                    this._topPlaceholder.domElement.innerHTML = "\n                <div class=\"" + styles.app + "\">\n                  <div class=\"" + styles.menuContainer + "\">\n                    <div class=\"" + styles.menu + "\" id=\"menu\"><ul></ul></div>\n                  </div>\n                </div>";
                }
            }
        }
    };
    TopNavigationApplicationCustomizer.prototype._onDispose = function () {
        console.log("[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.");
    };
    TopNavigationApplicationCustomizer.prototype.generateMegaMenuLevel = function (levels) {
        var menuString = "";
        for (var i = 0; i < levels.length; i++) {
            var levelItem = levels[i];
            var url = typeof levelItem.localCustomProperties._Sys_Nav_SimpleLinkUrl ===
                "undefined"
                ? "#"
                : levelItem.localCustomProperties._Sys_Nav_SimpleLinkUrl;
            menuString +=
                '<li><a href="' + url + '">' + levelItem.name + "</a><i></i>";
            if (levelItem.terms.length != 0) {
                menuString += "<ul>";
                menuString += this.generateMegaMenuLevel(levelItem.terms);
                menuString += "</ul>";
            }
            menuString += "</li>";
        }
        return menuString;
    };
    __decorate([
        override
    ], TopNavigationApplicationCustomizer.prototype, "onInit", null);
    return TopNavigationApplicationCustomizer;
}(BaseApplicationCustomizer));
export default TopNavigationApplicationCustomizer;
//# sourceMappingURL=TopNavigationApplicationCustomizer.js.map