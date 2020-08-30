<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-spacer />
        <v-col cols="12" md="2">
          <v-checkbox
            v-model="useLastMonthBalance"
            label="Use last month balance"
            @change="fetchData"
          />
        </v-col>
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
            :value="month"
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
          <v-btn icon :to="`/costs/edit/${item.id}`">
            <v-icon>
              mdi-clipboard-edit
            </v-icon>
          </v-btn>
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
          <v-btn icon :to="`/costs/edit/${item.id}`">
            <v-icon>
              mdi-clipboard-edit
            </v-icon>
          </v-btn>
          <v-btn icon class="red--text" @click="remove(item)">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <v-card v-if="lastMonthBalance">
        <v-card-title>
          {{ lastMonthBalance.name }}
        </v-card-title>
        <v-card-text>
          <h3>Value: {{ lastMonthBalance.value | dinero }}</h3>
        </v-card-text>
      </v-card>
    </v-col>
    <v-row>
      <v-col class="ma-1">
        <h2 :class="isNegative(total)">Total: {{ total | dinero }}</h2>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
import getDates from '@/mixins/getDates'
import removeCost from '@/graphql/mutation/removeCost'
import basicSummary from '@/graphql/query/basicSummary'
import refetch from '@/graphql/query/refetch'
export default {
  mixins: [getDates],
  data() {
    return {
      useLastMonthBalance: false,
      lastMonthBalance: null,
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
          sortable: false,
        },
      ],
    }
  },
  computed: {
    yearsList() {
      return this.years.map((year) => ({ text: year.value, value: year }))
    },
    year: {
      get() {
        return this.$store.getters['dates/getYear']
      },
      set(value) {
        this.$store.commit('dates/setYear', value)
      },
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
    this.fetchData()
  },
  methods: {
    compareYear(value1, value2) {
      return value1.value === value2
    },
    fetchData() {
      this.$apollo
        .query({
          query: basicSummary,
          fetchPolicy: 'no-cache',
          variables: {
            useLastMonthBalance: this.useLastMonthBalance,
            year: this.year ? parseInt(this.year.value, 10) : null,
            month: this.month ? this.month : null,
          },
        })
        .then((response) => {
          this.profit = response.data.BasicSummary.profits.values
          this.spent = response.data.BasicSummary.spending.values
          this.total = response.data.BasicSummary.total
          this.lastMonthBalance = response.data.BasicSummary.lastMonthBalance
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
