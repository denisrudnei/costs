import Vue from 'vue'
import { format, parse } from 'date-fns'
import Dinero from 'dinero.js'

Vue.filter('date', (value: string) => {
  return format(
    parse(value.split('T')[0], 'yyyy-MM-dd', new Date()),
    'dd/MM/yyyy'
  )
})

Vue.filter('dinero', (value: string | number) => {
  return Dinero({
    amount: parseInt(value.toString(), 10) * 100,
    currency: 'BRL',
  })
    .setLocale(navigator.languages[0])
    .toFormat('$0.00')
})
