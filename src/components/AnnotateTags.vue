<template>
  <div class="tag-container">
    <div v-if="syncTags.length != 0" class="tag-space">
      <div class="tag" v-for="tag in syncTags" :key="tag">
        <div class="tag-text">
          {{ tag }}
        </div>
        <div v-if="edit" class="delete-span" v-on:click="deleteTag(tag)">
          <svg
            class="delete-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"
            />
          </svg>
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
    console.log(tag);
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
.tag-container {
  margin: 0.5em 0em;
}
.tag-space {
  // padding: 0.3em;
  display: flex;
  .tag {
    background-color: hsl(0, 0%, 95%);
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
    border: 1px solid #dbdbdb;
    border-radius: 2px;
    color: #737373;
    background-color: #fafafa;
    line-height: 1;
    width: 100%;
    transition: 0.1s;
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px #59a7e8;
      background-color: #fff;
    }
  }
}
</style>