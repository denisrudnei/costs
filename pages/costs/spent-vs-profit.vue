<template>
  <v-row>
    <v-col sm="12" md="6">
      <v-data-table :items="spent" :headers="headers">
        <template v-slot:item.value="{ item }">
          {{ item.value | dinero }}
        </template>
        <template v-slot:item.date="{ item }">
          {{ item.date | date }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon class="red--text" @click="remove(item)">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
    <v-col cols="12" md="6">
      <v-data-table :items="profit" :headers="headers">
        <template v-slot:item.value="{ item }">
          {{ item.value | dinero }}
        </template>
        <template v-slot:item.date="{ item }">
          {{ item.date | date }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon class="red--text" @click="remove(item)">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
    <v-row>
      <v-col class="ma-1">
        <h2 :class="isNegative(total)">Total: {{ total | dinero }}</h2>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
import ggl from 'graphql-tag'
export default {
  data() {
    return {
      profit: [],
      spent: [],
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
          value: 'type',
          text: 'Type',
        },
        {
          value: 'actions',
          text: 'Actions',
        },
      ],
    }
  },
  computed: {
    total() {
      const sumProfits = this.profit.reduce((acc, actual) => {
        return acc + actual.value
      }, 0)
      const sumSpending = this.spent.reduce((acc, actual) => {
        return acc + actual.value
      }, 0)

      return sumProfits - sumSpending
    },
  },
  created() {
    this.$apollo
      .query({
        query: ggl`
        query {
          profit: GetProfits {
            id
            name
            value
            type
            date
          }
          spent: GetSpending {
            id
            name
            value
            type
            date
          }
        }
      `,
      })
      .then((response) => {
        this.profit = response.data.profit
        this.spent = response.data.spent
      })
  },
  methods: {
    remove(value) {
      this[value.type.toLowerCase()] = this[value.type.toLowerCase()].filter(
        (item) => {
          return item.id !== value.id
        }
      )
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
                  Costs {
                    id
                    value
                    type
                  }
                }
              `,
            },
          ],
        })
        .then(() => {
          this[value.type.toLowerCase()] = this[
            value.type.toLowerCase()
          ].filter((item) => {
            return item.id !== value.id
          })
          this.$toast.show('Cost removed', {
            duration: 1000,
          })
        })
    },
    isNegative(amount) {
      return amount < 0 ? 'red--text' : 'green--text'
    },
  },
}
</script>

<style></style>
