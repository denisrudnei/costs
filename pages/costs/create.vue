<template>
  <create v-model="cost" @input="save" />
</template>

<script>
import { mapGetters } from 'vuex';
import create from '@/components/cost/costCreate';
import createNewCost from '@/graphql/mutation/createNewCost';
import profits from '@/graphql/query/profits';
import costs from '@/graphql/query/costs';
import spending from '@/graphql/query/spending';
import { CostPagination } from '~/graphql/query/getCostPagination';

export default {
  components: {
    create,
  },
  data() {
    return {
      cost: {
        name: '',
        type: 'PROFIT',
        date: new Date(),
        value: 0,
      },
    };
  },
  computed: mapGetters({
    paginationOptions: 'cost/getPagination',
  }),
  methods: {
    save(cost) {
      this.$apollo
        .mutate({
          mutation: createNewCost,
          variables: {
            cost,
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: costs,
            },
            {
              query: profits,
            },
            {
              query: spending,
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
          this.$toast.show('New cost created', {
            duration: 2500,
          });
          this.cost = {
            name: '',
            type: 'PROFIT',
            date: new Date(),
            value: 0,
          };
        });
    },
  },
};
</script>

<style></style>
