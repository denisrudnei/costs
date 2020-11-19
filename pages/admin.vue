<template>
  <v-row>
    <v-col cols="12">
      <v-tabs>
        <v-tab to="/admin/dashboard">
          Dashboard
        </v-tab>
        <v-tab to="/admin/users">
          Users
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
export default {
  middleware: 'AdminMiddleware',
};
</script>

<style>

</style>
