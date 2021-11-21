<template>
  <v-list>
    <v-list-item v-for="member in value" :key="member.id">
      <v-list-item-content>
        {{ member.name }}
      </v-list-item-content>
      <v-list-item-action>
        <v-btn icon class="red--text" @click="remove(member.id)">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
import { RemoveUserForTeam } from '~/graphql/mutation/admin/teams/RemoveUserForTeam';
import { GetTeam } from '~/graphql/query/admin/teams/GetTeam';

export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    teamId: {
      type: String,
      default: '',
    },
  },
  methods: {
    remove(userId) {
      this.$apollo.mutate({
        mutation: RemoveUserForTeam,
        variables: {
          team: this.$route.params.id,
          user: userId,
        },
        awaitRefetchQueries: true,
        refetchQueries: [{ query: GetTeam, variables: { id: this.teamId } }],
      }).then(() => {
        const members = this.value.filter((member) => member.id !== userId);
        this.$emit('update', members);
      });
    },
  },
};
</script>

<style>

</style>
