import moment from 'moment';

class TimeUtils {
  convertFullTime(date) {
    return moment(date).format('MM-DD-YYYY HH:mm');
  }
}

export default new TimeUtils();