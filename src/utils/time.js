import moment from 'moment';

class TimeUtils {
  convertFullTime(date) {
    return moment(date).format('MM-DD-YYYY HH:mm');
  }

  convertDate(date) {
    return moment(date).format('DD/MM/YYYY');
  }

  convertMonthYear(date) {
    return moment(date).format('MM/YYYY');
  }

  convertDay(date) {
    return moment(date).format('YYYY-MM-DD');
  }

  convertMonth(date) {
    return moment(date).format('YYYY-MM');
  }
}

export default new TimeUtils();