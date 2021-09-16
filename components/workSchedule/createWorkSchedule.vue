<template>
  <v-row>
    <v-col cols="12">
      <v-menu v-model="dayMenu" :close-on-content-click="false" max-width="290px">
        <template #activator="{ on }">
          <v-text-field label="Day" filled readonly :value="dayValue" v-on="on" />
        </template>
        <v-date-picker @change="setDate" />
      </v-menu>
    </v-col>
    <v-col cols="12">
      <v-text-field v-model="start" v-mask="'##:##'" label="Start" filled />
    </v-col>
    <v-col cols="12">
      <v-text-field v-model="finish" v-mask="'##:##'" label="Finish" filled />
    </v-col>
    <v-col cols="12">
      <v-btn :disabled="disabled" @click="save">
        Save
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { TheMask } from 'vue-the-mask';
import { format, parse } from 'date-fns';
import { CreateWorkDay } from '../../graphql/mutation/createWorkDay';

export default {
  directives: {
    TheMask,
  },
  data() {
    return {
      dayMenu: false,

      start: '',
      finish: '',
    };
  },
  computed: {
    day: {
      get() {
        return this.$store.getters['workDay/getDay'];
      },
      set(value) {
        this.$store.commit('workDay/setDay', value);
      },
    },
    dayValue() {
      return format(this.day, 'dd/MM/yyyy');
    },
    disabled() {
      return this.start.length !== 5 || this.finish.length !== 5;
    },
  },
  methods: {
    setDate(value) {
      this.day = parse(value, 'yyyy-MM-dd', new Date());
      this.dayMenu = false;
    },
    save() {
      this.$apollo.mutate({
        mutation: CreateWorkDay,
        variables: {
          workDay: {
            day: this.day,
            start: this.start,
            finish: this.finish,
          },
        },
      }).then(() => {
        this.start = '';
        this.finish = '';
        this.$toast.show('Created', {
          duration: 1000,
        });
        this.$emit('input');
      });
    },
  },
};
</script>

<style>

</style>
