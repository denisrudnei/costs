<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-col md="8" cols="12">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="value.name" placeholder="Name" filled />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="value.value"
                type="number"
                placeholder="Value"
                filled
              />
            </v-col>
            <v-col cols="12">
              <v-select v-model="value.type" filled :items="types" />
            </v-col>
          </v-row>
        </v-col>
        <v-col md="4" cols="12">
          <v-card>
            <v-card-title>
              <h3>
                Date:
              </h3>
            </v-card-title>
            <v-card-text>
              <v-date-picker
                :value="getIsoDate(value.date)"
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

<script>
import { format, parse } from 'date-fns'
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        name: '',
        type: 'PROFIT',
        date: new Date(),
        value: 0,
      }),
    },
  },
  data() {
    return {
      types: ['PROFIT', 'SPENT'],
      date: new Date(),
    }
  },
  created() {
    this.setDate(this.getIsoDate(this.value.date))
  },
  methods: {
    getIsoDate(value) {
      return format(value, 'yyyy-MM-dd')
    },
    setDate(value) {
      this.date = parse(value, 'yyyy-MM-dd', new Date())
    },
    save() {
      this.$emit('input', {
        name: this.value.name,
        value: parseFloat(this.value.value),
        type: this.value.type,
        date: this.date,
      })
    },
  },
}
</script>

<style></style>
