<template>
  <v-row>
    <v-col>
      <create v-model="team" @save="edit" />
    </v-col>
  </v-row>
</template>

<script>
import create from '@/components/team/create';
import { GetTeam } from '../../../../graphql/query/admin/teams/GetTeam';
import { UpdateTeamName } from '../../../../graphql/mutation/admin/teams/UpdateTeamName';
import { UpdateLeaderForTeam } from '../../../../graphql/mutation/admin/teams/UpdateLeaderforTeam';
import { GetTeams } from '~/graphql/query/GetTeams';

export default {
  components: {
    create,
  },
  data() {
    return {
      team: {},
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
      if (typeof this.team.leader === 'object') {
        this.team.leader = this.team.leader.id;
      }
    });
  },
  methods: {
    edit(team) {
      if (this.team.name !== team.name) {
        this.$apollo.mutate({
          mutation: UpdateTeamName,
          variables: {
            team: this.team.id,
            name: team.name,
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: GetTeams }],
        }).then(() => {
          this.$toast.show('Updated team name', {
            duration: 1000,
          });
        });
      }
      if (this.team.leader !== team.leader) {
        this.$apollo.mutate({
          mutation: UpdateLeaderForTeam,
          variables: {
            team: this.team.id,
            user: team.leader,
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: GetTeams }],
        }).then(() => {
          this.$toast.show('Updated leader of team', {
            duration: 1000,
          });
        });
      }
    },
  },
};
</script>

<style>

</style>
