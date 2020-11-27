<template>
  <v-row>
    <v-col cols="8">
      <v-row>
        <v-col cols="12" md="12">
          <v-text-field v-model="forecast.name" placeholder="Name" filled />
        </v-col>
        <v-col cols="12" md="6">
          <v-menu v-model="menuStart" max-width="290px" :close-on-content-click="false">
            <v-date-picker :value="start" @input="updateStart" />
            <template #activator="{on}">
              <v-text-field placeholder="Start date" filled :value="startFormatted" v-on="on" />
            </template>
          </v-menu>
        </v-col>
        <v-col cols="12" md="6">
          <v-menu v-model="menuEnd" max-width="290px" :close-on-content-click="false">
            <v-date-picker :value="end" @input="updateEnd" />
            <template #activator="{ on }">
              <v-text-field placeholder="End date" filled :value="endFormatted" v-on="on" />
            </template>
          </v-menu>
        </v-col>
        <v-col cols="12" md="6">
          <v-select v-model="forecast.type" filled :items="types" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="forecast.value" placeholder="Value" filled type="number" />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="4">
      <v-card>
        <v-card-title>
          {{ forecast.name }}
        </v-card-title>
        <v-card-text>
          <p>Start: {{ start | date }}</p>
          <p>End: {{ end | date }}</p>
          <p>Value per month: {{ forecast.value | dinero }}</p>
          <p>Months: {{ months }}</p>
          <p>Total value: {{ value | dinero }}</p>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col>
      <v-btn @click="save">
        Save
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { parse, format } from 'date-fns';
import forecasts from '@/mixins/forecasts';
import { createForecast } from '../../graphql/mutation/createForecast';
import { GetForecast } from '../../graphql/query/getForecast';

export default {
  mixins: [forecasts],
  data() {
    return {
      menuStart: false,
      menuEnd: false,
      types: ['PROFIT', 'SPENT'],
      forecast: {
        name: '',
        start: new Date(),
        end: new Date(),
        value: 0,
        type: 'PROFIT',
      },
    };
  },
  computed: {
    start() {
      return this.forecast.start.toISOString().substr(0, 10);
    },
    end() {
      return this.forecast.end.toISOString().substr(0, 10);
    },
    startFormatted() {
      return format(this.forecast.start, 'dd/MM/yyyy');
    },
    endFormatted() {
      return format(this.forecast.end, 'dd/MM/yyyy');
    },
    months() {
      return this.getMonths(this.start, this.end);
    },
    value() {
      return this.forecast.value * this.months;
    },
  },
  methods: {
    updateStart(value) {
      this.forecast.start = parse(value, 'yyyy-MM-dd', new Date());
      this.menuStart = false;
    },
    updateEnd(value) {
      this.forecast.end = parse(value, 'yyyy-MM-dd', new Date());
      this.menuEnd = false;
    },
    save() {
      const { value, ...rest } = this.forecast;
      this.$apollo.mutate({
        mutation: createForecast,
        variables: {
          forecast: {
            ...rest,
            value: parseFloat(value),
          },
        },
        awaitRefetchQueries: true,
        refetchQueries: [{ query: GetForecast }],
      }).then(() => {
        this.$toast.show('Created', {
          duration: 1000,
        });
      });
    },
  },
};
</script>

<style>

</style>
