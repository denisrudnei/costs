<template>
  <v-row>
    <v-col>
      <v-data-table :items="items" :headers="headers">
        <template #item.start="{ item }">
          <v-menu :close-on-content-click="false">
            <v-date-picker :value="item.start.substr(0, 10)" readonly />
            <template #activator="{on}">
              <span v-on="on">
                {{ item.start | date }}
              </span>
            </template>
          </v-menu>
        </template>
        <template #item.end="{ item }">
          <v-menu :close-on-content-click="false">
            <v-date-picker :value="item.end.substr(0, 10)" readonly />
            <template #activator="{on}">
              <span v-on="on">
                {{ item.end | date }}
              </span>
            </template>
          </v-menu>
        </template>
        <template #item.months="{ item }">
          {{ months(item.start, item.end) }}
        </template>
        <template #item.value="{ item }">
          {{ item.value | dinero }}
        </template>
        <template #item.total="{ item }">
          {{ (months(item.start, item.end) * item.value) | dinero }}
        </template>
        <template #item.indeterminate="{ item }">
          <v-checkbox readonly :input-value="item.indeterminate" />
        </template>
        <template #item.actions="{ item }">
          <v-btn :to="`/forecasts/details/${item.id}`" icon>
            <v-icon>
              mdi-book-information-variant
            </v-icon>
          </v-btn>
          <v-btn :to="`/forecasts/edit/${item.id}`" icon>
            <v-icon>
              mdi-clipboard-edit
            </v-icon>
          </v-btn>
          <v-btn icon class="red--text" @click="remove(item.id)">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import forecasts from '@/mixins/forecasts';
import { GetForecast } from '../../graphql/query/getForecast';
import { RemoveForecast } from '../../graphql/mutation/removeForecast';

export default {
  mixins: [forecasts],
  data() {
    return {
      items: [],
      headers: [
        {
          value: 'name',
          text: 'Name',
        },
        {
          value: 'start',
          text: 'Start',
        },
        {
          value: 'end',
          text: 'End',
        },
        {
          value: 'value',
          text: 'Value',
        },
        {
          value: 'months',
          text: 'Months',
        },
        {
          value: 'indeterminate',
          text: 'Indeterminate',
        },
        {
          value: 'total',
          text: 'Total',
        },
        {
          value: 'actions',
          text: 'Actions',
          sortable: false,
        },
      ],
    };
  },
  created() {
    this.$apollo.query({
      query: GetForecast,
    }).then((response) => {
      this.items = response.data.GetForecast;
    });
  },
  methods: {
    months(start, end) {
      return this.getMonths(start.substr(0, 10), end.substr(0, 10));
    },
    remove(id) {
      this.$apollo.mutate({
        mutation: RemoveForecast,
        variables: {
          id,
        },
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: GetForecast,
          },
        ],
      }).then(() => {
        this.items = this.items.filter((forecast) => forecast.id !== id);
        this.$toast.show('Forecast removed', {
          duration: 1000,
        });
      });
    },
  },
};
</script>

<style>

</style>
