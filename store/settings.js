export const state = () => ({
  currency: '',
  locale: '',
})

export const getters = {
  getCurrency(state) {
    return state.currency
  },
  getLocale(state) {
    return state.locale
  },
}

export const mutations = {
  setCurrency(state, currency) {
    state.currency = currency
  },
  setLocale(state, locale) {
    state.locale = locale
  },
}
