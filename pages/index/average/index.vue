<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <client-only>
          <v-card-text class="white">
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
      <v-card>
        <client-only>
          <v-card-text class="white">
            <apexchart
              :options="options"
              :series="profitsSeries"
              :type="options.type"
              height="350px"
            />
          </v-card-text>
        </client-only>
        <pre>{{ spendingSeries }}</pre>
        <pre>{{ profitsSeries }}</pre>
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
