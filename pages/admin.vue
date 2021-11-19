<template>
  <v-row>
    <v-col cols="12">
      <v-tabs>
        <v-tab to="/admin/dashboard">
          Dashboard
        </v-tab>
        <v-tab to="/admin/teams">
          Teams
          <v-icon right>
            mdi-account-group
          </v-icon>
        </v-tab>
        <v-tab to="/admin/users">
          Users
        </v-tab>
        <v-tab to="/admin/systeminfo">
          System info
          <v-icon right>
            mdi-thermometer-lines
          </v-icon>
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
  middleware: 'AdminMiddleware',
};
</script>

<style>

</style>
