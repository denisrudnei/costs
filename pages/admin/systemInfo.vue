<template>
  <v-row>
    <v-col cols="12" md="8">
      <v-card height="300">
        <v-card-title>
          Average CPU
          <v-spacer />
          <template v-if="info.cpus">
            {{ average }} Mhz
          </template>
        </v-card-title>
        <v-card-text>
          <no-ssr>
            <apexcharts
              ref="chart"
              height="200"
              :type="chartOptions.type"
              :options="chartOptions"
              :series="series"
            />
          </no-ssr>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card height="300">
        <v-card-title>
          Used memory
        </v-card-title>
        <v-card-text>
          <no-ssr>
            <apexcharts
              :options="chartMemory"
              :type="chartMemory.type"
              :series="memorySeries"
              height="250"
            />
          </no-ssr>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { GetEverySecond } from '../../graphql/subscriptions/GetEverySecond';
import { StartGetInfo } from '../../graphql/query/startGetInfo';

export default {
  components: {
    apexcharts: () => import('vue-apexcharts'),
  },
  data() {
    return {
      info: {},
      average: 0,
      chartOptions: {
        type: 'line',
        palette: 'palette3',
        chart: {
          foreColor: '#fff',
          toolbar: {
            show: true,
          },
        },
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000,
          },
        },
        stroke: {
          width: 3,
          curve: 'smooth',
        },
        yaxis: {
          min: 0,
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
        },
      },
      chartMemory: {
        type: 'radialBar',
        palette: 'palette3',
        chart: {
          foreColor: '#fff',
          toolbar: {
            show: true,
          },
        },
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000,
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
        labels: ['Memory'],
        tooltip: {
          theme: 'dark',
        },
      },
      memorySeries: [],
      series: [],
    };
  },
  created() {
    this.$apollo.query({
      query: StartGetInfo,
    }).then((response) => {
      this.info = response.data.StartGetInfo;
    });
  },
  apollo: {
    $subscribe: {
      getEverySecond: {
        query: GetEverySecond,
        result({ data }) {
          const value = data.GetEverySecond;

          this.memorySeries = [parseInt((value.freeMemory / value.totalMemory) * 100, 10)];

          const { model } = value.cpus[0];
          const speed = value.cpus
            .map((cpu) => cpu.speed)
            .reduce((acc, value) => acc + value, 0);

          const average = parseInt(speed / value.cpus.length, 10);
          this.average = average;

          const item = this.series.find((item) => item.name === model);
          const serieData = {
            x: new Date(),
            y: average,
          };
          if (!item) {
            this.series.push({
              name: model,
              data: [serieData],
            });
          } else {
            if (item.data.length >= 10) item.data.shift();

            item.data.push(serieData);

            this.series = [
              ...this.series.filter((item) => item.name !== model),
              item,
            ];
          }
        },
      },
    },
  },

};
</script>

<style>

</style>
