<template>
  <create v-model="loan" @input="edit" />
</template>

<script>
import create from '@/components/loan/loanCreate';
import { GetLoan } from '../../../graphql/query/getLoan';
import { EditLoan } from '../../../graphql/mutation/editLoan';

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
  created() {
    const { id } = this.$route.params;
    this.$apollo.query({
      query: GetLoan,
      variables: {
        id,
      },
    }).then((response) => {
      this.loan = response.data.GetLoan;
    });
  },
  methods: {
    edit() {
      const {
        id, name, total, interest, portions, advanceInterest,
      } = this.loan;
      this.$apollo.mutate({
        mutation: EditLoan,
        variables: {
          loan: {
            id,
            name,
            total: Number(total),
            interest: Number(interest),
            portions: Number(portions),
            advanceInterest: Number(advanceInterest),
          },
        },
      }).then(() => {
        this.$toast.show('Updated', {
          duration: 1000,
        });
        this.$router.push('/loans/');
      });
    },
  },
};
</script>

<style>

</style>
