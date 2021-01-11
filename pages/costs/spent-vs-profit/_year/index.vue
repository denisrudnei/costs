<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab
          v-for="month in months"
          :key="month"
          :to="`/costs/spent-vs-profit/${year.value}/${month}`"
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

export default {
  computed: mapGetters({
    year: 'dates/getYear',
    months: 'dates/getMonths',
  }),
  mounted() {
    const { month } = this.$route.params;
    if (!month && this.months.length !== 0) {
      const { path } = this.$route;
      this.$router.push({
        path: `${path}/${this.months[0]}`,
      });
    }
  },
};
</script>

<style></style>
