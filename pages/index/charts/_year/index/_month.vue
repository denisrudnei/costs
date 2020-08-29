<template>
  <v-row>
    <v-spacer />
    <v-col cols="12" md="4">
      <v-select
        v-model="selectedType"
        :items="types"
        filled
        label="Type"
      ></v-select>
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
import getDates from '@/mixins/getDates'
import summaryGroupedByDate from '@/graphql/query/summaryGroupedByDate'
import summaryDayByDay from '@/graphql/query/summaryDayByDay'
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
          curve: 'straight',
        },
        xaxis: {
          type: 'datetime',
        },
        plotOptions: {
          bar: {
            colors: {
              ranges: [
                {
                  from: 0,
                  to: Infinity,
                  color: '#008000',
                },
                {
                  from: -Infinity,
                  to: 0,
                  color: '#ff0000',
                },
              ],
            },
          },
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
      dayByDaySeries: [],
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
      this.mixedOptions.colors = ['#008000', '#ff0000', '#0b0b6c']

      Object.assign(this.spendingOptions, this.options)
      this.spendingOptions.colors = ['#ff0000']

      Object.assign(this.profitsOptions, this.options)
      this.profitsOptions.colors = ['#008000']
    },
    summaryDayByDay() {
      this.$apollo
        .query({
          query: summaryDayByDay,
          variables: {
            year: parseInt(this.year.value, 10),
            month: parseInt(this.month, 10),
          },
        })
        .then((response) => {
          const { SummaryDayByDay } = response.data

          const dayByDaySeries = {
            name: 'Total in this day',
            data: SummaryDayByDay.sort((a, b) => (a > b ? 1 : -1)).map(
              (value) => ({
                x: format(new Date(value.day), 'MM/dd/yyyy'),
                y: value.total,
              })
            ),
          }

          this.series = this.series.filter((serie) => {
            return serie.name !== dayByDaySeries.name
          })

          this.series.push(dayByDaySeries)
        })
    },
    fetchData() {
      this.$apollo
        .query({
          query: summaryGroupedByDate,
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
          this.summaryDayByDay()
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
