import { Toast } from 'native-base';

export default (title, status, placement, duration = 3000) => {
  Toast.show({
    title,
    placement,
    status,
    duration,
  });
};
