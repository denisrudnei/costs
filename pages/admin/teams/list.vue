<template>
  <v-row>
    <v-col cols="12">
      <v-data-table :items="teams" :headers="headers">
        <template #item.leader="{ item }">
          {{ item.leader.name }}
        </template>
        <template #item.actions="{ item }">
          <v-btn icon class="primary">
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
          <v-btn icon class="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { GetTeams } from '../../../graphql/query/GetTeams';

export default {
  data() {
    return {
      teams: [],
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Leader',
          value: 'leader',
        },
        {
          text: 'Actions',
          value: 'actions',
        },
      ],
    };
  },
  created() {
    this.$apollo.query({
      query: GetTeams,
    }).then((response) => {
      this.teams = response.data.GetTeams;
    });
  },
};
</script>

<style>

</style>
