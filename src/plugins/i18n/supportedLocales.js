const supportedLocales = {
  "sr-Latn-RS": {
    flag: "rs",
    title: "Srpski",
  },
  "en-US": {
    flag: "us",
    title: "English",
  },
};

export function getSupportedLocales() {
  let annotatedLocales = [];

  for (const code of Object.keys(supportedLocales)) {
    annotatedLocales.push({
      code,
      title: supportedLocales[code].title,
      flag: supportedLocales[code].flag,
    });
  }

  return annotatedLocales;
}

export function supportedLocalesInclude(locale) {
  return Object.keys(supportedLocales).includes(locale);
}
