<template>
  <v-row>
    <v-col v-for="user in users" :key="user.id" cols="12" md="4" lg="3">
      <v-card>
        <v-card-title>
          {{ user.name }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              {{ user.email }}
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import user from '@/graphql/query/user';

export default {
  data() {
    return {
      users: [],
    };
  },
  created() {
    this.$apollo.query({
      query: user,
    }).then((response) => {
      this.users = response.data.User;
    });
  },
};
</script>

<style>

</style>
