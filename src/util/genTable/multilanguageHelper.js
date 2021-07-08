import i18n from '@/plugins/i18n/i18n'
//Helper za prevodjenje labela u fieldovima
//Parametri
//1. Text na engleskom koji se prevodi
//2. Putanja u json fajlu koji sluzi za prevodjenje

export default (engText, translatePath, alwaysTranslate = false) => {
  return (i18n.locale == 'en-US' && !alwaysTranslate)
    ? engText
    : i18n.t(`${translatePath}.${engText}`)
}
