<template>
  <create v-model="cost" @input="save" />
</template>

<script>
import ggl from 'graphql-tag'

import create from '@/components/cost/create'
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
    }
  },
  methods: {
    save(cost) {
      this.$apollo
        .mutate({
          mutation: ggl`
          mutation CreateNewCost($cost: CostCreateInput!){
            CreateNewCost(cost: $cost) {
              id
              name
              value
              type
            }
          }
        `,
          variables: {
            cost,
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: ggl`
              query {
                Costs {
                  id
                  value
                  type
                }
                GetProfits {
                  id
                  value
                  type
                  date
                }
                GetSpending {
                  id
                  value
                  type
                  date
                }
              }
            `,
            },
          ],
        })
        .then(() => {
          this.$toast.show('New cost created', {
            duration: 2500,
          })
          this.cost = {
            name: '',
            type: 'PROFIT',
            date: new Date(),
            value: 0,
          }
        })
    },
  },
}
</script>

<style></style>
