<template>
  <create v-model="loan" @input="save" />
</template>

<script>
import create from '@/components/loan/loanCreate';
import { GetLoans } from '~/graphql/query/getLoans';
import { CreateLoan } from '../../graphql/mutation/createLoan';

export default {
  components: {
    create,
  },
  data() {
    return {
      loan: {
        name: '',
        total: 0,
        interest: 0,
        portions: 0,
        advanceInterest: 0,
      },
    };
  },
  methods: {
    save(value) {
      const {
        total, interest, portions, advanceInterest, name,
      } = value;
      this.$apollo.mutate({
        mutation: CreateLoan,
        variables: {
          loan: {
            name,
            total: Number(total),
            portions: Number(portions),
            interest: Number(interest),
            advanceInterest: Number(advanceInterest),
          },
        },
        awaitRefetchQueries: true,
        refetchQueries: [{
          query: GetLoans,
        }],
      }).then(() => {
        this.$toast.show('Created', {
          duration: 1000,
        });
        this.$router.push('/loans');
      });
    },
  },
};
</script>

<style>

</style>
