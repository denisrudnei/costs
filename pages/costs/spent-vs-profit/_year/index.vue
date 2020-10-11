<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab
          v-for="month in months"
          :key="month"
          :to="`/costs/spent-vs-profit/${year.value}/${month}`"
        >
          {{ month }}
        </v-tab>
      </v-tabs>
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
};
</script>

<style></style>
