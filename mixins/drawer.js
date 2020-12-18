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
    mini: {
      get() {
        return this.$store.getters['screen/getMini'];
      },
      set(value) {
        this.$store.commit('screen/setMini', value);
      },
    },
  },
};
