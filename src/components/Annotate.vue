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
      <button class="edit-btn edit" v-if="!edit && editPermit" v-on:click="enterEdit">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
          <path
            d="M362.7 19.32C387.7-5.678 428.3-5.678 453.3 19.32L492.7 58.75C517.7 83.74 517.7 124.3 492.7 149.3L444.3 197.7L314.3 67.72L362.7 19.32zM421.7 220.3L188.5 453.4C178.1 463.8 165.2 471.5 151.1 475.6L30.77 511C22.35 513.5 13.24 511.2 7.03 504.1C.8198 498.8-1.502 489.7 .976 481.2L36.37 360.9C40.53 346.8 48.16 333.9 58.57 323.5L291.7 90.34L421.7 220.3z"
          />
        </svg>
      </button>
      <button class="edit-btn cancel-btn" v-if="edit" v-on:click="cancelEdit">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
          <path
            d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"
          />
        </svg>
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
    return this.data.permissions.update[0] == this.getUser();
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
      this.annoText = this.data.target[0].selector[2].exact;
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

.annotation-content {
  .quote-content {
    font-size: 0.9em;
    font-style: italic;
    line-height: 1.5em;
    padding-left: 0.4em;
    text-align: start;
    width: 70%;
    border-left: solid 3.5px theme.darken($background);
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
      color: $on-background;
      background-color: theme.darken($background, 2);
      transition: background-color 0.2s;
      &:hover {
        background-color: theme.darken($background, 5);
        cursor: pointer;
      }
      svg {
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
      top: -0.3em;
      height: 1.3em;
      background-color: inherit;
      color: $primary;
      padding: 0;
      @media (hover: hover) {
        opacity: 0; // hide edit icon when device can hover
      }
      &:hover {
        background-color: inherit;
        svg {
          fill: theme.darken($background, 8);
        }
      }
      svg {
        margin-right: 0;
        height: 100%;
        fill: theme.darken($background, 5);
      }
    }
    .save-btn {
      background-color: theme.darken(
        map-get(theme.$palette, "primary-variant"),
        10
      );
      color: map-get(theme.$palette, "on-dark");
      &:hover {
        background-color: theme.darken(
          map-get(theme.$palette, "primary-variant"),
          15
        );
      }
    }
  }
  &:hover {
    @media (hover: hover) {
      .edit {
        opacity: 1; // show edit icon when hover to anntation
      }
    }
    .quote-content {
      border-left: solid 3.5px $primary; // hight light quote content when hover
    }
  }
}
</style>