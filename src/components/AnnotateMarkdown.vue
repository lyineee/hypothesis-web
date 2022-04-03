<template>
  <div>
    <div class="note" v-if="!edit" v-html="markdownContent" />
    <textarea v-model="syncText" class="note-edit" v-if="edit"></textarea>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from "vue-property-decorator";
import { marked } from "marked";

@Component
export default class AnnotateMarkdown extends Vue {
  @PropSync("text") private syncText!: string;
  @Prop({ default: false }) private edit!: boolean;
  @Watch("edit")
  onEditChange(val: boolean) {
    this.edit = val;
    if (!this.edit) {
      this.markdownContent = marked.parse(this.syncText);
    }
  }
  markdownContent?: string;
  created() {
    this.markdownContent = marked.parse(this.syncText);
  }
}
</script>

<style lang="scss">
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
  pre {
    overflow: auto;
  }
}
.note-edit {
  max-width: 100%;
  min-width: 100%;
  height: 10em;
}
</style>