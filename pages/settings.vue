<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab to="/settings/import-export">
          Import / Export
        </v-tab>
        <v-tab to="/settings/bank-account">
          Bank account
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
