<template>
  <v-row>
    <v-col md="8" cols="12">
      <v-text-field
        v-model="search"
        label="Search"
        filled
        prepend-inner-icon="mdi-folder-search"
        class="white--text"
      />
    </v-col>
    <v-col md="2" cols="12">
      <v-select v-model="order" label="Order by" :items="orderOptions" filled />
    </v-col>
    <v-col md="2" cols="12">
      <v-checkbox v-model="asc" filled label="Asc" />
    </v-col>
    <v-col v-for="cost in costsFiltred" :key="cost.id" md="4" cols="12">
      <v-card>
        <v-card-title :class="type(cost)">
          {{ cost.name }}
        </v-card-title>
        <v-card-text>
          <h2 :class="type(cost)">Type: {{ cost.type }}</h2>
          <h3>Value: {{ cost.value | dinero }}</h3>
          <p>Date {{ cost.date | date }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn icon :to="`/costs/edit/${cost.id}`">
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
import costs from '@/graphql/query/costs'
import refetch from '@/graphql/query/refetch'
import removeCost from '@/graphql/mutation/removeCost'
export default {
  data() {
    return {
      asc: true,
      order: 'type',
      orderOptions: ['type', 'name', 'value'],
      search: '',
      costs: [],
    }
  },
  computed: {
    costsFiltred() {
      const sort = this.asc
        ? (a, b) => (a[this.order] > b[this.order] ? 1 : -1)
        : (a, b) => (a[this.order] > b[this.order] ? -1 : 1)
      return this.costs
        .filter((cost) => {
          return cost.name.toLowerCase().includes(this.search.toLowerCase())
        })
        .sort(sort)
    },
  },
  created() {
    this.$apollo
      .query({
        query: costs,
      })
      .then((response) => {
        this.costs = response.data.Costs
      })
  },
  methods: {
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
