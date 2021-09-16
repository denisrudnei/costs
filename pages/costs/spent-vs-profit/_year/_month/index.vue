<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-spacer />
        <v-col cols="12" md="2">
          <v-checkbox
            v-model="useLastMonthBalance"
            label="Use last month balance"
            @change="fetchData"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col sm="12" md="6">
      <v-card>
        <v-card-title>
          <h2>Spending</h2>
          <v-spacer />
          <v-text-field v-model="spendingSearch" />
        </v-card-title>
        <v-card-text>
          <v-data-table
            :items="spent"
            :headers="headers"
            :search="spendingSearch"
          >
            <template #item.value="{ item }">
              {{ item.value | dinero }}
            </template>
            <template #item.date="{ item }">
              {{ item.date | date }}
            </template>
            <template #item.actions="{ item }">
              <v-btn icon :to="`/costs/edit/${item.id}`">
                <v-icon> mdi-clipboard-edit </v-icon>
              </v-btn>
              <v-btn icon class="red--text" @click="remove(item)">
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card>
        <v-card-title>
          <h2>Profits</h2>
          <v-spacer />
          <v-text-field v-model="profitsSearch" />
        </v-card-title>
        <v-card-text>
          <v-data-table
            :items="profit"
            :headers="headers"
            :search="profitsSearch"
          >
            <template #item.value="{ item }">
              {{ item.value | dinero }}
            </template>
            <template #item.date="{ item }">
              {{ item.date | date }}
            </template>
            <template #item.actions="{ item }">
              <v-btn icon :to="`/costs/edit/${item.id}`">
                <v-icon> mdi-clipboard-edit </v-icon>
              </v-btn>
              <v-btn icon class="red--text" @click="remove(item)">
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <hr>
      <v-card v-if="lastMonthBalance">
        <v-card-title>
          {{ lastMonthBalance.name }}
        </v-card-title>
        <v-card-text>
          <h3>Value: {{ lastMonthBalance.value | dinero }}</h3>
        </v-card-text>
      </v-card>
    </v-col>
    <v-row>
      <v-col class="ma-1">
        <h2 :class="isNegative(total)">
          Total: {{ total | dinero }}
        </h2>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import getDates from '@/mixins/getDates';
import removeCost from '@/graphql/mutation/removeCost';
import basicSummary from '@/graphql/query/basicSummary';
import refetch from '@/graphql/query/refetch';
import { CostPagination } from '@/graphql/query/getCostPagination';

export default {
  mixins: [getDates],
  data() {
    return {
      lastMonthBalance: null,
      profit: [],
      total: 0,
      spent: [],
      spendingSearch: '',
      profitsSearch: '',
      headers: [
        {
          value: 'name',
          text: 'Name',
        },
        {
          value: 'date',
          text: 'Date',
        },
        {
          value: 'value',
          text: 'Value',
        },
        {
          value: 'actions',
          text: 'Actions',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      paginationOptions: 'cost/getPagination',
    }),
    useLastMonthBalance: {
      get() {
        return this.$store.getters['dates/getUseLastMonthBalance'];
      },
      set(value) {
        this.$store.commit('dates/setUseLastMonthBalance', value);
      },
    },
  },
  watch: {
    year() {
      this.updateMonths();
    },
    month() {
      this.fetchData();
      this.$router.push({
        query: {
          useLastMonthBalance: this.useLastMonthBalance,
        },
      });
    },
    useLastMonthBalance(value) {
      this.$router.push({
        query: {
          useLastMonthBalance: value,
        },
      });
    },
  },
  created() {
    const { useLastMonthBalance } = this.$route.query;
    if (useLastMonthBalance === 'true') {
      this.$store.commit('dates/setUseLastMonthBalance', Boolean(useLastMonthBalance));
    }
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.$apollo
        .query({
          query: basicSummary,
          fetchPolicy: 'no-cache',
          variables: {
            useLastMonthBalance: this.useLastMonthBalance,
            year: this.year ? parseInt(this.year.value, 10) : null,
            month: this.month ? this.month : null,
          },
        })
        .then((response) => {
          this.profit = response.data.BasicSummary.profits.values;
          this.spent = response.data.BasicSummary.spending.values;
          this.total = response.data.BasicSummary.total;
          this.lastMonthBalance = response.data.BasicSummary.lastMonthBalance;
        });
    },
    updateMonth(value) {
      this.$store.commit('dates/setMonth', value);
    },
    remove(value) {
      this[value.type.toLowerCase()] = this[value.type.toLowerCase()].filter(
        (item) => item.id !== value.id,
      );
      this.$apollo
        .mutate({
          mutation: removeCost,
          variables: {
            id: value.id,
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: refetch,
            },
            {
              query: CostPagination,
              variables: {
                ...this.paginationOptions,
              },
            },
          ],
        })
        .then(() => {
          this[value.type.toLowerCase()] = this[
            value.type.toLowerCase()
          ].filter((item) => item.id !== value.id);
          this.$toast.show('Cost removed', {
            duration: 1000,
          });
          this.fetchData();
        });
    },
    isNegative(amount) {
      return amount < 0 ? 'red--text' : 'green--text';
    },
  },
};
</script>

<style></style>
