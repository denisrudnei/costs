<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <client-only>
          <v-card-title class="white--text">
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
      <v-card>
        <v-card-title class="white--text">
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
import { parse } from 'date-fns';
import summaryTotalByMonth from '@/graphql/query/summaryTotalByMonth';
import { mapGetters } from 'vuex';
import { dineroFormatter } from '~/plugins/filters';

export default {
  components: {
    apexchart: () => import('vue-apexcharts'),
  },
  data() {
    return {
      options: {
        type: 'bar',
        chart: {
          foreColor: '#fff',
          toolbar: {
            show: true,
          },
        },
        xaxis: {
          type: 'datetime',
          axisTicks: {
            color: '#333',
          },
          axisBorder: {
            color: '#333',
          },
        },
        grid: {
          borderColor: '#40475D',
        },
        tooltip: {
          theme: 'dark',
          xaxis: {
            format: 'dd MM yyyy',
          },
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
      },
      profitsSeries: [],
      spendingSeries: [],
    };
  },
  computed: mapGetters({
    currency: 'settings/getCurrency',
    locale: 'settings/getLocale',
  }),
  mounted() {
    const fmt = (value) => dineroFormatter(value, this.currency, this.locale);
    this.options.yaxis = {
      labels: {
        formatter: fmt,
      },
    };
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.$apollo
        .query({
          query: summaryTotalByMonth,
          fetchPolicy: 'no-cache',
        })
        .then((response) => {
          const summary = response.data.SummaryTotalByMonth;
          const profits = summary
            .filter((value) => value.type === 'PROFIT')
            .map((value) => [
              parse(`${value.year}-${value.month}-15`, 'yyyy-M-dd', new Date()),
              value.total,
            ]);

          const spending = summary
            .filter((value) => value.type === 'SPENT')
            .map((value) => [
              parse(`${value.year}-${value.month}-15`, 'yyyy-M-dd', new Date()),
              value.total,
            ]);

          this.spendingSeries.push({
            name: 'Spending',
            data: spending,
          });

          this.profitsSeries.push({
            name: 'Profits',
            data: profits,
          });
        });
    },
  },
};
</script>

<style>
</style>
