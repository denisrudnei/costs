<template>
  <v-row>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-item v-for="link in pages" :key="link.link" :to="link.link">
          <v-list-item-icon>
            <v-icon>
              {{ link.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            {{ link.text }}
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
import drawer from '@/mixins/drawer';

export default {
  mixins: [drawer],
  data() {
    return {
      pages: [
        {
          link: '/auth/login',
          text: 'Login',
          icon: 'mdi-account-box',
        },
        {
          link: '/auth/register',
          text: 'Register',
          icon: 'mdi-book-information-variant',
        },
        {
          link: '/auth/reset',
          text: 'Reset password',
          icon: 'mdi-lock-open',
        },
      ],
    };
  },

};
</script>

<style>
</style>
