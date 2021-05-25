import i18n from "../plugins/i18n/i18n";

/*
Helper za formatiranje datuma labela u fieldovima
Podesavanje je u src\plugins\i18n.js
Konfigurisani su sledeci formati :
long:15.5.2020. 00:00:00
medium:15.5.2020. 00:00
short:15.5.2020.

uct- parametar koji definise da li treba uct vreme transormisati u lokalno
*/

export default (date, type = "long", uct = false) => {
  if (uct) {
    //return format(date)
    const localTime = new Date(date);
    const diffHours = localTime.getTimezoneOffset() / -60;
    localTime.setHours(localTime.getHours() + diffHours);
    var d = i18n.d(localTime, type);
    return d;
  }
  const newDate = Date.parse(date);
  return i18n.d(newDate, type);
};
