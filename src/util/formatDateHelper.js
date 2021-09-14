import i18n from "../plugins/i18n/i18n";

export default (date, type = "long", uct = false) => {
  if (uct) {    
    const localTime = new Date(date);
    const diffHours = localTime.getTimezoneOffset() / -60;
    localTime.setHours(localTime.getHours() + diffHours);
    var d = i18n.d(localTime, type);
    return d;
  }
  const newDate = Date.parse(date);
  return i18n.d(newDate, type);
};
