<template>
  <v-row>
    <v-col cols="12">
      <v-text-field v-model="user.email" filled placeholder="Email" />
    </v-col>
    <v-col cols="12">
      <v-text-field v-model="user.name" filled placeholder="Name" />
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
      <v-btn @click="register">
        Register
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import ggl from 'graphql-tag'
export default {
  auth: false,
  data() {
    return {
      user: {
        email: '',
        name: '',
        password: '',
      },
    }
  },
  methods: {
    register() {
      this.$apollo
        .mutate({
          mutation: ggl`
            mutation Register($email: String!, $name: String!, $password: String!) {
              Register(email: $email, name: $name, password: $password) {
                id
                name
                email
              }
            }
          `,
          variables: {
            email: this.user.email,
            name: this.user.name,
            password: this.user.password,
          },
        })
        .then(() => {
          this.$toast.show('User created', {
            duration: 1500,
          })
          this.$router.push('/auth/login')
        })
        .catch(() => {
          this.$toast.error('Error', {
            duration: 5000,
          })
        })
    },
  },
}
</script>

<style></style>
