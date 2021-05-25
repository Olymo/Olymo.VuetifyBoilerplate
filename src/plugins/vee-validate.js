import Vue from "vue";
import { localize } from "vee-validate";
import sr from "./i18n/localization-files/sr-Latn-RS.json";
import en from "./i18n/localization-files/en-US-errors.json";
import * as rules from "vee-validate/dist/rules";
import { extend } from "vee-validate";
import { setInteractionMode } from "vee-validate";
import { ValidationProvider, ValidationObserver } from "vee-validate";

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

localize({
  en,
  sr,
});

setInteractionMode("eager");

localize("en");

let LOCALE = "en";

// A simple get/set interface to manage our locale in components.
// This is not reactive, so don't create any computed properties/watchers off it.
Object.defineProperty(Vue.prototype, "locale", {
  get() {
    return LOCALE;
  },
  set(val) {
    LOCALE = val;
    localize(val);
  },
});
