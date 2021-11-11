<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-text>
          <v-btn @click="download">
            Get file to connect
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-title>Connect with QR Code</v-card-title>
        <v-card-text>
          <v-img :src="src" height="350" width="350" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      src: '',
    };
  },
  mounted() {
    this.getImage();
  },
  methods: {
    download() {
      this.$axios.get('/api/auth/connect', { responseType: 'blob' }).then((response) => {
        const file = new Blob([response.data]);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = 'connect.json';
        link.click();
      });
    },
    getImage() {
      this.$axios.get('/api/auth/qr', { responseType: 'blob' }).then((response) => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          this.src = fileReader.result;
        };

        fileReader.readAsDataURL(response.data);
      });
    },
  },

};
</script>

<style>

</style>
