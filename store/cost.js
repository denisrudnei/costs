export const state = () => ({
  search: '',
  order: 'DESC',
  type: 'DATE',
  asc: false,
  page: 1,
  limit: 10,
});

export const getters = {
  getSearch(state) {
    return state.search;
  },
  getOrder(state) {
    return state.order;
  },
  getType(state) {
    return state.type;
  },
  getAsc(state) {
    return state.asc;
  },
  getPage(state) {
    return state.page;
  },
  getLimit(state) {
    return state.limit;
  },
  getPagination(state) {
    const {
      search, order, type, page, limit,
    } = state;
    return {
      search,
      order,
      type,
      page,
      limit,
    };
  },
};

export const mutations = {
  setSearch(state, search) {
    state.search = search;
  },
  setAsc(state, asc) {
    state.asc = asc;
  },
  setOrder(state, order) {
    state.order = order;
  },
  setType(state, type) {
    state.type = type;
  },
  setPage(state, page) {
    state.page = page;
  },
  setLimit(state, limit) {
    state.limit = limit;
  },
  setPagination(state, pagination) {
    Object.keys(pagination).forEach((item) => {
      state[item] = pagination[item];
    });
  },
};
