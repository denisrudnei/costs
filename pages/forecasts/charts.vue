<template>
  <v-row>
    <v-col cols="8">
      <v-row>
        <v-col cols="12">
          <v-card class="white black--text">
            <v-card-title>
              Forecasts
            </v-card-title>
            <v-card-text>
              <client-only>
                <apexchart type="area" :series="series" :options="chartOptions" height="200" />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card class="white black--text">
            <v-card-title>
              Total
            </v-card-title>
            <v-card-text>
              <client-only>
                <apexchart
                  type="area"
                  :series="seriesTotal"
                  :options="chartOptions"
                  height="200"
                />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="4">
      <v-card>
        <v-card-title>
          <v-text-field v-model="search" filled placeholder="Seach" />
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="selected"
            :items="searchResult"
            multiple
            filled
            @change="updateChart"
          />
          <v-btn block @click="selectAll">
            Select all
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import forecasts from '@/mixins/forecasts';
import { format, parse } from 'date-fns';
import { mapGetters } from 'vuex';
import { GetForecast } from '../../graphql/query/getForecast';
import { ForecastsInMonths } from '../../graphql/query/forecastsInMonths';
import { TotalForecastInMonths } from '../../graphql/query/totalForecastInMonths';
import { dineroFormatter } from '~/plugins/filters';

export default {
  components: {
    apexchart: () => import('vue-apexcharts'),
  },
  mixins: [forecasts],
  data() {
    return {
      search: '',
      selected: [],
      items: [],
      chartOptions: {
        type: 'line',
        stroke: {
          curve: 'stepline',
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
      seriesTotal: [],
    };
  },
  computed: {
    ...mapGetters({
      currency: 'settings/getCurrency',
      locale: 'settings/getLocale',
    }),
    searchResult() {
      return this.items
        .filter((item) => item.text.toLowerCase().includes(this.search.toLowerCase()));
    },
  },
  created() {
    const fmt = (value) => dineroFormatter(value, this.currency, this.locale);
    this.chartOptions.yaxis = {
      labels: {
        formatter: fmt,
      },
    };
    this.$apollo.query({
      query: GetForecast,
    }).then((response) => {
      this.items = response.data.GetForecast.map((item) => ({
        text: this.getName(item),
        value: item.id,
      }));
    });
  },
  methods: {
    getName(item) {
      const months = this.getMonths(item.start.substr(0, 10), item.end.substr(0, 10));
      const total = item.value * months;
      return `${item.name} | Months: ${months} | Total: ${total}`;
    },
    selectAll() {
      this.selected = this.items.map((item) => item.value);
      this.updateChart();
    },
    updateChart() {
      this.$apollo.query({
        query: ForecastsInMonths,
        variables: {
          ids: this.selected,
        },
      }).then((response) => {
        this.series = [];
        response.data.ForecastsInMonths.forEach((item) => {
          this.series.push({
            name: item.name,
            data: item.values.map((value) => ({
              x: parse(value.date.substr(0, 10), 'yyyy-MM-dd', new Date()).getTime(),
              y: value.value.toFixed(2),
            })),
          });
        });
      });
      this.$apollo.query({
        query: TotalForecastInMonths,
        variables: {
          ids: this.selected,
        },
      }).then((response) => {
        this.seriesTotal = [];
        const items = response.data.TotalForecastInMonths;
        this.seriesTotal.push({
          name: 'Difference',
          data: items.map((item) => ({
            x: format(parse(item.date.substr(0, 10), 'yyyy-MM-dd', new Date()), 'MM/dd/yyyy'),
            y: item.total.toFixed(2),
          })),
        });
      });
    },
  },
};
</script>

<style scoped>
* {
  color: black;
}
</style>
