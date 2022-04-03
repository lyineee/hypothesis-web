<template>
  <div class="annotation-content">
    <div class="quote-content" :v-if="annoText != ''">{{ annoText }}</div>
    <AnnotateMarkdown :text.sync="note" v-if="note != ''" :edit="edit" />
    <AnnotateTags
      v-if="tags.length != 0 || edit"
      :tags.sync="tags"
      :edit="edit"
    />
    <div class="btn-container">
      <button class="edit-btn edit-btn" v-if="!edit" v-on:click="enterEdit">
        <svg
          class="btn-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
          <path
            d="M490.3 40.4C512.2 62.27 512.2 97.73 490.3 119.6L460.3 149.7L362.3 51.72L392.4 21.66C414.3-.2135 449.7-.2135 471.6 21.66L490.3 40.4zM172.4 241.7L339.7 74.34L437.7 172.3L270.3 339.6C264.2 345.8 256.7 350.4 248.4 353.2L159.6 382.8C150.1 385.6 141.5 383.4 135 376.1C128.6 370.5 126.4 361 129.2 352.4L158.8 263.6C161.6 255.3 166.2 247.8 172.4 241.7V241.7zM192 63.1C209.7 63.1 224 78.33 224 95.1C224 113.7 209.7 127.1 192 127.1H96C78.33 127.1 64 142.3 64 159.1V416C64 433.7 78.33 448 96 448H352C369.7 448 384 433.7 384 416V319.1C384 302.3 398.3 287.1 416 287.1C433.7 287.1 448 302.3 448 319.1V416C448 469 405 512 352 512H96C42.98 512 0 469 0 416V159.1C0 106.1 42.98 63.1 96 63.1H192z"
          />
        </svg>
        编辑
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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import AnnotateMarkdown from "./AnnotateMarkdown.vue";
import AnnotateTags from "./AnnotateTags.vue";

@Component({
  components: {
    AnnotateMarkdown,
    AnnotateTags,
  },
})
export default class Annotate extends Vue {
  @Prop() private data: any;
  edit = false;
  annoText = "";
  tags: Array<string> = [];
  note = "";
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
    //TODO handle update
  }
  onTagsChange(tags: Array<string>) {
    console.log(tags);
  }
  created() {
    if (this.data.target[0].selector) {
      this.annoText =
        this.data.target[0].selector[
          this.data.target[0].selector.length - 1
        ].exact;
    }
    this.tags = Array.from(this.data.tags);
    this.note = this.data.text;
  }
}
</script>

<style scoped lang="scss">
.annotation-content {
  //   border: solid 2px hsl(0, 0%, 100%);
  //   background-color: hsl(0, 0%, 100%);
  margin-top: 1em;
  .quote-content {
    font-size: 0.9em;
    font-style: italic;
    line-height: 1.5em;
    padding-left: 0.4em;
    text-align: start;
    width: 70%;
    border-left: solid 3.5px hsla(209, 0%, 64%, 0.5);
    &:hover {
      border-left: solid 3.5px hsl(204, 100%, 80%);
    }
  }
  .btn-container {
    padding: 0.3em 0.5em 0.3em 0em;
    display: flex;
    justify-content: flex-end;
    button {
      margin: 0px 0.5em 0 0;
      padding: 0.3em 1em;
      font-size: 1.2em;
      border: none;
      color: hsl(0, 0%, 0%);
      background-color: hsl(0, 0%, 90%);
      transition: background-color 0.2s;
      &:hover {
        background-color: hsl(0, 0%, 85%);
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
    .save-btn {
      background-color: hsl(0, 0%, 40%);
      color: hsl(0, 0%, 95%);
      &:hover {
        background-color: hsl(0, 0%, 20%);
      }
    }
  }
}
</style>