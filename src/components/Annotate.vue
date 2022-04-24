<template>
  <div class="annotation-content">
    <div class="quote-content" v-if="annoText != ''">{{ annoText }}</div>
    <AnnotateMarkdown
      v-if="note != '' || edit"
      :text.sync="note"
      :edit="edit"
    />
    <AnnotateTags
      v-if="tags.length != 0 || edit"
      :tags.sync="tags"
      :edit="edit"
    />
    <div class="btn-container">
      <button
        class="edit-btn edit"
        v-if="!edit && editPermit"
        v-on:click="enterEdit"
      >
        <img src="../assets/edit.svg" />
      </button>
      <button class="edit-btn cancel-btn" v-if="edit" v-on:click="cancelEdit">
        <img src="../assets/cross.svg" />
        取消编辑
      </button>
      <button class="edit-btn save-btn" v-if="edit" v-on:click="saveEdit">
        保存
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins } from "vue-class-component";
import { Component, Prop, Vue } from "vue-property-decorator";
import AnnotateMarkdown from "./AnnotateMarkdown.vue";
import AnnotateTags from "./AnnotateTags.vue";
import HypoServiceMixin from "./HypoServiceMixin";
import { Annotation } from "./HypoServiceMixin";

@Component({
  components: {
    AnnotateMarkdown,
    AnnotateTags,
  },
})
export default class Annotate extends mixins(Vue, HypoServiceMixin) {
  @Prop() private data!: Annotation;
  edit = false;
  annoText = "";
  tags: Array<string> = [];
  note = "";
  get editPermit() {
    return (
      this.data.permissions.update[0] == this.getUser() && this.getToken() != ""
    );
  }
  enterEdit() {
    this.edit = true;
  }
  cancelEdit() {
    this.edit = false;
    this.tags = Array.from(this.data.tags);
    this.note = this.data.text;
  }
  saveEdit() {
    this.edit = false;
    const updatePayload = {
      text: this.note,
      tags: this.tags,
    };
    this.updateAnnotation(this.data.id, JSON.stringify(updatePayload))
      .then((resp) => {
        if (!resp.ok) {
          //TODO handle error
          console.error("update error", resp.status, resp.statusText);
          this.tags = Array.from(this.data.tags);
          this.note = this.data.text;
        }
        return resp.json();
      })
      .then((value) => {
        this.tags = Array.from(value.tags);
        this.note = value.text;
      })
      .catch((err) => {
        console.log("error occur", err);
      });
  }
  created() {
    if (this.data.target[0].selector) {
      this.annoText = this.data.target[0].selector[2].exact; //TODO fix error in pdf annotation
    }
    this.tags = Array.from(this.data.tags);
    this.note = this.data.text;
  }
}
</script>

<style scoped lang="scss">
@use "scss/theme";

$primary: map-get(theme.$palette, "primary");
$background: map-get(theme.$palette, "background");
$secondary: map-get(theme.$palette, "secondary");
$on-background: map-get(theme.$palette, "on-background");

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

.annotation-content {
  .quote-content {
    font-size: 0.9em;
    font-style: italic;
    line-height: 1.5em;
    padding-left: 0.4em;
    text-align: start;
    width: 70%;
    border-left: solid 3.5px var(--background-color-secondary-variant);
  }
  .btn-container {
    padding: 0.3em 0.5em 0.3em 0em;
    display: flex;
    justify-content: flex-end;
    @media print {
      display: none;
    }
    button {
      margin: 0px 0.5em 0 0;
      padding: 0.3em 1em;
      font-size: 1.2em;
      border: none;
      background-color: var(--background-color-primary-6);
      color: var(--foreground-color-1);
      transition: background-color 0.2s;
      &:hover {
        background-color: var(--background-color-primary-2);
        cursor: pointer;
      }
      img {
        position: relative;
        top: 4px;
        float: left;
        height: 0.9em;
        width: 0.9em;
        margin-right: 0.3em;
      }
    }
    .edit {
      position: relative;
      height: 1.3em;
      background: transparent;
      padding: 0;
      @media (hover: hover) {
        opacity: 0; // hide edit icon when device can hover
      }
      &:hover {
        background: transparent;
        opacity: 1;
      }
      img {
        margin-right: 0;
        height: 80%;
        opacity: 0.6;
      }
    }
    .save-btn {
      background-color: var(--accent-color-secondary-5);
      color: var(--background-color-primary);
      &:hover {
        background-color: var(--accent-color-secondary-3);
      }
    }
  }
  &:hover {
    @media (hover: hover) {
      .edit {
        opacity: 0.7; // show edit icon when hover to anntation
      }
    }
    .quote-content {
      border-left: solid 3.5px var(--accent-color-secondary); // hight light quote content when hover
    }
  }
}
</style>