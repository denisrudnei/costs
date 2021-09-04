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
              :options="spendingOptions"
              :series="spendingSeries"
              :type="spendingOptions.type"
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
              :options="profitsOptions"
              :series="profitsSeries"
              :type="profitsOptions.type"
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
import { mapGetters } from 'vuex';
import summaryTotalByMonth from '@/graphql/query/summaryTotalByMonth';
import { dineroFormatter } from '~/plugins/filters';

export default {
  components: {
    apexchart: () => import('vue-apexcharts'),
  },
  data() {
    return {
      spendingOptions: {
        type: 'area',
        chart: {
          foreColor: '#fff',
          toolbar: {
            show: true,
          },
        },
        xaxis: {
          type: 'datetime',
        },
        colors: ['#ff0000', '#ff0000', '#fff'],
        grid: {
          borderColor: '#40475D',
        },
        tooltip: {
          theme: 'dark',
          xaxis: {
            format: 'dd MM yyyy',
          },
        },
      },
      profitsOptions: {
        type: 'area',
        chart: {
          foreColor: '#fff',
          toolbar: {
            show: true,
          },
        },
        xaxis: {
          type: 'datetime',
        },
        colors: ['#008000'],
        grid: {
          borderColor: '#40475D',
        },
        tooltip: {
          theme: 'dark',
          xaxis: {
            format: 'dd MM yyyy',
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
    this.updateOptions(['spendingOptions', 'profitsOptions']);
    this.fetchData();
  },
  methods: {
    updateOptions(options) {
      const fmt = (value) => dineroFormatter(value, this.currency, this.locale);
      options.forEach((option) => {
        this[option].yaxis = {
          labels: {
            formatter: fmt,
          },
        };
        this[option].dataLabels = {
          position: 'bottom',
          horizontal: false,
          formatter: fmt,
        };
      });
    },
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
