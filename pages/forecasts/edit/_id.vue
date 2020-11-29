<template>
  <create v-if="forecast" v-model="forecast" @input="update" />
</template>

<script>
import create from '@/components/forecast/create';
import { parse } from 'date-fns';
import { GetOneForecast } from '../../../graphql/query/getOneForecast';
import { EditForecast } from '../../../graphql/mutation/editForecast';

export default {
  components: { create },
  data() {
    return {
      id: undefined,
      forecast: undefined,
    };
  },
  created() {
    const { id } = this.$route.params;
    this.id = id;
    this.$apollo.query({
      query: GetOneForecast,
      variables: {
        id,
      },
    }).then((response) => {
      const { start, end, ...rest } = response.data.GetOneForecast;
      this.forecast = {
        ...rest,
        start: parse(start.substr(0, 10), 'yyyy-MM-dd', new Date()),
        end: parse(end.substr(0, 10), 'yyyy-MM-dd', new Date()),
      };
    });
  },
  methods: {
    update() {
      const {
        name, start, end, value, type, indeterminate,
      } = this.forecast;
      this.$apollo.mutate({
        mutation: EditForecast,
        variables: {
          id: this.id,
          forecast: {
            name,
            start,
            end,
            value: parseFloat(value.toString()),
            type,
            indeterminate,
          },
        },
      }).then(() => {
        this.$toast.show('Updated', {
          duration: 1000,
        });
        this.forecast = {
          name: '',
          value: 0,
          start: new Date(),
          end: new Date(),
          type: 'PROFIT',
          indeterminate: false,
        };
      });
    },
  },
};
</script>

<style>

</style>
