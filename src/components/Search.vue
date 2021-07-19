<template>
  <aside class="search">
    <div class="content">
      <div class="search">
        <form class="form" @submit.prevent="search">
          <input type="text" placeholder="Search..." v-model="query">
          <button type="submit" class="btn btn-primary">Search Rules</button>
        </form>
        <div class="search-results">
          <a :href="`#${result.chapter.id}.` + (result.subRule ? result.subRule : result.rule)" class="search-result" v-for="(result, index) in results" :key="index">
            <b>{{ result.chapter.name }}</b>
            <p>{{ result.content.substr(0, 150) + (result.content.length > 150 ? "..." : "") }}</p>
          </a>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      query: null,
      results: []
    }
  },
  methods: {
    search() {
      if(this.query.length > 5) {
        this.results = this.$store.getters.searchRules(this.query);
      }
    }
  }
}
</script>

