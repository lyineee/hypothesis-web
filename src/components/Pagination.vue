<template>
  <div class="pagenation-container">
    <button class="page-btn btn-prev" @click="page = pageNumber - 1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="12"
        class="svg-icon"
      >
        <path
          d="m3.414 6 3.293 3.293.707.707L6 11.414l-.707-.707-4-4L.586 6l.353-.354.354-.353 4-4L6 .586 7.414 2l-.707.707z"
          fill-rule="evenodd"
        ></path>
      </svg>
    </button>
    <div class="page-container">
      <button
        class="page-btn page-number"
        v-for="n in pageList"
        :key="n"
        @click="page = n"
      >
        {{ n }}
      </button>
    </div>
    <button class="page-btn btn-next" @click="page = pageNumber + 1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="12"
        class="svg-icon"
      >
        <path
          d="M4.586 6 1.293 9.293.586 10 2 11.414l.707-.707 4-4L7.414 6l-.353-.354-.354-.353-4-4L2 .586.586 2l.707.707z"
          fill-rule="evenodd"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component
export default class AnnotateTags extends Vue {
  @Prop({ type: Number }) private total!: number;
  get pageList() {
    return [...Array(this.total).keys()].map((v) => v + 1);
  }
  pageNumber!: number;
  set page(val: number) {
    this.pageNumber = val;
    this.pageUpdate(val);
  }
  get page() {
    return this.pageNumber;
  }
  @Emit("pageUpdate")
  pageUpdate(page: number) {
    const search = window.location.search.replace(/page=\d+/, `page=${page}`);
    // window.location.search = search;
    window.history.pushState(
      { page: this.page },
      "",
      location.pathname + search
    );
  }
  created() {
    const capGroup = window.location.search.match(/page=(\d+)/);
    if (capGroup && capGroup.length == 2) {
      this.page = Number.parseInt(capGroup[1]);
    } else {
      this.page = 1;
    }
  }
}
</script>

<style scoped lang="scss">
.pagenation-container {
  button {
  }
}
</style>