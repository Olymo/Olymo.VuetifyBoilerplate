import i18n from '../../plugins/i18n/i18n'

export default (engText, translatePath, alwaysTranslate = false) => {
  return (i18n.locale == 'en-US' && !alwaysTranslate)
    ? engText
    : i18n.t(`${translatePath}.${engText}`)
}
