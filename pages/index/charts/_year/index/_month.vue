<template>
  <v-row>
    <v-col>
      <v-select v-model="selectedType" :items="types" filled></v-select>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text class="white">
          <client-only>
            <apexchart
              :type="selectedType"
              :options="mixedOptions"
              :series="series"
              width="100%"
              height="350px"
            />
          </client-only>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text class="white">
          <client-only>
            <apexchart
              :type="selectedType"
              :options="spendingOptions"
              :series="spendigs"
              width="100%"
              height="350px"
            />
          </client-only>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text class="white">
          <client-only>
            <apexchart
              :type="selectedType"
              :options="profitsOptions"
              :series="profits"
              width="100%"
              height="350px"
            />
          </client-only>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ggl from 'graphql-tag'
import { mapGetters } from 'vuex'
export default {
  components: {
    apexchart: () => import('vue-apexcharts'),
  },
  data() {
    return {
      types: ['bar', 'line', 'area'],
      selectedType: 'area',
      mixedOptions: {},
      spendingOptions: {},
      profitsOptions: {},
      options: {
        type: 'area',
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          type: 'datetime',
        },
        tooltip: {
          xaxis: {
            format: 'dd MM yyyy',
          },
        },
      },
      series: [],
      profits: [],
      spendigs: [],
    }
  },
  computed: mapGetters({
    month: 'dates/getMonth',
    year: 'dates/getYear',
  }),
  watch: {
    month() {
      this.fetchData()
    },
    year() {
      this.fetchData()
    },
  },
  created() {
    Object.assign(this.mixedOptions, this.options)
    this.mixedOptions.colors = ['green', 'red', 'white']

    Object.assign(this.spendingOptions, this.options)
    this.spendingOptions.colors = ['red']

    Object.assign(this.profitsOptions, this.options)
    this.profitsOptions.colors = ['green']
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.$apollo
        .query({
          query: ggl`
          query SummaryGroupedByDate ($year: Int, $month: Int) {
            SummaryGroupedByDate (year: $year, month: $month) {
              spending {
                date
                total
              }
              profits {
                date
                total
              }
            }
          }`,
          variables: {
            year: parseInt(this.year.value, 10),
            month: parseInt(this.month, 10),
          },
          fetchPolicy: 'no-cache',
        })
        .then((response) => {
          const { profits, spending } = response.data.SummaryGroupedByDate
          const profitsSeries = {
            name: 'Profits',
            data: profits
              .sort((a, b) => {
                return a.date > b.date ? 1 : -1
              })
              .map((p) => [p.date, p.total]),
          }

          this.series = []
          this.profits = []
          this.spendigs = []

          this.series.push(profitsSeries)
          this.profits.push(profitsSeries)
          const spendingSeries = {
            name: 'Spendings',
            data: spending
              .sort((a, b) => {
                return a.date > b.date ? 1 : -1
              })
              .map((s) => [s.date, s.total]),
          }
          this.series.push(spendingSeries)
          this.spendigs.push(spendingSeries)
        })
    },
  },
}
</script>
<style scoped>
* {
  color: black;
}
</style>
