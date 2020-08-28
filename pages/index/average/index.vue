<template>
  <v-row>
    <v-col cols="12">
      <v-card class="white">
        <client-only>
          <v-card-title>
            Spending
          </v-card-title>
          <v-card-text>
            <apexchart
              :options="options"
              :series="spendingSeries"
              :type="options.type"
              height="350px"
            />
          </v-card-text>
        </client-only>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card class="white">
        <v-card-title>
          Profits
        </v-card-title>
        <client-only>
          <v-card-text>
            <apexchart
              :options="options"
              :series="profitsSeries"
              :type="options.type"
              height="350px"
            />
          </v-card-text>
        </client-only>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { parse } from 'date-fns'
import ggl from 'graphql-tag'
export default {
  components: {
    apexchart: () => import('vue-apexcharts'),
  },
  data() {
    return {
      options: {
        type: 'bar',
        xaxis: {
          type: 'datetime',
        },
      },
      profitsSeries: [],
      spendingSeries: [],
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.$apollo
        .query({
          query: ggl`
            query {
              SummaryTotalByMonth {
                year
                month
                total
                type
              }
            }
          `,
        })
        .then((response) => {
          const summary = response.data.SummaryTotalByMonth
          const profits = summary
            .filter((value) => {
              return value.type === 'PROFIT'
            })
            .map((value) => [
              parse(`${value.year}-${value.month}-15`, 'yyyy-M-dd', new Date()),
              value.total,
            ])

          const spending = summary
            .filter((value) => {
              return value.type === 'SPENT'
            })
            .map((value) => [
              parse(`${value.year}-${value.month}-15`, 'yyyy-M-dd', new Date()),
              value.total,
            ])

          this.spendingSeries.push({
            name: 'Spending',
            data: spending,
          })

          this.profitsSeries.push({
            name: 'Profits',
            data: profits,
          })
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
