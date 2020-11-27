import Vue from 'vue';
import { format, parse, setMonth } from 'date-fns';
import Dinero, { Currency } from 'dinero.js';
import { Context } from '@nuxt/types';

export const dineroFormatter = (value: string | number, currency: Currency = 'USD', locale: string) => Dinero({
  amount: parseInt((parseFloat(value.toString()) * 100).toString(), 10),
  currency,
})
  .setLocale(locale || '')
  .toFormat('$0.00');

Vue.filter('date', (value: string | Date) => {
  if (typeof value === 'string') {
    return format(
      parse(value.split('T')[0], 'yyyy-MM-dd', new Date()),
      'dd/MM/yyyy',
    );
  }
  return format(
    parse(value.toISOString().split('T')[0], 'yyyy-MM-dd', new Date()),
    'dd/MM/yyyy',
  );
});

Vue.filter('monthName', (value: number) => format(setMonth(new Date(), value - 1), 'MMM'));

export default (context: Context) => {
  const { currency, locale } = context.store.state.settings;
  Vue.filter('dinero', (value: string | number) => dineroFormatter(value, currency !== '' ? currency : 'USD', locale));
};
