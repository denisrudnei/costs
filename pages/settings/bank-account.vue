<template>
  <v-row>
    <v-col cols="12">
      <v-tabs>
        <v-tab to="/settings/bank-account/create">
          Create
        </v-tab>
        <v-tab to="/settings/bank-account/list">
          List
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12">
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
