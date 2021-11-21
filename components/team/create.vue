<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="team.name" filled label="Name" />
        </v-col>
        <v-col cols="12">
          <v-autocomplete v-model="team.leader" filled label="Leader" :items="users" />
        </v-col>

        <v-col cols="12" md="6">
          Members:
          <member-list v-model="team.members" :team-id="team.id" @update="updateMembers" />
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="memberToAdd"
            :items="users"
            filled
            label="Members"
            :disabled="!team.id"
          />
          <v-btn class="primary" :disabled="!memberToAdd" @click="add()">
            Add
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn class="primary" :disabled="disabled" @click="save">
            Save
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { GetTeam } from '~/graphql/query/admin/teams/GetTeam';
import { GetUsers } from '~/graphql/query/admin/teams/GetUsers';
import { GetTeams } from '~/graphql/query/GetTeams';
import { AddUserInTeam } from '../../graphql/mutation/admin/teams/AddUserInTeam';
import memberList from './member-list.vue';

export default {
  components: { memberList },
  props: {
    value: {
      type: Object,
      default: () => ({
        name: '',
        leader: undefined,
        members: [],
      }),
    },
  },
  data() {
    return {
      users: [],
      memberToAdd: undefined,
      teamData: {
        name: '',
        leader: undefined,
        members: [],
      },
    };
  },
  computed: {
    team() {
      return Object.assign(this.teamData, this.value);
    },
    disabled() {
      return this.team.name.length === 0 || this.team.leader === undefined;
    },
  },
  created() {
    Object.assign(this.teamData, this.value);
    this.$apollo.query({
      query: GetUsers,
    }).then((response) => {
      this.users = response.data.User.map((user) => ({
        text: user.name,
        value: user.id,
      }));
    });
  },
  methods: {
    save() {
      this.$emit('save', this.team);
    },
    add() {
      this.$apollo.mutate({
        mutation: AddUserInTeam,
        variables: {
          team: this.team.id,
          user: this.memberToAdd,
        },
        awaitRefetchQueries: true,
        refetchQueries: [{ query: GetTeams }, { query: GetTeam, variables: { id: this.team.id } }],
      }).then((response) => {
        this.team.members = response.data.AddUserInTeam.members;
      });
    },
    updateMembers(members) {
      this.team.members = members;
    },
  },
};
</script>

<style>

</style>
