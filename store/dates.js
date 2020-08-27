export const state = () => ({
  year: {},
  month: 0,
  months: [],
})

export const getters = {
  getYear(state) {
    return state.year
  },
  getMonth(state) {
    return state.month
  },
  getMonths(state) {
    return state.months
  },
}

export const mutations = {
  setYear(state, year) {
    state.year = year
  },
  setMonth(state, month) {
    state.month = month
  },
  setMonths(state, months) {
    state.months = months
  },
}
