<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab
          v-for="month in months"
          :key="month"
          :to="`/charts/${year.value}/${month}`"
        >
          {{ month | format }}
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
import { setMonth, format } from 'date-fns';
import getDates from '@/mixins/getDates';
import { mapGetters } from 'vuex';

export default {
  mixin: [getDates],
  filters: {
    format(value) {
      return format(setMonth(new Date(), value - 1), 'MMM');
    },
  },
  computed: mapGetters({
    months: 'dates/getMonths',
    year: 'dates/getYear',
  }),
  created() {
    const { year } = this.$route.params;
    this.$store.commit('dates/setYear', {
      value: year,
      months: this.months,
    });
  },
};
</script>

<style></style>
