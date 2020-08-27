<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-spacer />
        <v-col cols="12" md="2">
          <v-select
            v-model="year"
            placeholder="Year"
            filled
            :items="yearsList"
            :value-comparator="compareYear"
          ></v-select>
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            placeholder="Month"
            filled
            :items="months"
            :disabled="months.length === 0"
            @input="updateMonth"
          ></v-select>
        </v-col>
      </v-row>
    </v-col>
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
import getYears from '@/mixins/getYears'
import { mapGetters } from 'vuex'
export default {
  mixins: [getYears],
  data() {
    return {
      year: null,
      profit: [],
      total: 0,
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
    ...mapGetters({
      months: 'dates/getMonths',
      month: 'dates/getMonth',
    }),
    yearsList() {
      return this.years.map((year) => ({ text: year.value, value: year }))
    },
  },
  watch: {
    year() {
      this.updateMonths()
      this.fetchData()
    },
    month() {
      this.fetchData()
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
    compareYear(value1, value2) {
      return value1.value === value2
    },
    fetchData() {
      this.$apollo
        .query({
          query: ggl`
            query BasicSummary ($year: Int, $month: Int) {
              BasicSummary(year: $year, month: $month) {
                spending {
                  sum
                  values {
                    id
                    name
                    value
                    date
                    type
                  }
                }
                profits {
                  sum
                  values {
                    id
                    name
                    value
                    date
                    type
                  }
                }
                total
              }
            }
        `,
          fetchPolicy: 'no-cache',
          variables: {
            year: this.year?.value ?? null,
            month: this.month ?? null,
          },
        })
        .then((response) => {
          this.profit = response.data.BasicSummary.profits.values
          this.spent = response.data.BasicSummary.spending.values
          this.total = response.data.BasicSummary.total
        })
    },
    updateMonth(value) {
      this.$store.commit('dates/setMonth', value)
    },
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
          this.fetchData()
        })
    },
    isNegative(amount) {
      return amount < 0 ? 'red--text' : 'green--text'
    },
  },
}
</script>

<style></style>
