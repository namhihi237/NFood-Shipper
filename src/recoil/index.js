import { atom, selector } from 'recoil';

export const locationGPS = atom({
  key: 'location',
  default: {
    latitude: null,
    longitude: null,
  },
});
