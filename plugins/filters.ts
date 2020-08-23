import Vue from 'vue'
import { format, parse } from 'date-fns'
import Dinero from 'dinero.js'
import { Context } from '@nuxt/types'

Vue.filter('date', (value: string) => {
  return format(
    parse(value.split('T')[0], 'yyyy-MM-dd', new Date()),
    'dd/MM/yyyy'
  )
})

export default (context: Context) => {
  Vue.filter('dinero', (value: string | number) => {
    const { currency, locale } = context.store.state.settings
    return Dinero({
      amount: parseInt(value.toString(), 10) * 100,
      currency: currency || 'USD',
    })
      .setLocale(locale || '')
      .toFormat('$0.00')
  })
}
