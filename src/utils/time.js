import moment from 'moment';

class TimeUtils {
  convertFullTime(date) {
    return moment(date).format('MM-DD-YYYY HH:mm');
  }

  convertDate(date) {
    return moment(date).format('DD/MM/YYYY');
  }
}

export default new TimeUtils();