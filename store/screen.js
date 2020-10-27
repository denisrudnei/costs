export const state = () => ({
  drawer: true,
});

export const getters = {
  getDrawer(state) {
    return state.drawer;
  },
};

export const mutations = {
  setDrawer(state, drawer) {
    state.drawer = drawer;
  },
};
