<template>
  <v-row>
    <v-col cols="12">
      <v-menu v-model="dayMenu" :close-on-content-click="false" max-width="290px">
        <template v-slot:activator="{ on }">
          <v-text-field label="Day" filled readonly :value="dayValue" v-on="on" />
        </template>
        <v-date-picker @change="setDate" />
      </v-menu>
    </v-col>
    <v-col cols="12">
      <v-menu v-model="startMenu" :close-on-content-click="false" max-width="290px" offset-y>
        <template v-slot:activator="{ on }">
          <v-text-field label="Start" filled readonly :value="start" v-on="on" />
        </template>
        <v-time-picker
          :value="start"
          @input="setTime($event, 'start')"
          @change="closeTime('start')"
        />
      </v-menu>
    </v-col>
    <v-col cols="12">
      <v-menu v-model="finishMenu" :close-on-content-click="false" max-width="290px" offset-y>
        <template v-slot:activator="{ on }">
          <v-text-field label="Finish" filled readonly :value="finish" v-on="on" />
        </template>
        <v-time-picker
          :value="finish"
          @input="setTime($event, 'finish')"
          @change="closeTime('finish')"
        />
      </v-menu>
    </v-col>
    <v-col cols="12">
      <v-btn :disabled="disabled" @click="save">
        Save
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { format, parse } from 'date-fns';
import { CreateWorkDay } from '../../graphql/mutation/createWorkDay';

export default {
  data() {
    return {
      dayMenu: false,
      startMenu: false,
      finishMenu: false,
      day: new Date(),
      start: '',
      finish: '',
    };
  },
  computed: {
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
    setTime(value, type) {
      this[type] = value;
    },
    closeTime(type) {
      this[`${type}Menu`] = false;
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
