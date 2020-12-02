<template>
  <v-row>
    <v-col cols="12" md="8">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="loan.name" label="Name" filled />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="loan.total" label="Value" filled type="number" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="loan.interest" filled label="Interest" type="number" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="loan.portions" filled label="Portions" type="number" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="loan.advanceInterest"
            filled
            label="Advance Interest"
            type="number"
          />
        </v-col>
        <v-col cols="12">
          <v-btn @click="save">
            Save
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="4">
      <v-card>
        <v-card-title>
          {{ loan.name }}
        </v-card-title>
        <v-card-text>
          <p>Total: {{ Number(loan.total )| dinero }}</p>
          <p>Interest: {{ loan.interest }} %</p>
          <p>Portions: {{ loan.portions }}</p>
          <p>Advance Interest: {{ loan.advanceInterest }}%</p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        name: '',
        total: 0,
        interest: 0,
        portions: 0,
        advanceInterest: 0,
      }),
    },
  },
  data() {
    return {
      loanData: {
        name: '',
        total: 0,
        interest: 0,
        portions: 0,
        advanceInterest: 0,
      },
    };
  },
  computed: {
    loan: {
      get() {
        return Object.assign(this.loanData, this.value);
      },
      set(value) {
        Object.assign(this.value, value);
      },
    },
  },
  methods: {
    save() {
      this.$emit('input', this.loan);
    },
  },
};
</script>

<style>

</style>
