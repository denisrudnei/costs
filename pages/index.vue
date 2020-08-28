<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab to="/charts">Charts</v-tab>
        <v-tab to="/average">Average</v-tab>
      </v-tabs>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
export default {}
</script>

<style></style>
