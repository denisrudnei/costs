<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab to="/forecasts/list">
          List
        </v-tab>
        <v-tab to="/forecasts/create">
          Create
        </v-tab>
        <v-tab to="/forecasts/charts">
          Charts
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
export default {

};
</script>

<style>

</style>
