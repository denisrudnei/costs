<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-col cols="8">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="cost.value"
                type="number"
                placeholder="Value"
                filled
              />
            </v-col>
            <v-col cols="12">
              <v-select v-model="cost.type" filled :items="types" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4">
          <v-card>
            <v-card-title>
              <h3>
                Date:
              </h3>
            </v-card-title>
            <v-card-text>
              <v-date-picker
                :value="getIsoDate(cost.date)"
                placeholder="Date"
                filled
                @change="setDate"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col>
      <v-btn @click="save"> Save </v-btn>
    </v-col>
  </v-row>
</template>

<script type="ts">
import ggl from 'graphql-tag'
import { format, parse } from 'date-fns'
export default {
  data() {
    return {
      types: ['PROFIT', 'SPENT'],
      date: '',
      cost: {
        type: 'PROFIT',
        date: new Date(),
        value: 0,
      },
    }
  },
  created() {
    this.setDate(this.getIsoDate(new Date()))
  },
  methods: {
    getIsoDate(value) {
      return format(value, 'yyyy-MM-dd')
    },
    setDate(value) {
      this.date = parse(value, 'yyyy-MM-dd', new Date())
    },
    save() {
      this.$apollo.mutate({
        mutation: ggl`
          mutation CreateNewCost($cost: CostCreateInput!){
            CreateNewCost(cost: $cost) {
              id
              value
              type
            }
          }
        `,
        variables: {
          cost: {
            value: parseInt(this.cost.value),
            type: this.cost.type,
            date: this.date,
          },
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
            `
          }
        ]
      }).then(() => {
        this.$toast.show('New cost created', {
          duration: 2500
        })
        this.$router.push('/costs')
      })
    },
  },
}
</script>

<style></style>
