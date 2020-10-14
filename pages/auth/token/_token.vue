<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="password"
        label="New password"
        :type="show ? 'text' : 'password'"
        filled
        :append-icon="show ? 'mdi-eye-off' :'mdi-eye'"
        @click:append="show = !show"
      />
    </v-col>
    <v-col cols="12">
      <v-btn @click="reset">
        <v-icon left>
          mdi-content-save
        </v-icon>
        Change password
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { resetFromReceiveEmail } from '~/graphql/mutation/resetFromReceivedEmail';

export default {
  auth: false,
  data() {
    return {
      show: false,
      password: '',
    };
  },
  methods: {
    reset() {
      const { token } = this.$route.params;
      this.$apollo.mutate({
        mutation: resetFromReceiveEmail,
        variables: {
          token,
          newPassword: this.newPassword,
        },
      }).then(() => {
        this.$toast.show('Updated', {
          duration: 5000,
        });
      }).catch((e) => {
        this.$toast.error(e.message);
      });
    },
  },
};
</script>

<style>

</style>
