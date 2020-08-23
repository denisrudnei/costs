<template>
  <v-row>
    <v-col v-for="cost in costs" :key="cost.id" cols="4">
      <v-card>
        <v-card-title :class="type(cost)">
          <p>Type: {{ cost.type }}</p>
        </v-card-title>
        <v-card-text>
          <h3>Value: {{ cost.value | dinero }}</h3>
          <p>Date {{ cost.date | date }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn icon>
            <v-icon>
              mdi-clipboard-edit
            </v-icon>
          </v-btn>
          <v-btn icon class="red--text" @click="remove(cost)">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ggl from 'graphql-tag'
export default {
  data() {
    return {
      costs: [],
    }
  },
  created() {
    this.$apollo
      .query({
        query: ggl`
          query {
            Costs {
              id
              value
              type
              date
            }
          } `,
      })
      .then((response) => {
        this.costs = response.data.Costs
      })
  },
  methods: {
    remove(value) {
      this.$apollo
        .mutate({
          mutation: ggl`
          mutation RemoveCost($id: ID!) {
            RemoveCost(id: $id)
          }
        `,
          variables: {
            id: value.id,
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: ggl`
                query {
                  Costs {
                    id
                    value
                  }
                  GetProfits {
                    id
                    value
                  }
                  GetSpending {
                    id
                    value
                  }
                }
              `,
            },
          ],
        })
        .then(() => {
          this.costs = this.costs.filter((item) => {
            return item.id !== value.id
          })
        })
    },
    type(value) {
      return value.type === 'SPENT' ? 'red--text' : 'white--text'
    },
  },
}
</script>

<style></style>
