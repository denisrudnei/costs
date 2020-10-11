<template>
  <v-row>
    <v-col cols="12">
      <v-text-field v-model="user.email" filled placeholder="Email" />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="user.password"
        filled
        placeholder="Password"
        type="password"
      />
    </v-col>
    <v-col>
      <v-btn @click="login">
        Login
      </v-btn>
    </v-col>
    <v-dialog :value="tryingLogin" width="55%" persistent>
      <v-card>
        <v-card-title>
          Logging in
        </v-card-title>
        <v-card-text>
          <v-progress-linear indeterminate />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import login from '@/mixins/login';

export default {
  mixins: [login],
  data() {
    return {
      tryingLogin: false,
      user: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      this.tryingLogin = true;

      this.$auth
        .loginWith('local', {
          data: this.user,
        })
        .then(() => {
          this.$toast.show('Logged', {
            duration: 1000,
          });
          this.afterLogin();
        })
        .catch(() => {
          this.$toast.error('Login failed', {
            duration: 5000,
          });
        }).finally(() => {
          this.tryingLogin = false;
        });
    },
  },
};
</script>

<style></style>
