<template>
  <v-row>
    <v-col md="8" cols="12">
      <v-text-field
        v-model="search"
        label="Search"
        filled
        prepend-inner-icon="mdi-folder-search"
        class="white--text"
        @keyup="updateQuery"
      />
    </v-col>
    <v-col md="2" cols="12">
      <v-select v-model="order" label="Order by" :items="orderOptions" filled />
    </v-col>
    <v-col md="2" cols="12">
      <v-checkbox v-model="asc" filled label="Asc" />
    </v-col>
    <v-col v-for="item in costs" :key="item.date" cols="12">
      <v-row>
        <v-col cols="12">
          <h3>Month - Year: {{ item.date }}</h3>
        </v-col>
        <v-col v-for="cost in item.costs" :key="cost.id" md="4" cols="12">
          <v-card>
            <v-card-title :class="type(cost)">
              {{ cost.name }}
            </v-card-title>
            <v-card-text>
              <h2 :class="type(cost)">
                Type: {{ cost.type }}
              </h2>
              <h3>Value: {{ cost.value | dinero }}</h3>
              <p>Date {{ cost.date | date }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn icon :to="`/costs/edit/${cost.id}`">
                <v-icon> mdi-clipboard-edit </v-icon>
              </v-btn>
              <v-btn icon class="red--text" @click="remove(cost)">
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col>
      <v-pagination v-model="page" :length="pages" :total-visible="10" />
    </v-col>
  </v-row>
</template>

<script>
import { format, isAfter, parse } from 'date-fns';
import refetch from '@/graphql/query/refetch';
import removeCost from '@/graphql/mutation/removeCost';
import { mapGetters } from 'vuex';
import { CostPagination } from '~/graphql/query/getCostPagination';

export default {
  data() {
    return {
      asc: true,
      orderOptions: [
        {
          text: 'Type',
          value: 'TYPE',
        },
        {
          text: 'Name',
          value: 'NAME',
        },
        {
          text: 'Value',
          value: 'VALUE',
        },
        {
          text: 'Date',
          value: 'DATE',
        },
      ],
      costs: [],
      pages: 0,
    };
  },
  computed: {
    ...mapGetters({
      paginationOptions: 'cost/getPagination',
    }),
    search: {
      get() {
        return this.$store.getters['cost/getSearch'];
      },
      set(value) {
        this.$store.commit('cost/setSearch', value);
      },
    },
    order: {
      get() {
        return this.$store.getters['cost/getType'];
      },
      set(value) {
        this.$store.commit('cost/setType', value);
      },
    },
    page: {
      get() {
        return this.$store.getters['cost/getPage'];
      },
      set(value) {
        this.$store.commit('cost/setPage', value);
      },
    },
  },
  watch: {
    page() {
      this.fetchData();
    },
    search() {
      this.fetchData();
    },
    asc(value) {
      this.$store.commit('cost/setOrder', value ? 'ASC' : 'DESC');
      this.fetchData();
    },
    order() {
      this.fetchData();
    },
  },
  created() {
    this.fetchData();
    const { search } = this.$route.query;
    if (search) this.search = search;
  },
  methods: {
    fetchData() {
      this.$apollo
        .query({
          query: CostPagination,
          variables: {
            ...this.paginationOptions,
          },
        })
        .then((response) => {
          const { costs } = response.data.CostPagination;
          this.costs = this.groupCosts(costs);
          this.page = response.data.CostPagination.page;
          this.pages = response.data.CostPagination.pages;
        });
    },
    groupCosts(costs) {
      const result = [];

      costs.forEach((cost) => {
        const date = new Date(cost.date);

        const dateToGroup = format(date, 'MM/yyyy');

        if (!result.map((item) => item.date).includes(dateToGroup)) {
          result.push({
            date: dateToGroup,
            costs: [],
          });
        }
        result.find((item) => item.date === dateToGroup).costs.push(cost);
        result.sort((a, b) => {
          const dateA = parse(a.date, 'MM/yyyy', new Date());
          const dateB = parse(b.date, 'MM/yyyy', new Date());

          return isAfter(dateA, dateB) ? -1 : 1;
        });
      });
      return result;
    },
    remove(value) {
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
          const costs = this.costs
            .flatMap((item) => item.costs)
            .filter((item) => item.id !== value.id);
          this.costs = this.groupCosts(costs);
          this.$toast.show('Cost removed', {
            duration: 1000,
          });
        });
    },
    updateQuery() {
      this.$router.push({
        query: {
          search: this.search,
        },
      });
    },
    type(value) {
      return value.type === 'SPENT' ? 'red--text' : 'white--text';
    },
  },
};
</script>

<style></style>
