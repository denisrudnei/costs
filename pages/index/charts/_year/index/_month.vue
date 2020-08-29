<template>
  <v-row>
    <v-col>
      <v-select v-model="selectedType" :items="types" filled></v-select>
    </v-col>
    <v-col cols="12">
      <v-card class="white">
        <v-card-title>
          Profts vs Spending
        </v-card-title>
        <v-card-text>
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
      <v-card class="white">
        <v-card-title>
          Spending
        </v-card-title>
        <v-card-text>
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
      <v-card class="white">
        <v-card-title>
          Profits
        </v-card-title>
        <v-card-text>
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
import getDates from '@/mixins/getDates'
import { format } from 'date-fns'
export default {
  components: {
    apexchart: () => import('vue-apexcharts'),
  },
  mixins: [getDates],
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
          curve: 'stepline',
        },
        xaxis: {
          type: 'category',
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
  watch: {
    month() {
      this.fetchData()
    },
    year() {
      this.fetchData()
    },
  },
  created() {
    this.updateOptions()
    this.fetchData()
  },
  methods: {
    updateOptions() {
      Object.assign(this.mixedOptions, this.options)
      this.mixedOptions.colors = ['green', 'red', 'white']

      Object.assign(this.spendingOptions, this.options)
      this.spendingOptions.colors = ['red']

      Object.assign(this.profitsOptions, this.options)
      this.profitsOptions.colors = ['green']
    },
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
        })
        .then((response) => {
          const { profits, spending } = response.data.SummaryGroupedByDate
          const profitsSeries = {
            name: 'Profits',
            data: profits
              .sort((a, b) => {
                return a.date > b.date ? 1 : -1
              })
              .map((p) => ({
                x: format(new Date(p.date), 'MM/dd/yyyy'),
                y: p.total,
              })),
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
              .map((s) => ({
                x: format(new Date(s.date), 'MM/dd/yyyy'),
                y: s.total,
              })),
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
