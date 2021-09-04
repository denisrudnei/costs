<template>
  <v-row>
    <v-col cols="12">
      <v-data-table :headers="headers" :items="items">
        <template #item.actions="{item}">
          <v-btn icon class="red--text" @click="remove(item.id)">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { GetBankAccounts } from '../../../graphql/query/bank-account/GetBankAccounts';
import { RemoveBankAccount } from '../../../graphql/mutation/bank-account/RemoveBankAccount';

export default {
  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Agency',
          value: 'agency',

        },
        {
          text: 'Account',
          value: 'account',
        },
        {
          text: 'Actions',
          value: 'actions',
        },
      ],
      items: [],
    };
  },
  created() {
    this.$apollo.query({
      query: GetBankAccounts,
    }).then((response) => {
      this.items = response.data.GetBankAccounts;
    });
  },
  methods: {
    remove(id) {
      this.$apollo.mutate({
        mutation: RemoveBankAccount,
        variables: {
          id,
        },
      }).then(() => {
        this.items = this.items.filter((item) => item.id !== id);
      });
    },
  },
};
</script>

<style>

</style>
