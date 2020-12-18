export const state = () => ({
  drawer: true,
  mini: false,
});

export const getters = {
  getDrawer(state) {
    return state.drawer;
  },
  getMini(state) {
    return state.mini;
  },
};

export const mutations = {
  setDrawer(state, drawer) {
    state.drawer = drawer;
  },
  setMini(state, mini) {
    state.mini = mini;
  },
};
