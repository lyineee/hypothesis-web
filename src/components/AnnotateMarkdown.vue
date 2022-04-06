<template>
  <div class="note-container">
    <div class="note" v-if="!edit" v-html="markdownContent" />
    <textarea v-model="syncText" class="note-edit" v-if="edit"></textarea>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from "vue-property-decorator";
import { marked } from "marked";
import hljs from "highlight.js";

@Component
export default class AnnotateMarkdown extends Vue {
  //TODO syntax highlighting
  @PropSync("text") private syncText!: string;
  @Prop({ default: false }) private edit!: boolean;
  markedOption: marked.MarkedOptions = {
    renderer: new marked.Renderer(),
    highlight: function (code: string, lang: string) {
      console.log("input: ", lang);
      const language = hljs.getLanguage(lang)?.name;
      console.log("result: ", language);
      if (!language) {
        console.log("use auto detect");
        return hljs.highlightAuto(code).value;
      } else {
        return hljs.highlight(code, { language }).value;
      }
    },
  };
  @Watch("edit")
  onEditChange(val: boolean) {
    this.edit = val;
    if (!this.edit) {
      this.markdownContent = marked.parse(this.syncText);
    }
  }
  markdownContent?: string;
  created() {
    marked.setOptions(this.markedOption);
    this.markdownContent = marked.parse(this.syncText);
  }
}
</script>

<style lang="scss">
@import "highlight.js/scss/github";
.note-container {
  margin: 0.5em 0 0;
}
.note {
  text-align: start;
  border: solid 2px hsl(0, 0%, 100%);
  background-color: hsl(0, 0%, 100%);
  padding-right: 2em;
  padding-left: 1em;
  h1 {
    font-size: 2em;
  }
  h2 {
    font-size: 1.7em;
  }
  h3 {
    font-size: 1.4em;
  }
  p {
    font-size: 1em;
  }
  img {
    width: 70%;
  }
  code {
    font-family: "Sans Mono", "Consolas", "Courier", monospace;
  }
  :not(pre) code {
    border-radius: 0.2em;
    font-size: 1em;
    padding: 0em 0.4em;
    background-color: hsl(0, 0%, 93%);
    color: hsl(0, 90%, 68%);
  }
  pre {
    overflow: auto;
    background-color: hsl(0, 0%, 95%);
    padding: 0.4em;
    border-radius: 0.2em;
    & > code {
      font-size: 0.8em;
    }
    @media print {
      overflow: hidden;
      white-space: normal;
    }
  }
}
.note-edit {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  max-width: 100%;
  min-width: 100%;
  font-size: 1em;
  height: 13em;
  border: 1px solid #dbdbdb;
  transition: box-shadow 0.1s;
  box-sizing: border-box;
  padding: .5em;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #59a7e8;
    background-color: white;
  }
}
</style>