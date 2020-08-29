<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab
          v-for="year in years"
          :key="year.value"
          @click="selectMonths(year)"
        >
          {{ year.value }}
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
import getDates from '@/mixins/getDates'
export default {
  mixins: [getDates],
  mounted() {
    const path = this.$route.path
    if (path === '/charts' && this.year.value)
      this.$router.push(`/charts/${this.year.value}`)
  },
  methods: {
    selectMonths(year) {
      this.$store.commit(
        'dates/setMonths',
        year.months.sort((a, b) => (a > b ? 1 : -1))
      )
      this.$router.push({
        path: `/charts/${year.value}`,
      })
    },
  },
}
</script>

<style></style>
