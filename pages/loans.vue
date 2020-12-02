<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab to="/loans/list">
          List
        </v-tab>
        <v-tab to="/loans/create">
          Create
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
