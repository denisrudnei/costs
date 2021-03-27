import { set } from 'date-fns';

export const state = () => ({
  day: set(new Date(), {
    hours: 0,
    minutes: 0,
    seconds: 0,
  }),
});

export const getters = {
  getDay(state) {
    return state.day;
  },
};

export const mutations = {
  setDay(state, day) {
    state.day = day;
  },
};
