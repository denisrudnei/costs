<template>
  <v-row>
    <v-spacer />
    <v-col cols="12" md="2">
      <v-checkbox
        v-model="useLastMonthBalance"
        label="Use last month balance"
        @change="getSums"
      />
    </v-col>
    <v-col cols="12" md="2">
      <v-subheader>Chart height: {{ height }}</v-subheader>
      <v-slider
        v-model.number="height"
        min="200"
        max="600"
        step="50"
        append-icon="mdi-plus-box"
        prepend-icon="mdi-minus-box"
        readonly
        @click:prepend="height -= 50"
        @click:append="height += 50"
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-select v-model="selectedType" :items="types" filled label="Type" />
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="4">
          <v-card :height="height + 75">
            <v-card-title class="white--text">
              Spending / Profits
            </v-card-title>
            <v-card-text>
              <client-only>
                <apexchart
                  :type="pieOptions.type"
                  :options="pieOptions"
                  :series="pieSeries"
                  width="100%"
                  :height="height"
                />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="8">
          <v-card :height="height + 75">
            <v-card-title class="white--text">
              Profts vs Spending
            </v-card-title>
            <v-card-text>
              <client-only>
                <apexchart
                  :type="selectedType"
                  :options="mixedOptions"
                  :series="series"
                  width="100%"
                  :height="height"
                />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card :height="height + 75">
            <v-card-title class="white--text">
              Total in this day
            </v-card-title>
            <v-card-text>
              <client-only>
                <apexchart
                  :type="selectedType"
                  :options="mixedOptions"
                  :series="dayByDaySeries"
                  width="100%"
                  :height="height"
                />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card :height="height + 75">
            <v-card-title class="white--text">
              Spending
            </v-card-title>
            <v-card-text>
              <client-only>
                <apexchart
                  :type="selectedType"
                  :options="spendingOptions"
                  :series="spendigs"
                  width="100%"
                  :height="height"
                />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title class="white--text">
              Profits
            </v-card-title>
            <v-card-text>
              <client-only>
                <apexchart
                  :type="selectedType"
                  :options="profitsOptions"
                  :series="profits"
                  width="100%"
                  :height="height"
                />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import getDates from '@/mixins/getDates';
import summaryGroupedByDate from '@/graphql/query/summaryGroupedByDate';
import summaryDayByDay from '@/graphql/query/summaryDayByDay';
import { format } from 'date-fns';
import basicSummary from '@/graphql/query/basicSummary';
import { dineroFormatter } from '~/plugins/filters';

export default {
  components: {
    apexchart: () => import('vue-apexcharts'),
  },
  mixins: [getDates],
  data() {
    return {
      useLastMonthBalance: false,
      types: ['bar', 'line', 'area'],
      selectedType: 'area',
      mixedOptions: {
        stroke: {
          curve: 'straight',
          width: 3,
        },
        colors: ['#008000', '#ff0000', '#0b0b6c'],
      },
      height: 200,
      spendingOptions: {
        colors: ['#ff0000'],
        stroke: {
          curve: 'straight',
        },
        tooltip: {
          theme: 'dark',
        },
      },
      profitsOptions: {
        colors: ['#008000'],
        stroke: {
          curve: 'straight',
        },
        tooltip: {
          theme: 'dark',
        },
      },
      pieOptions: {
        type: 'pie',
        colors: ['#ff0000', '#008000'],
        labels: ['Spent', 'Profit'],
      },
      options: {
        type: 'area',
        stroke: {
          curve: 'straight',
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
        chart: {
          foreColor: '#fff',
        },
        grid: {
          borderColor: '#40475D',
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
          theme: 'dark',
          xaxis: {
            format: 'dd MM yyyy',
          },
        },
      },
      series: [],
      profits: [],
      spendigs: [],
      pieSeries: [],
      dayByDaySeries: [],
    };
  },
  computed: mapGetters({
    currency: 'settings/getCurrency',
    locale: 'settings/getLocale',
  }),
  watch: {
    month() {
      this.fetchData();
    },
    year() {
      this.fetchData();
    },
  },
  created() {
    this.updateOptions();
    this.fetchData();
  },
  methods: {
    updateOptions() {
      const fmt = (value) => dineroFormatter(value, this.currency, this.locale);

      this.options.yaxis = {
        labels: { formatter: fmt },
      };

      this.options.dataLabels = {
        formatter: fmt,
      };

      Object.assign(this.mixedOptions, this.options);

      Object.assign(this.spendingOptions, this.options);

      Object.assign(this.profitsOptions, this.options);
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
          const { SummaryDayByDay } = response.data;
          this.dayByDaySeries = [];

          const dayByDaySeries = {
            name: 'Total in this day',
            data: SummaryDayByDay.sort((a, b) => (a > b ? 1 : -1)).map(
              (value) => ({
                x: format(new Date(value.day), 'MM/dd/yyyy'),
                y: value.total,
              }),
            ),
          };

          this.series = this.series.filter((serie) => serie.name !== dayByDaySeries.name);

          this.series.push(dayByDaySeries);
          this.dayByDaySeries.push(dayByDaySeries);
        });
    },
    getSums() {
      this.$apollo
        .query({
          query: basicSummary,
          fetchPolicy: 'no-cache',
          variables: {
            useLastMonthBalance: this.useLastMonthBalance,
            year: this.year ? parseInt(this.year.value, 10) : null,
            month: this.month ? this.month : null,
          },
        })
        .then((response) => {
          const { lastMonthBalance } = response.data.BasicSummary;

          this.pieSeries = [];
          const sumProfits = response.data.BasicSummary.profits.sum;
          const absSumSpending = Math.abs(
            response.data.BasicSummary.spending.sum,
          );
          if (lastMonthBalance) {
            const { value } = lastMonthBalance;

            if (value < 0) {
              this.pieSeries.push(
                Math.abs(absSumSpending) + Math.abs(lastMonthBalance.value),
              );
              this.pieSeries.push(sumProfits);
            } else {
              this.pieSeries.push(Math.abs(absSumSpending));
              this.pieSeries.push(sumProfits + lastMonthBalance.value);
            }
          } else {
            this.pieSeries.push(Math.abs(absSumSpending));
            this.pieSeries.push(sumProfits);
          }
        });
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
          const { profits, spending } = response.data.SummaryGroupedByDate;
          const profitsSeries = {
            name: 'Profits',
            data: profits
              .sort((a, b) => (a.date > b.date ? 1 : -1))
              .map((p) => ({
                x: format(new Date(p.date), 'MM/dd/yyyy'),
                y: p.total,
              })),
          };

          this.series = [];
          this.profits = [];
          this.spendigs = [];

          this.series.push(profitsSeries);
          this.profits.push(profitsSeries);
          const spendingSeries = {
            name: 'Spending',
            data: spending
              .sort((a, b) => (a.date > b.date ? 1 : -1))
              .map((s) => ({
                x: format(new Date(s.date), 'MM/dd/yyyy'),
                y: s.total,
              })),
          };
          this.series.push(spendingSeries);
          this.spendigs.push(spendingSeries);
          this.summaryDayByDay();
          this.getSums();
        });
    },
  },
};
</script>
<style>
</style>
