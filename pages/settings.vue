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
      <v-btn @click="save">
        Save
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import userSettings from '@/graphql/query/userSettings';
import createUserSettings from '@/graphql/mutation/createUserSettings';
import values from './settings-values.json';

export default {
  data() {
    return {
      currencies: [],
      locales: [],
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
    },
  },
};
</script>

<style></style>
