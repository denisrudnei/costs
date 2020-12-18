<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-select v-model="type" :items="types" filled label="Type" />
        </v-col>
        <v-col cols="12" md="6">
          <v-select v-model="separator" :items="separators" filled label="Separator" />
        </v-col>
        <v-col cols="12">
          <v-menu v-model="startMenu" max-width="290px" :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-text-field filled label="Start" readonly :value="formatDate(start)" v-on="on" />
            </template>
            <v-date-picker @change="setDate($event, 'start')" />
          </v-menu>
        </v-col>
        <v-col cols="12">
          <v-menu v-model="finishMenu" max-width="290px" :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-text-field filled label="Finish" readonly :value="formatDate(finish)" v-on="on" />
            </template>
            <v-date-picker @change="setDate($event, 'finish')" />
          </v-menu>
        </v-col>
        <v-col cols="12">
          <v-btn @click="exportData">
            Export
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { format, parse } from 'date-fns';
import { Separators } from '~/server/enums/ImportFile/Separators';
import { Type } from '~/server/enums/ExportFile/Type';

export default {
  data() {
    return {
      type: 'Cost',
      startMenu: false,
      finishMenu: false,
      separator: ';',
      types: [],
      separators: [],
      start: new Date(),
      finish: new Date(),
    };
  },
  created() {
    this.separators = Object.values(Separators);
    this.types = Object.values(Type);
  },
  methods: {
    setDate(value, type) {
      this[type] = parse(value, 'yyyy-MM-dd', new Date(0));
      this[`${type}Menu`] = false;
    },
    formatDate(value) {
      return format(value, 'dd/MM/yyyy');
    },
    exportData() {
      this.$axios.post('/api/export', {
        start: this.start,
        finish: this.finish,
        type: this.type,
        separator: this.separator,
      }).then((response) => {
        const a = document.createElement('a');
        a.setAttribute('download', `${this.type}-${new Date().toISOString().substr(0, 10)}.txt`);
        a.setAttribute('href', `data:text/plain;chartset=utf-8,${encodeURIComponent(response.data)}`);
        document.querySelector('body').appendChild(a);
        a.click();
      });
    },
  },
};
</script>

<style>

</style>
