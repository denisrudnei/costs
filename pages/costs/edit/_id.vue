<template>
  <div>
    <create v-if="cost" v-model="cost" @input="update" />
    <span v-else>Loading</span>
  </div>
</template>

<script>
import create from '@/components/cost/create';
import getOneCost from '@/graphql/query/getOneCost';
import editCost from '@/graphql/mutation/editCost';

export default {
  components: {
    create,
  },
  data() {
    return {
      cost: null,
    };
  },
  mounted() {
    const { id } = this.$route.params;
    this.$apollo
      .query({
        query: getOneCost,
        fetchPolicy: 'network-only',
        variables: {
          id,
        },
      })
      .then((response) => {
        const date = new Date(response.data.GetOneCost.date);
        this.cost = {
          ...response.data.GetOneCost,
          date,
        };
      });
  },
  methods: {
    update(cost) {
      const { id } = this.$route.params;
      this.$apollo
        .mutate({
          mutation: editCost,
          variables: {
            id,
            cost,
          },
        })
        .then(() => {
          this.$router.back();
        });
    },
  },
};
</script>

<style></style>
