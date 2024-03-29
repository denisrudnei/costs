<template>
  <v-row>
    <v-col md="8" cols="12">
      <v-row>
        <v-col cols="12" md="6">
          <v-menu v-model="startMenu" :close-on-content-click="false" max-width="290px">
            <template #activator="{ on }">
              <v-text-field filled label="Start" :value="getStart" v-on="on" />
            </template>
            <v-date-picker @change="updateDate($event, 'start')" />
          </v-menu>
        </v-col>
        <v-col cols="12" md="6">
          <v-menu v-model="endMenu" :close-on-content-click="false" max-width="290px">
            <template #activator="{ on }">
              <v-text-field filled label="End" :value="getEnd" v-on="on" />
            </template>
            <v-date-picker @change="updateDate($event, 'end')" />
          </v-menu>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title class="white--text">
              Forecasts
            </v-card-title>
            <v-card-text>
              <client-only>
                <apexchart
                  :type="chartOptions.type"
                  :series="series"
                  :options="chartOptions"
                  height="200"
                />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title class="white--text">
              Total
            </v-card-title>
            <v-card-text>
              <client-only>
                <apexchart
                  type="bar"
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
    <v-col md="4" cols="12">
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
      <v-row>
        <v-col cols="12">
          <v-btn block @click="remove('start')">
            Starts one year earlier
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn block @click="add('start')">
            Starts one year later
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn block @click="add('end')">
            Ends one year later
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn block @click="remove('end')">
            Ends one year earlier
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import {
  addMonths, addYears, format, parse, subYears,
} from 'date-fns';
import { mapGetters } from 'vuex';
import forecasts from '@/mixins/forecasts';
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
      start: new Date(),
      end: new Date(),
      startMenu: false,
      endMenu: false,
      search: '',
      selected: [],
      items: [],
      chartOptions: {
        type: 'line',
        palette: 'palette3',
        chart: {
          foreColor: '#fff',
          toolbar: {
            show: true,
          },
        },
        stroke: {
          width: 3,
          curve: 'smooth',
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
    getStart() {
      return format(this.start, 'dd/MM/yyyy');
    },
    getEnd() {
      return format(this.end, 'dd/MM/yyyy');
    },
  },
  created() {
    const fmt = (value) => dineroFormatter(value, this.currency, this.locale);
    this.chartOptions.yaxis = {
      labels: {
        formatter: fmt,
      },
    };
    this.chartOptions.dataLabels = {
      formatter: fmt,
    };
    this.end = addMonths(this.start, 12);
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
    add(type) {
      this[type] = addYears(this[type], 1);
      this.updateChart();
    },
    remove(type) {
      this[type] = subYears(this[type], 1);
      this.updateChart();
    },
    getName(item) {
      const months = this.getMonths(item.start.substr(0, 10), item.end.substr(0, 10));
      const total = item.value * months;
      return `${item.name} | Months: ${months} | Total: ${dineroFormatter(total, this.currency, this.locale)}`;
    },
    selectAll() {
      this.selected = this.items.map((item) => item.value);
      this.updateChart();
    },
    updateDate(value, type) {
      this[type] = parse(value, 'yyyy-MM-dd', new Date());
      this[`${type}Menu`] = false;
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
          start: this.start,
          end: this.end,
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

<style>
</style>
