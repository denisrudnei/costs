<template>
  <div>
    <create v-if="cost" v-model="cost" @input="update" />
    <span v-else>Loading</span>
  </div>
</template>

<script>
import create from '@/components/cost/create'
import ggl from 'graphql-tag'
export default {
  components: {
    create,
  },
  data() {
    return {
      cost: null,
    }
  },
  mounted() {
    const { id } = this.$route.params
    this.$apollo
      .query({
        query: ggl`
          query GetOneCost($id: ID!) {
            GetOneCost(id: $id) {
              id
              name
              value
              date
              type
            }
          }`,
        fetchPolicy: 'network-only',
        variables: {
          id,
        },
      })
      .then((response) => {
        const date = new Date(response.data.GetOneCost.date)
        this.cost = {
          ...response.data.GetOneCost,
          date,
        }
      })
  },
  methods: {
    update(cost) {
      const { id } = this.$route.params
      this.$apollo
        .mutate({
          mutation: ggl`
            mutation EditCost($id: ID!, $cost: CostEditInput!) {
              EditCost(id: $id, cost: $cost) {
                name
                id
                value
                date
                type
              }
            }
          `,
          variables: {
            id,
            cost,
          },
        })
        .then(() => {
          this.$router.push('/costs')
        })
    },
  },
}
</script>

<style></style>
