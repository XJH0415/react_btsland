export default class MyUtil {
  static makeMarketKey(base, quote) {
    return (quote + ':' + base);
  }

  static TtimeToMyTime(time) {
    var dateTime = Date.parse(new Date(time));
    var newDate = new Date();
    newDate.setTime(dateTime);
    return newDate.format('MM-dd hh:mm');
  }

  static TtimeToMyTime2(time, format) {
    var dateTime = Date.parse(new Date(time));
    var newDate = new Date();
    newDate.setTime(dateTime);
    return newDate.format(format);
  }
}