<template>
  <aside class="contents">
    <div class="content">
      <div v-for="(section, index) in contents" :key="index">
        <h2 :id="section.id">{{ section.name }}</h2>
        <div v-for="(chapter, index) in section.chapters" :key="index">
          <h3 :id="chapter.id">{{ chapter.name }}</h3>
          <ul>
            <li v-for="(rule, index) in chapter.rules" :key="index" :id="`${chapter.id}.${rule.id}`">
              <span v-html="createHyperlinks(rule.content)"></span>
              <ul v-if="rule.subRules.length > 0">
                <li v-for="(subRule, index) in rule.subRules" :key="index" :id="`${chapter.id}.${subRule.id}`" v-html="createHyperlinks(subRule.content)"></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
    name: 'Contents',
    methods: {
      createHyperlinks(payload) {
        
        const matches = payload.matchAll(/(rule|rules|see)?\s\d{3}(\.?)(\d{1,3}([a-z]{1})?)?/g)
        for (const match of matches) {
          const rule = match[0].replace('rule ', '').replace('see ', '').replace('rules ', '').replace(' ', '')
          payload = payload.replace(rule, `<a href="#${rule}">${rule}</a>`)
        }

        return payload
      }
    },
    computed: {
      contents() {
        return this.$store.getters.getContents
      }
    }
}
</script>