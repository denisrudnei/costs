<template>
  <v-row>
    <v-col cols="12" md="8">
      <v-data-table :items="items" :headers="headers">
        <template #item.date="{ item }">
          {{ item.date.substr(0, 10) | date }}
        </template>
        <template #item.value="{ item }">
          {{ item.value | dinero }}
        </template>
      </v-data-table>
    </v-col>
    <v-col cols="12" md="4">
      <v-card v-if="forecast">
        <v-card-title>
          {{ forecast.name }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <p>Start: {{ forecast.start | date }}</p>
              <p>End: {{ forecast.end | date }}</p>
              <p>Value per month: {{ forecast.value | dinero }}</p>
              <p>Months: {{ forecast.values.length }}</p>
              <p>Total value: {{ forecast.total | dinero }}</p>
            </v-col>
            <v-col v-if="forecast.indeterminate" cols="12">
              <v-text-field v-model="months" label="Number of months" type="number" filled />
              <v-btn @click="getInfo">
                Update
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ForecastsInMonths } from '@/graphql/query/forecastsInMonths';

export default {
  data() {
    return {
      items: [],
      id: undefined,
      months: undefined,
      forecast: undefined,
      headers: [
        {
          text: 'Date',
          value: 'date',
        },
        {
          text: 'Total',
          value: 'value',
        },
      ],
    };
  },
  created() {
    const { id } = this.$route.params;
    this.id = id;
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.$apollo.query({
        query: ForecastsInMonths,
        variables: {
          ids: [this.id],
          months: parseInt(this.months || 12, 10),
        },
      }).then((response) => {
        const [forecast] = response.data.ForecastsInMonths;
        this.forecast = forecast;
        this.items = forecast.values;
      });
    },
  },
};
</script>

<style>

</style>
