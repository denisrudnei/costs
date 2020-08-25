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
              :options="options"
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
              :options="options"
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
              :options="options"
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
import { parse, lastDayOfMonth, startOfMonth } from 'date-fns'
export default {
  components: {
    apexchart: () => import('vue-apexcharts'),
  },
  data() {
    return {
      types: ['bar', 'line', 'area'],
      selectedType: 'area',
      options: {
        type: 'area',
        stroke: {
          curve: 'smooth',
        },
        colors: ['green', 'red', 'white'],
        dataLabels: {
          style: {
            colors: ['green', 'red'],
          },
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
            .map((p) => [
              parse(p.date, 'yyyy-MM-dd', new Date()).getTime(),
              p.total,
            ])
            .sort((a, b) => {
              return a < b ? 1 : -1
            }),
        }
        this.series.push(profitsSeries)
        this.profits.push(profitsSeries)
        const spendingSeries = {
          name: 'Spendings',
          data: spending
            .map((s) => [
              parse(s.date, 'yyyy-MM-dd', new Date()).getTime(),
              s.total,
            ])
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
