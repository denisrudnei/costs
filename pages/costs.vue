<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab to="/costs" exact>
          List
        </v-tab>
        <v-tab to="/costs/create">
          Create
        </v-tab>
        <v-tab to="/costs/spent-vs-profit">
          Spends vs Profits
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12">
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
import costs from '@/graphql/query/costs';

export default {
  data() {
    return {
      costs: [],
    };
  },
  created() {
    this.$apollo
      .query({
        query: costs,
      })
      .then((response) => {
        this.costs = response.data.Costs;
      });
  },
};
</script>

<style></style>
