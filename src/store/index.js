import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        contents: [],
    },
    getters: {
        getContents(state) {
            return state.contents
        },
        getSection: (state) => (id) => {
            return state.contents.find(section => section.id === id)
        },
        searchRules: (state) => (query) => {
            const occurances = []

            for (const section of state.contents) {
                for (const chapter of section.chapters) {
                    for (const rule of chapter.rules) {

                        if (rule.subRules.length > 0) {
                            for (const subRule of rule.subRules) {
                                if (subRule.content.toLowerCase().includes(query.toLowerCase())) {
                                    occurances.push({
                                        section: { name: section.name, id: section.id },
                                        chapter: { name: chapter.name, id: chapter.id },
                                        rule: rule.id,
                                        subRule: subRule.id,
                                        content: subRule.content
                                    });
                                }
                            }
                        } 

                        if(rule.content.toLowerCase().includes(query.toLowerCase())) {
                            occurances.push({
                                section: { name: section.name, id: section.id },
                                chapter: { name: chapter.name, id: chapter.id },
                                rule: rule.id,
                                content: rule.content
                            });
                        }
                    }
                }
            }

            return occurances
        }
    },
    mutations: {
        sortContents(state, payload) {
            let currentSection = 0;

            const containsLetters = /[a-z]/g;
            const numberedLines = /^\d{1,3}.+$/gm;

            const data = [];

            const lines = payload.matchAll(numberedLines)
            for (const match of lines) {
                const line = match[0];
                const id = line.split(' ')[0];
                const name = line.replace(id + ' ', '');

                if(parseInt(id) < 10) {

                    //We know that all the sections are singular values, under 10 in this case.
                    //We check whether the data array already has the section in it
                    if(!data.find(section => section.id === parseInt(id))) {
                        data.push({
                            id: parseInt(id),
                            name: name,
                            chapters: []
                        });
                    }

                    //Assign the currently looped section.
                    currentSection = parseInt(id) - 1;

                } else if(parseInt(id) >= 100 && id < 1000) {

                    //We know that the chapters start with 3 digit values, over or exactly 100 and under a 1000 in this case.
                    if(!data[currentSection].chapters.find(chapter => chapter.id === parseInt(id))) {
                        data[currentSection].chapters.push({
                            id: parseInt(id),
                            name: name,
                            rules: []
                        });
                    }

                } else {
                    //Now that we have ruled out the sections & chapters, we know that we only have the rules left to assign to the chapters.
                    const chapterId = id.split('.')[0];
                    const ruleId = id.split('.')[1];
                    const sectionIndex = data.findIndex(section => section.id == chapterId.charAt(0));
                    
                    const chapterIndex = data[sectionIndex].chapters.findIndex(chapter => chapter.id === parseInt(chapterId));

                    //Create our rules for the chapters and the sub rules under the main rules.
                    //We'll use regex to determine whether the rule id contains a letter or not. 
                    //If it does, then we know it's a sub rule. (A clarified rule)
                    if(!containsLetters.test(id)) {
                        //The rules only show up once, so we can directly push the rule into the chapter.
                        data[sectionIndex].chapters[chapterIndex].rules.push({
                            id: ruleId,
                            content: line.replace(id, ''),
                            subRules: []
                        });
                    } else {
                        //Letters were found in the rule's id, meaning that it is indeed a clarified rule and we can pass it to the rule's sub array.
                        const ruleIndex = data[sectionIndex].chapters[chapterIndex].rules.findIndex(rule => rule.id == parseInt(ruleId))
                        data[sectionIndex].chapters[chapterIndex].rules[ruleIndex].subRules.push({
                            id: ruleId,
                            content: line.replace(id, '')
                        });
                    }
                }
            }

            state.contents = data;
        }
    }
})
