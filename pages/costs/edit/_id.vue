<template>
  <div>
    <create v-if="cost" v-model="cost" @input="update" />
    <v-row>
      <v-col>
        <v-alert
          icon="mdi-alert-circle"
          type="info"
          :value="status === 'loading'"
          dismissible
        >
          Loading cost...
        </v-alert>
        <v-alert
          icon="mdi-alert-circle"
          type="error"
          :value="status === 'error'"
          dismissible
        >
          Error loading cost
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import create from '@/components/cost/costCreate';
import getOneCost from '@/graphql/query/getOneCost';
import editCost from '@/graphql/mutation/editCost';

export default {
  components: {
    create,
  },
  data() {
    return {
      cost: null,
      status: 'loading',
    };
  },
  mounted() {
    this.status = 'loading';
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
        this.status = 'loaded';
      }).catch(() => {
        this.status = 'error';
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
