import ggl from 'graphql-tag'

export default {
  data() {
    return {
      years: [],
    }
  },
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
        this.years = response.data.GetUsedDates.years.sort((a, b) =>
          a > b ? 1 : -1
        )
      })
  },
  methods: {
    updateMonths() {
      this.$store.commit(
        'dates/setMonths',
        this.year.months.sort((a, b) => (a > b ? 1 : -1))
      )
    },
  },
}
