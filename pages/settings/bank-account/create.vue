<template>
  <v-row>
    <v-col cols="12">
      <v-text-field v-model="bankAccount.name" filled label="Name" />
    </v-col>
    <v-col cols="12">
      <v-text-field v-model="bankAccount.agency" filled label="Bank agency" />
    </v-col>
    <v-col cols="12">
      <v-text-field v-model="bankAccount.account" filled label="Account" />
    </v-col>
    <v-col cols="12">
      <v-btn :disabled="disabled" @click="save">
        Save
        <v-icon right>
          mdi-content-save
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { GetBankAccounts } from '~/graphql/query/bank-account/GetBankAccounts';
import { CreateBankAccount } from '../../../graphql/mutation/bank-account/CreateBankAccount';

export default {
  data() {
    return {
      bankAccount: {
        name: '',
        agency: '',
        account: '',
      },
    };
  },
  computed: {
    disabled() {
      return this.bankAccount.name === '' || this.bankAccount.agency === '' || this.bankAccount.account === '';
    },
  },
  methods: {
    save() {
      this.$apollo.mutate({
        mutation: CreateBankAccount,
        variables: {
          account: this.bankAccount,
        },
        awaitRefetchQueries: true,
        refetchQueries: [{ query: GetBankAccounts }],
      }).then(() => {
        this.bankAccount = {
          name: '',
          agency: '',
          account: '',
        };
        this.$toast.show('New bank account created', {
          duration: 1000,
        });
      });
    },
  },
};
</script>

<style>

</style>
