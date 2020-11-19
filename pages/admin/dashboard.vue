<template>
  <v-row>
    <v-col cols="12">
      <v-row v-if="dashboard">
        <v-col v-for="value in dashboard.quantities" :key="value.name" cols="12" md="3">
          <v-card>
            <v-card-title>
              {{ value.name }}
            </v-card-title>
            <v-card-text>
              Total: {{ value.total }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { dashboard } from '@/graphql/query/dashboard';

export default {
  data() {
    return {
      dashboard: {},
    };
  },
  created() {
    this.$apollo.query({
      query: dashboard,
    }).then((response) => {
      this.dashboard = response.data.Dashboard;
    });
  },
};
</script>

<style>

</style>
