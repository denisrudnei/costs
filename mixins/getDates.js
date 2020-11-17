import { mapGetters } from 'vuex';
import getUsedDates from '~/graphql/query/getUsedDates';

export default {
  computed: mapGetters({
    years: 'dates/getDates',
    year: 'dates/getYear',
    month: 'dates/getMonth',
    months: 'dates/getMonths',
  }),
  watch: {
    $route(value) {
      const { year, month } = value.params;
      if (month) this.$store.commit('dates/setMonth', parseInt(month, 10));
      if (this.years.length > 0 && year) {
        this.$store.commit(
          'dates/setYear',
          this.years.find((item) => item.value === parseInt(year, 10)),
        );
      }
    },
  },
  created() {
    this.$apollo
      .query({
        query: getUsedDates,
        fetchPolicy: 'no-cache',
      })
      .then((response) => {
        const years = response.data.GetUsedDates.years.sort((a, b) => (a > b ? 1 : -1));
        this.$store.commit('dates/setYears', years);
        if (years.length > 0) this.$store.commit('dates/setYear', years[0]);
        if (this.year && this.year.months.length > 0) {
          this.$store.commit(
            'dates/setMonths',
            this.year.months.sort((a, b) => (a > b ? 1 : -1)),
          );
          const month = this.year.months.find(
            (month) => month === this.month,
          ) || this.year.months[0];
          this.$store.commit('dates/setMonth', month);
        }
      });
  },
  methods: {
    updateMonths() {
      const months = this.year.months.sort((a, b) => (a > b ? 1 : -1));
      this.$store.commit('dates/setMonths', months);
    },
  },
};
