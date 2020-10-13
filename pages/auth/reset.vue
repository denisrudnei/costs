<template>
  <v-row>
    <v-col cols="12">
      <v-text-field v-model="email" filled label="Email" />
    </v-col>
    <v-col>
      <v-btn :disabled="email.length === 0 " @click="send">
        <v-icon left>
          mdi-send
        </v-icon>
        Send email
      </v-btn>
    </v-col>
    <v-dialog :value="sending" width="50%" persistent>
      <v-card>
        <v-card-title>
          Sending email
        </v-card-title>
        <v-card-text>
          <v-progress-linear indeterminate />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { sendResetMail } from '~/graphql/mutation/sendResetMail';

export default {
  auth: false,
  data() {
    return {
      sending: false,
      email: '',
      url: '',
    };
  },
  mounted() {
    const { protocol, host } = window.location;
    this.url = `${protocol}//${host}`;
  },
  methods: {
    send() {
      this.sending = true;
      this.$apollo.mutate({
        mutation: sendResetMail,
        variables: {
          email: this.email,
          url: this.url,
        },
      }).then(() => {
        this.sending = false;
        this.$toast.show('Email send', {
          duration: 5000,
        });
      }).catch((e) => {
        this.sending = false;
        this.$toast.error(e.message);
      });
    },
  },
};
</script>

<style>

</style>
