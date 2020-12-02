<template>
  <v-row>
    <v-col>
      <v-data-table :items="items" :headers="headers">
        <template v-slot:item.total="{ item }">
          {{ item.total | dinero }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn :to="`/loans/details/${item.id}`" icon>
            <v-icon>
              mdi-book-information-variant
            </v-icon>
          </v-btn>
          <v-btn :to="`/loans/edit/${item.id}`" icon>
            <v-icon>
              mdi-clipboard-edit
            </v-icon>
          </v-btn>
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
import { RemoveLoan } from '~/graphql/mutation/removeLoan';
import { GetLoans } from '../../graphql/query/getLoans';

export default {
  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Total',
          value: 'total',
        },
        {
          text: 'Portions',
          value: 'portions',
        },
        {
          text: 'Interest',
          value: 'interest',
        },
        {
          text: 'Advance Interest',
          value: 'advanceInterest',
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
      query: GetLoans,
    }).then((response) => {
      this.items = response.data.GetLoans;
    });
  },
  methods: {
    remove(id) {
      this.$apollo.mutate({
        mutation: RemoveLoan,
        variables: {
          id,
        },
      }).then(() => {
        this.items = this.items.filter((loan) => loan.id !== id);
        this.$toast.show('Loan removed', {
          duration: 1000,
        });
      });
    },
  },
};
</script>

<style>

</style>
