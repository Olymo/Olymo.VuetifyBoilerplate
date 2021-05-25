import Vue from "vue";
import VueI18n from "vue-i18n";
import getBrowserLocale from "./getBrowserLocale";
import { supportedLocalesInclude } from "./supportedLocales";

/**
 * We are using recommended plugin for internationalization.
 * You can find official docs here https://kazupon.github.io/vue-i18n/
 */

Vue.use(VueI18n);

Vue.config.disableNoTranslationWarning = true;

const setDateTimeFormats = {
  short: {
    year: "numeric",
    month: "numeric",
    day: "2-digit",
  },
  medium: {
    year: "numeric",
    month: "numeric",
    day: "2-digit",
    hour: "2-digit",
    minute: "numeric",
  },
  long: {
    year: "numeric",
    month: "numeric",
    day: "2-digit",
    hour: "2-digit",
    minute: "numeric",
    second: "numeric",
  },
};

const dateTimeFormats = {
  "sr-Latn-RS": setDateTimeFormats,
  "en-US": setDateTimeFormats,
};

const loadedLanguages = [];

function loadLocaleMessageAync(locale) {
  if (loadedLanguages.length > 0 && i18n.locale === locale) {
    return Promise.resolve(locale);
  }

  if (loadedLanguages.includes(locale)) {
    i18n.locale = locale;

    return Promise.resolve(locale);
  }

  return import(
    /* webpackChunkName: "locale-[request]" */ `./localization-files/${locale}.json`
  ).then((messages) => {
    i18n.setLocaleMessage(locale, messages.default);
    loadedLanguages.push(locale);
    i18n.locale = locale;

    return Promise.resolve(locale);
  });
}

function getLocaleFromUserBrowser() {
  var browserLocale = getBrowserLocale();
  /**
   * Our backend system needs Serbian countryCode in next format.
   */
  if (browserLocale == "sr") {
    browserLocale = "sr-Latn-RS";
  }

  if (supportedLocalesInclude(browserLocale)) {
    return browserLocale;
  } else {
    return process.env.VUE_APP_I18N_LOCALE || "sr-Latn-RS";
  }
}

function getOverridedStartingLocale() {
  return window.localStorage.getItem("$VUE_VTS_PREFFERED_LANGUAGE");
}

function getStartingLocale() {
  var overridedLocale = getOverridedStartingLocale();

  if (overridedLocale != null) {
    return overridedLocale;
  } else {
    return getLocaleFromUserBrowser();
  }
}

const startingLocale = getStartingLocale();

const i18n = new VueI18n({
  locale: startingLocale,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "sr-Latn-RS",
  messages: {},
  dateTimeFormats: dateTimeFormats,
  silentTranslationWarn: true,
});

loadLocaleMessageAync(startingLocale);

export default i18n;
