export const state = () => ({
  year: {},
  years: [],
  month: 0,
  months: [],
  useLastMonthBalance: false,
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
  getUseLastMonthBalance(state) {
    return state.useLastMonthBalance;
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
  setUseLastMonthBalance(state, useLastMonthBalance) {
    state.useLastMonthBalance = useLastMonthBalance;
  },
};
