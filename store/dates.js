export const state = () => ({
  year: {},
  years: [],
  month: 0,
  months: [],
});

export const getters = {
  getYear(state) {
    return state.year;
  },
  getMonth(state) {
    return state.month;
  },
  getMonths(state) {
    return state.months;
  },
  getDates(state) {
    return state.years;
  },
};

export const mutations = {
  setYear(state, year) {
    state.year = year;
  },
  setMonth(state, month) {
    state.month = month;
  },
  setMonths(state, months) {
    state.months = months;
  },
  setYears(state, years) {
    state.years = years;
  },
};
