<template>
  <create v-model="forecast" @input="save" />
</template>

<script>
import create from '@/components/forecast/forecastCreate';
import { createForecast } from '../../graphql/mutation/createForecast';
import { GetForecast } from '../../graphql/query/getForecast';

export default {
  components: {
    create,
  },
  data() {
    return {
      forecast: {
        name: '',
        start: new Date(),
        end: new Date(),
        indeterminate: false,
        value: 0,
        type: 'PROFIT',
      },
    };
  },
  methods: {
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
        this.forecast = {
          name: '',
          start: new Date(),
          end: new Date(),
          indeterminate: false,
          value: 0,
          type: 'PROFIT',
        };
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
