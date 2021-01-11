<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab
          v-for="year in years"
          :key="year.value"
          @click="selectMonths(year)"
        >
          {{ year.value }}
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12">
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
import getDates from '@/mixins/getDates';

export default {
  mixins: [getDates],
  mounted() {
    const { path } = this.$route;
    if (path === '/costs/spent-vs-profit' && this.year.value) this.$router.push(`/costs/spent-vs-profit/${this.year.value}`);
  },
  methods: {
    selectMonths(year) {
      this.$store.commit(
        'dates/setMonths',
        year.months.sort((a, b) => (a > b ? 1 : -1)),
      );
      this.$router.push({
        path: `/costs/spent-vs-profit/${year.value}`,
      });
    },
  },
};
</script>

<style></style>
