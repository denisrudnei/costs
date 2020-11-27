<template>
  <v-row>
    <v-col>
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
            <v-col cols="12">
              <v-data-table :items="items" :headers="headers">
                <template v-slot:item.date="{ item }">
                  {{ item.date.substr(0, 10) | date }}
                </template>
                <template v-slot:item.value="{ item }">
                  {{ item.value | dinero }}
                </template>
              </v-data-table>
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
    this.$apollo.query({
      query: ForecastsInMonths,
      variables: {
        ids: [id],
      },
    }).then((response) => {
      const [forecast] = response.data.ForecastsInMonths;
      this.forecast = forecast;
      this.items = forecast.values;
    });
  },
};
</script>

<style>

</style>
