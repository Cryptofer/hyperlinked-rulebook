<template>
  <div id="app">
    <div class="modal" v-if="modal">
      <form class="modal-content" @submit.prevent="fetchContents">
        <h1>Specify Rules URL</h1>
        <input type="text" placeholder="https://" v-model="url">
        <div>
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
      </form>
    </div>

    <Search />
    <References />
    <Contents />
  </div>
</template>

<script>
import Search from '@/components/Search'
import Contents from '@/components/Contents'
import References from '@/components/References'
export default {
  name: 'App',
  data() {
    return {
      modal: true,
      url: 'http://135.181.80.167:3001/rules.txt'
    }
  },
  methods: {
    async fetchContents() {
      await fetch(this.url)
      .then(response => response.text()) 
      .then(text => {
        this.$store.commit('sortContents', text);
      });

      this.modal = false;
    }
  },
  components: {
    Search,
    References,
    Contents
  }
}
</script>

<style>
@import './assets/main.css';
@import './assets/styles.css';
</style>
