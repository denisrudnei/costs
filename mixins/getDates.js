import ggl from 'graphql-tag'
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    years: 'dates/getDates',
    year: 'dates/getYear',
    month: 'dates/getMonth',
    months: 'dates/getMonths',
  }),
  created() {
    this.$apollo
      .query({
        query: ggl`
          query {
            GetUsedDates {
              years {
                value
                months
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .then((response) => {
        const years = response.data.GetUsedDates.years.sort((a, b) =>
          a > b ? 1 : -1
        )
        this.$store.commit('dates/setYears', years)
        if (years.length > 0) this.$store.commit('dates/setYear', years[0])
        if (this.year && this.year.months.length > 0) {
          this.$store.commit('dates/setMonths', this.year.months)
          this.$store.commit('dates/setMonth', this.year.months[0])
        }
      })
  },
  methods: {
    updateMonths() {
      const months = this.year.months.sort((a, b) => (a > b ? 1 : -1))
      this.$store.commit('dates/setMonths', months)
    },
  },
}
