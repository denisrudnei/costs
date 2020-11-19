/* eslint-disable consistent-return */
import { Context } from '@nuxt/types';

export default ({ store, redirect }: Context) => {
  if (!store.state.auth.user.role || store.state.auth.user.role !== 'ADMIN') {
    return redirect('/');
  }
};
