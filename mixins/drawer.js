export default {
  computed: {
    drawer: {
      get() {
        return this.$store.getters['screen/getDrawer'];
      },
      set(value) {
        this.$store.commit('screen/setDrawer', value);
      },
    },
  },
};
