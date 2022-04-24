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
      const language = hljs.getLanguage(lang)?.name;
      if (!language) {
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
:root[data-theme="dark"] {
  @import "highlight.js/scss/github-dark";
}
.note-container {
  margin: 0.5em 0 0;
}
.note {
  background: var(--background-color-primary);
  text-align: start;
  border: solid 2px var(--background-color-primary);
  padding-right: 2em;
  padding-left: 1em;
  h1:last-child,
  h2:last-child {
    border-bottom: none;
  }
  h1,
  h2,
  h3 {
    margin-bottom: 0.1em;
  }
  h1 {
    font-size: 2em;
    padding-bottom: 0.2em;
    border-bottom: 2px solid var(--background-color-primary-7);
  }
  h2 {
    font-size: 1.7em;
    padding-bottom: 0.1em;
    border-bottom: 1px solid var(--background-color-primary-7);
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
    background-color: var(--background-color-primary-6);
    color: var(--accent-color-primary-8);
  }
  pre {
    overflow: auto;
    background-color: var(--background-color-primary-7);
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
  blockquote {
    border-left: solid 4px var(--accent-color-secondary-15);
    opacity: 0.8;
    margin-left: 0.5em;
    background: var(--background-color-primary-9);
    padding: 0.2em 0em 0.2em 0.5em;
    p {
      margin: 0.4em 0px;
    }
  }
}
.note-edit {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  max-width: 100%;
  min-width: 100%;
  font-size: 1em;
  height: 13em;
  border: 1px solid var(--background-color-primary-5);
  color: var(--foreground-color-secondary);
  background-color: var(--background-color-primary);
  transition: box-shadow 0.1s;
  box-sizing: border-box;
  padding: 0.5em;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--accent-color-secondary-7);
    background-color: var(--background-color-primary);
    color: var(--foreground-color-secondary);
  }
}
</style>