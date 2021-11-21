<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="text-h3">
          {{ team.name }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <p class="text-h6">
                Leader: {{ team.leader.name }}
              </p>
            </v-col>
            <v-col cols="12">
              Members:
              <member-list v-model="team.members" :team-id="team.id" @update="updateMembers" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import memberList from '~/components/team/member-list.vue';
import { GetTeam } from '~/graphql/query/admin/teams/GetTeam';

export default {
  components: {
    memberList,
  },
  data() {
    return {
      team: {
        name: '',
        leader: {
          name: '',
        },
        members: [],
      },
    };
  },
  created() {
    this.$apollo.query({
      query: GetTeam,
      variables: {
        id: this.$route.params.id,
      },
    }).then((response) => {
      this.team = response.data.GetTeam;
    });
  },
  methods: {
    updateMembers(members) {
      this.team.members = members;
    },
  },
};
</script>

<style>

</style>
