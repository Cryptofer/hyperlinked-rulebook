<template>
  <aside class="references">
    <div class="content">
      <h1>Table of Contents</h1>
      <div v-for="(section, index) in contents" :key="index">
        <h2><a :href="'#' + section.id">{{ section.name }}</a></h2>
        <ul>
          <li v-for="(chapter, index) in section.chapters" :key="index"><a :href="'#' + chapter.id">{{ chapter.name }}</a></li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
    computed: {
      contents() {
        return this.$store.getters.getContents
      }
    }
}
</script>

<style>

</style>