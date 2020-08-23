import Vue from 'vue'

import { format, parse } from 'date-fns'

Vue.filter('date', (value: string) => {
  return format(
    parse(value.split('T')[0], 'yyyy-MM-dd', new Date()),
    'dd/MM/yyyy'
  )
})
