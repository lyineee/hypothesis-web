<template>
  <div class="tag-container">
    <div v-if="syncTags.length != 0" class="tag-space">
      <div class="tag" v-for="tag in syncTags" :key="tag">
        <div class="tag-text">
          {{ tag }}
        </div>
        <div v-if="edit" class="delete-span" v-on:click="deleteTag(tag)">
          <img class="delete-svg" src="../assets/cross.svg" />
        </div>
      </div>
    </div>
    <div v-if="edit" class="new-tag">
      <input type="text" v-model="newTag" @keydown.enter="pushTag(newTag)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from "vue-property-decorator";

@Component
export default class AnnotateTags extends Vue {
  @Prop({ default: false }) private edit!: boolean;
  @PropSync("tags") syncTags!: Array<string>;
  newTag = "";
  deleteTag(tag: string) {
    this.syncTags.splice(this.syncTags.indexOf(tag), 1);
  }
  pushTag(val: string) {
    if (val != "") {
      this.syncTags.push(val);
    }
    this.newTag = "";
  }
}
</script>

<style scoped lang="scss">
@use "scss/theme";
$background-color-primary: map-get(theme.$palette, "background-color-primary");
$background-color-secondary: map-get(
  theme.$palette,
  "background-color-secondary"
);
$background-color-secondary-variant: map-get(
  theme.$palette,
  "background-color-secondary-variant"
);
$foreground-color-primary: map-get(theme.$palette, "foreground-color-primary");
$foreground-color-primary-variant: map-get(
  theme.$palette,
  "foreground-color-primary-variant"
);
$accent-color: map-get(theme.$palette, "accent-color");
$accent-color-variant: map-get(theme.$palette, "accent-color-variant");
$accent-color-secondary: map-get(theme.$palette, "accent-color-secondary");
$accent-color-secondary-variant: map-get(
  theme.$palette,
  "accent-color-secondary-variant"
);
$text-color-primary: map-get(theme.$palette, "text-color-primary");
$text-color-secondary: map-get(theme.$palette, "text-color-secondary");

.tag-container {
  margin: 0.5em 0em;
}
.tag-space {
  // padding: 0.3em;
  display: flex;
  .tag {
    background-color: $background-color-secondary-variant;
    margin: 0 0.3em;
    padding: 0.2em 0.5em;
    display: flex;
    @media print {
      border: solid 0.3px hsl(0, 0%, 70%);
    }
    .delete-span {
      padding-left: 0.3em;
      border-left: solid 0.2px;
      margin-left: 0.3em;
      align-self: center;
      display: block;
      width: 0.6em;
      height: 1em;
      cursor: pointer;
    }
  }
}
.new-tag {
  margin: 0.5em 1em 0em 0em;
  input {
    font-weight: normal;
    font-size: 13px;
    padding: 0.5em 0.75em;
    border: 1px solid var(--background-color-primary-5);
    border-radius: 2px;
    color: var(--foreground-color-secondary);
    background-color: var(--background-color-primary-9);
    line-height: 1;
    width: 100%;
    transition: 0.1s;
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--accent-color-secondary-7);
      background-color: var(--background-color-primary);
    }
  }
}
</style>