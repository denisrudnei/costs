<template>
  <v-row>
    <v-col cols="12" md="8">
      <v-data-table :items="items" :headers="headers">
        <template #item.portion="{ item }">
          {{ item.portion | dinero }}
        </template>
        <template #item.restValue="{ item }">
          {{ item.restValue | dinero }}
        </template>
        <template #item.paidValue="{ item }">
          {{ item.paidValue | dinero }}
        </template>
        <template #item.interest="{ item }">
          {{ item.interest | dinero }}
        </template>
        <template #item.amortizationValue="{ item }">
          {{ item.amortizationValue | dinero }}
        </template>
      </v-data-table>
    </v-col>
    <v-col cols="12" md="4">
      <v-card>
        <v-card-title>
          {{ loan.name }}
        </v-card-title>
        <v-card-text>
          <p>Total: {{ Number(loan.total )| dinero }}</p>
          <p>Interest: {{ loan.interest }}%</p>
          <p>Portions: {{ loan.portions }}</p>
          <p>Advance Interest: {{ loan.advanceInterest }}%</p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { GetPortions } from '../../../graphql/query/getPortions';

export default {
  data() {
    return {
      loan: {
        name: '',
        total: 0,
        interest: 0,
        advanceInterest: 0,
        portions: 0,
      },
      items: [],
      headers: [
        {
          text: 'Number',
          value: 'number',
        },
        {
          text: 'Portion',
          value: 'portion',
        },
        {
          text: 'Rest value',
          value: 'restValue',
        },
        {
          text: 'Paid value',
          value: 'paidValue',
        },
        {
          text: 'Interest',
          value: 'interest',
        },
        {
          text: 'Amortization value',
          value: 'amortizationValue',
        },
      ],
    };
  },
  created() {
    const { id } = this.$route.params;
    this.$apollo.query({
      query: GetPortions,
      variables: {
        id,
      },
    }).then((response) => {
      this.items = response.data.GetPortions;
      this.loan = response.data.GetLoan;
    });
  },
};
</script>

<style>

</style>
