<template>
  <v-row>
    <v-navigation-drawer app>
      <v-list>
        <v-list-item to="/auth/login">
          <v-list-item-icon>
            <v-icon>
              mdi-account-box
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            Login
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/auth/register">
          <v-list-item-icon>
            <v-icon>
              mdi-book-information-variant
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            Register
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-col>
      <v-card>
        <v-card-text>
          <nuxt-child />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {

};
</script>

<style>
</style>
