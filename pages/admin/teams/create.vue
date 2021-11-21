<template>
  <v-row>
    <v-col>
      <create @save="save" />
    </v-col>
  </v-row>
</template>

<script>
import create from '@/components/team/create';
import { CreateTeam } from '../../../graphql/mutation/admin/teams/CreateTeam';
import { GetTeams } from '~/graphql/query/GetTeams';

export default {
  components: {
    create,
  },
  methods: {
    save(team) {
      this.$apollo.mutate({
        mutation: CreateTeam,
        variables: {
          team: {
            name: team.name,
            leader: team.leader,
          },
        },
        awaitRefetchQueries: true,
        refetchQueries: [{ query: GetTeams }],
      }).then(() => {
        this.$toast.show('Created', {
          duration: 1000,
        });
        this.$router.push('/admin/teams/list');
      });
    },
  },
};
</script>

<style>

</style>
