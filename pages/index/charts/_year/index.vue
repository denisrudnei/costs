<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab
          v-for="month in months"
          :key="month"
          :to="`/charts/${year.value}/${month}`"
        >
          {{ month | monthName }}
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12">
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import getDates from '@/mixins/getDates';

export default {
  mixins: [getDates],
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
