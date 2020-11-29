<template>
  <v-row>
    <v-col md="8" cols="12">
      <v-row>
        <v-col cols="12" md="12">
          <v-text-field v-model="forecast.name" placeholder="Name" filled />
        </v-col>
        <v-col cols="12" md="5">
          <v-menu v-model="menuStart" max-width="290px" :close-on-content-click="false">
            <v-date-picker :value="start" @input="updateStart" />
            <template #activator="{on}">
              <v-text-field
                label="Start date"
                filled
                :value="startFormatted"
                readonly
                v-on="on"
              />
            </template>
          </v-menu>
        </v-col>
        <v-col cols="12" md="5">
          <v-menu v-model="menuEnd" max-width="290px" :close-on-content-click="false">
            <v-date-picker :value="end" :allowed-dates="allowedEnd" @input="updateEnd" />
            <template #activator="{ on }">
              <v-text-field
                label="End date"
                filled
                :value="endFormatted"
                readonly
                v-on="on"
              />
            </template>
          </v-menu>
        </v-col>
        <v-col cols="2">
          <v-checkbox
            v-model="forecast.indeterminate"
            label="No deadline"
            @change="setIndeterminate"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select v-model="forecast.type" filled :items="types" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="forecast.value" placeholder="Value" filled type="number" />
        </v-col>
      </v-row>
    </v-col>
    <v-col md="4" cols="12">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              {{ forecast.name }}
            </v-card-title>
            <v-card-text>
              <p>Start: {{ start | date }}</p>
              <p>End: {{ end | date }}</p>
              <p>Value per month: {{ Number(forecast.value) | dinero }}</p>
              <p>Months: {{ months }}</p>
              <p>Total value: {{ Number(total) | dinero }}</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-btn block @click="showImportModal">
            Import from cost
            <v-icon right>
              mdi-database-import
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col>
      <v-btn @click="save">
        Save
      </v-btn>
    </v-col>
    <v-dialog v-model="importModal" width="95%" scrollable>
      <v-card>
        <v-card-title>
          <v-text-field v-model="search" filled label="Search" />
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-row>
                <v-col v-for="cost in costs" :key="cost.id" md="3" cols="12">
                  <v-card>
                    <v-card-title>
                      <span>
                        <v-checkbox
                          v-model="selectedToImport"
                          :value="cost.id"
                          :label="cost.name"
                        />
                      </span>
                    </v-card-title>
                    <v-card-text>
                      <h2>
                        Type: {{ cost.type }}
                      </h2>
                      <h3>Value: {{ cost.value | dinero }}</h3>
                      <p>Date {{ cost.date | date }}</p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="selectedToImport && getSelected(selectedToImport)" md="4" cols="12">
              <v-card>
                <v-card-title>
                  {{ getSelected(selectedToImport).name }}
                </v-card-title>
                <v-card-text>
                  <h2>
                    Type: {{ getSelected(selectedToImport).type }}
                  </h2>
                  <h3>Value: {{ getSelected(selectedToImport).value | dinero }}</h3>
                  <p>Date {{ getSelected(selectedToImport).date | date }}</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="!getSelected(selectedToImport)" @click="importSelected">
            Import
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import {
  parse, format, isAfter, addMonths,
} from 'date-fns';
import forecasts from '@/mixins/forecasts';
import costs from '@/graphql/query/costs';

export default {
  mixins: [forecasts],
  props: {
    value: {
      type: Object,
      default: () => ({
        name: '',
        indeterminate: false,
        start: new Date(),
        end: new Date(),
        value: 0,
        type: 'PROFIT',
      }),
    },
  },
  data() {
    return {
      menuStart: false,
      menuEnd: false,
      costsData: [],
      search: '',
      selectedToImport: undefined,
      importModal: false,
      types: ['PROFIT', 'SPENT'],
      forecastData: {
        name: '',
        indeterminate: false,
        start: new Date(),
        end: new Date(),
        value: 0,
        type: 'PROFIT',
      },
    };
  },
  computed: {
    start() {
      return this.forecast.start.toISOString().substr(0, 10);
    },
    end() {
      return this.forecast.end.toISOString().substr(0, 10);
    },
    startFormatted() {
      return format(this.forecast.start, 'dd/MM/yyyy');
    },
    endFormatted() {
      return format(this.forecast.end, 'dd/MM/yyyy');
    },
    months() {
      return this.getMonths(this.start, this.end);
    },
    costs() {
      return this.costsData
        .filter((cost) => cost.name.toLowerCase().includes(this.search.toLowerCase()));
    },
    total() {
      return this.forecast.value * this.months;
    },
    forecast() {
      return Object.assign(this.value, this.forecastData);
    },
  },
  methods: {
    updateStart(value) {
      this.forecast.start = parse(value, 'yyyy-MM-dd', new Date());
      this.menuStart = false;
    },
    updateEnd(value) {
      this.forecast.end = parse(value, 'yyyy-MM-dd', new Date());
      this.menuEnd = false;
    },
    allowedEnd(value) {
      return isAfter(parse(value, 'yyyy-MM-dd', new Date()), this.forecast.start);
    },
    showImportModal() {
      this.importModal = true;
      this.$apollo.query({
        query: costs,
      }).then((response) => {
        this.costsData = response.data.Costs;
      });
    },
    setIndeterminate(value) {
      if (value) {
        this.forecast.end = addMonths(this.forecast.start, 12);
      }
    },
    importSelected() {
      const value = this.getSelected(this.selectedToImport);
      const date = parse(value.date.substr(0, 10), 'yyyy-MM-dd', new Date());
      this.forecastData = {
        name: value.name,
        value: value.value,
        indeterminate: false,
        start: date,
        type: value.type,
        end: addMonths(date, 12),
      };
      this.importModal = false;
    },
    getSelected(selected) {
      return this.costs.find((cost) => cost.id === selected);
    },
    save() {
      this.$emit('input', this.forecast);
    },
  },
};
</script>
