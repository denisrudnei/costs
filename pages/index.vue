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
              height="250px"
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
              height="250px"
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
              height="250px"
            />
          </client-only>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ggl from 'graphql-tag'
import { lastDayOfMonth, startOfMonth } from 'date-fns'
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
      },
      tooltip: {
        xaxis: {
          format: 'dd MMM yyyy',
          min: startOfMonth(new Date()).getTime(),
          max: lastDayOfMonth(new Date()).getTime(),
        },
      },
      series: [],
      profits: [],
      spendigs: [],
    }
  },
  created() {
    Object.assign(this.mixedOptions, this.options)
    this.mixedOptions.colors = ['green', 'red', 'white']

    Object.assign(this.spendingOptions, this.options)
    this.spendingOptions.colors = ['red']

    Object.assign(this.profitsOptions, this.options)
    this.profitsOptions.colors = ['green']

    this.$apollo
      .query({
        query: ggl`
          query {
            SummaryGroupedByDate {
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
      })
      .then((response) => {
        const { profits, spending } = response.data.SummaryGroupedByDate
        const profitsSeries = {
          name: 'Profits',
          data: profits
            .map((p) => [p.date, p.total])
            .sort((a, b) => {
              return a < b ? 1 : -1
            }),
        }
        this.series.push(profitsSeries)
        this.profits.push(profitsSeries)
        const spendingSeries = {
          name: 'Spendings',
          data: spending
            .map((s) => [s.date, s.total])
            .sort((a, b) => {
              return a < b ? 1 : -1
            }),
        }
        this.series.push(spendingSeries)
        this.spendigs.push(spendingSeries)
      })
  },
}
</script>
<style scoped>
* {
  color: black;
}
</style>
