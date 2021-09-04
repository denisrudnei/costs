<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-autocomplete
        v-model="settings.currency"
        :items="currencies"
        placeholder="Currency"
        filled
        clearable
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-autocomplete
        v-model="settings.locale"
        :items="locales"
        placeholder="Locale"
        filled
        clearable
      />
    </v-col>
    <v-col cols="12">
      <v-file-input
        v-model="file"
        filled
        label="Import file"
        accept="text/*"
        multiple
        @change="makeTable"
      />
      <v-row v-if="imported.length !== 0">
        <v-col cols="5">
          <v-select v-model="format" :items="formats" label="Format" filled @change="makeTable" />
        </v-col>
        <v-col cols="5">
          <v-select
            v-model="separator"
            :items="separators"
            label="Separators"
            filled
            @change="makeTable"
          />
        </v-col>
        <v-col cols="2">
          <v-checkbox v-model="merge" label="Merge with existing?" />
        </v-col>
        <v-col cols="12">
          <v-data-table :items="imported" :headers="headers" />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-btn @click="exportinfoDialog = true">
        Export data
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-btn @click="save">
        Save
      </v-btn>
    </v-col>
    <v-dialog v-model="exportinfoDialog" width="75%">
      <export-info />
    </v-dialog>
  </v-row>
</template>

<script>
import { format, parse } from 'date-fns';
import userSettings from '@/graphql/query/userSettings';
import createUserSettings from '@/graphql/mutation/createUserSettings';
import values from './settings-values.json';
import { Separators } from '~/server/enums/ImportFile/Separators';
import { Formats } from '~/server/enums/ImportFile/Formats';
import ExportInfo from '~/components/exportInfo.vue';

export default {
  components: {
    ExportInfo,
  },
  data() {
    return {
      exportinfoDialog: false,
      file: null,
      currencies: [],
      separator: Separators.SEMICOLON,
      formats: Object.values(Formats).map((item) => ({
        text: item,
        value: item,
      })),
      format: Formats.DAY_MONTH_YEAR,
      separators: Object.values(Separators).map((item) => ({
        text: item,
        value: item,
      })),
      merge: false,
      imported: [],
      locales: [],
      headers: [
        {
          text: 'Date',
          value: 'date',
        },
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Value',
          value: 'value',
        },
      ],
      settings: {
        locale: '',
        currency: '',
      },
    };
  },
  created() {
    this.currencies = values.currency;
    this.locales = Object.entries(values.locale).map((locale) => {
      const [value, text] = locale;
      return {
        text,
        value,
      };
    });
  },
  mounted() {
    this.$apollo
      .query({
        query: userSettings,
      })
      .then((response) => {
        this.settings.locale = response.data.UserSettings.locale;
        this.settings.currency = response.data.UserSettings.currency;
      });
  },
  methods: {
    toDate(text) {
      const dateFormat = this.format.toLowerCase();
      try {
        const date = parse(text, dateFormat, new Date());
        return format(date, dateFormat);
      } catch (e) {
        return text;
      }
    },
    makeTable() {
      if (!this.file) {
        this.imported = [];
        return;
      }
      this.imported = [];
      this.file.forEach((file) => {
        const fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.addEventListener('loadend', () => {
          const fullLines = fileReader.result.toString().split('\n');
          const linesWithColumns = fullLines.map(
            (line) => line.split(this.separator),
          ).filter((line) => line[0].length > 0);
          const items = linesWithColumns.map((line) => ({
            date: this.toDate(line[0]),
            name: line[1],
            value: line[2],
          }));
          const newItems = items.filter((item) => {
            const found = this.imported.find(
              (imported) => imported.name === item.name
              && imported.date === item.date
              && imported.value === item.value,
            );
            return !found;
          });
          this.imported = [
            ...this.imported,
            ...newItems,
          ];
        });
      });
    },
    save() {
      this.$apollo
        .mutate({
          mutation: createUserSettings,
          variables: {
            userSettings: this.settings,
          },
          refetchQueries: [
            {
              query: userSettings,
            },
          ],
          awaitRefetchQueries: true,
        })
        .then((response) => {
          const { currency, locale } = response.data.CreateUserSettings;
          this.$store.commit('settings/setCurrency', currency);
          this.$store.commit('settings/setLocale', locale);
          this.$toast.show('Settgings updated', {
            duration: 2500,
          });
        });

      if (this.file !== null) {
        this.$toast.show('Uploading file...', { duration: 1000 });
        const form = new FormData();
        this.file.forEach((file) => {
          form.append('file', file);
        });

        form.append('separator', this.separator);
        form.append('format', this.format);
        form.append('merge', this.merge);

        this.$axios.post('/api/import', form)
          .then(() => {
            this.$toast.show('File uploaded', {
              duration: 5000,
            });
          })
          .catch(() => {
            this.$toast.error('Failed to upload file', {
              duration: 5000,
            });
          });
      }
    },
  },
};
</script>

<style></style>
