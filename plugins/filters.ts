import Vue from 'vue';
import { format, parse, setMonth } from 'date-fns';
import Dinero from 'dinero.js';
import { Context } from '@nuxt/types';

Vue.filter('date', (value: string) => format(
  parse(value.split('T')[0], 'yyyy-MM-dd', new Date()),
  'dd/MM/yyyy',
));

Vue.filter('monthName', (value: number) => format(setMonth(new Date(), value - 1), 'MMM'));

export default (context: Context) => {
  Vue.filter('dinero', (value: string | number) => {
    const { currency, locale } = context.store.state.settings;
    return Dinero({
      amount: parseInt((parseFloat(value.toString()) * 100).toString(), 10),
      currency: currency || 'USD',
    })
      .setLocale(locale || '')
      .toFormat('$0.00');
  });
};
