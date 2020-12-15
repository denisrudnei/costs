<template>
  <v-row>
    <v-dialog v-model="displayCreate" width="75%">
      <v-card>
        <v-card-text>
          <create @input="createWorkDay" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-col cols="12" md="8">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  Worked Days: {{ workedDays }}
                </v-col>
                <v-col cols="12">
                  Workded Hours: {{ workedHours }}
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <v-calendar
                ref="calendar"
                v-model="today"
                :events="days"
                :type="type"
                @click:event="showEvent"
              />
              <v-menu v-model="selectedOpen" :activator="selectedElement" min-width="300px">
                <v-card v-if="selectedEvent">
                  <v-card-title>
                    {{ selectedEvent.name }}
                  </v-card-title>
                  <v-card-text>
                    {{ selectedEvent.start.substr(11, 5) }} | {{ selectedEvent.end.substr(11, 5) }}

                    <p>Hours: {{ hours }}</p>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn icon @click="removeEvent">
                      <v-icon>
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="4">
      <v-row>
        <v-col>
          <v-btn block @click="displayCreate = true">
            Add hours
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-select v-model="type" :items="types" filled label="Type" />
        </v-col>
        <v-col cols="12">
          <v-date-picker
            v-model="yearAndMonth"
            type="month"
            landscape
            full-width
            @change="setYearAndMonth"
          />
        </v-col>
        <v-col cols="12">
          <v-btn icon @click="prev">
            <v-icon>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn icon @click="next">
            <v-icon>
              mdi-chevron-right
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import {
  getYear, getMonth, differenceInHours, parse,
} from 'date-fns';
import create from '@/components/workSchedule/createWorkSchedule';
import { RemoveWorkDay } from '../../graphql/mutation/removeWorkDay';
import { GetWorkSchedule } from '~/graphql/query/getWorkSchedule';

export default {
  components: { create },
  data() {
    return {
      displayCreate: false,
      picker: undefined,
      year: undefined,
      month: undefined,
      yearAndMonth: undefined,
      today: '',
      selectedOpen: false,
      selectedEvent: null,
      selectedElement: null,
      type: 'month',
      workedDays: 0,
      workedHours: 0,
      types: [
        {
          text: 'Month',
          value: 'month',
        },
        {
          text: 'Week',
          value: 'week',
        },
        {
          text: 'Last 4 days',
          value: '4day',
        },
        {
          text: 'Day',
          value: 'day',
        },
      ],
      days: [],
    };
  },
  computed: {
    hours() {
      if (!this.selectedEvent) return '';
      const startInDate = parse(this.selectedEvent.start, 'yyyy-MM-dd HH:mm', new Date());
      const finishInDate = parse(this.selectedEvent.end, 'yyyy-MM-dd HH:mm', new Date());
      return Math.abs(differenceInHours(startInDate, finishInDate));
    },
  },
  created() {
    const today = new Date();
    this.year = getYear(today);
    this.month = getMonth(today) + 1;
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.$apollo.query({
        query: GetWorkSchedule,
        fetchPolicy: 'network-only',
        variables: {
          year: this.year,
          month: this.month,
        },
      }).then((response) => {
        const info = response.data.GetWorkSchedule;
        this.days = info.workDays.map((item) => ({
          name: `[${item.id}] - ${item.start}, ${item.finish}`,
          start: this.fmtTime(item.day, item.start),
          end: this.fmtTime(item.day, item.finish),
          id: item.id,
        }));
        this.workedDays = info.workedDays;
        this.workedHours = info.workedHours;
      });
    },
    createWorkDay() {
      this.displayCreate = false;
      this.fetchData();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    prev() {
      this.$refs.calendar.prev();
      this.setYearAndMonth(this.today.substring(0, 7));
    },
    next() {
      this.$refs.calendar.next();
      this.setYearAndMonth(this.today.substring(0, 7));
    },
    setYearAndMonth(value) {
      const [year, month] = value.split('-');
      const [,, day] = this.today.split('-');
      this.year = parseInt(year, 10);
      this.month = parseInt(month, 10);
      this.yearAndMonth = value;
      this.today = `${value}-${day || '01'}`;
      this.fetchData();
    },
    removeEvent() {
      this.$apollo.mutate({
        mutation: RemoveWorkDay,
        variables: {
          id: this.selectedEvent.id,
        },
      }).then(() => {
        this.fetchData();
        this.selectedEvent = null;
        this.$toast.show('Removed', {
          duration: 1000,
        });
      });
    },
    fmtTime(day, time) {
      return `${day.substr(0, 10)} ${time}`;
    },
  },
};
</script>

<style>

</style>
