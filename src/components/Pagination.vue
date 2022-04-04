<template>
  <ul class="pagenation-container">
    <li>
      <a
        class="page-btn btn-prev"
        :class="pageList[0] == 1 ? 'disable' : ''"
        @click.prevent="pageList[0] == 1 ? '' : (page = pageNumber - 1)"
      >
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
      </a>
    </li>
    <li v-if="pageList[0] != 1">
      <a class="page-btn" @click.prevent="page = 1">1</a>
    </li>
    <li v-if="pageList[0] != 1">...</li>
    <li v-for="n in pageList" :key="n">
      <a
        class="page-btn"
        :class="n == page ? 'disable' : ''"
        @click.prevent="n != page ? (page = n) : ''"
        >{{ n }}</a
      >
    </li>
    <li v-if="pageList[pageList.length - 1] != total">...</li>
    <li>
      <a
        class="page-btn btn-next"
        :class="page == total ? 'disable' : ''"
        @click.prevent="page != total ? (page = pageNumber + 1) : ''"
      >
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
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component
export default class AnnotateTags extends Vue {
  maxPage = 4;
  @Prop({ type: Number }) private total!: number;
  get pageList() {
    let start = this.page > this.maxPage ? this.page - this.maxPage : 1;
    if (start > this.total) {
      start = this.total;
    }
    const count =
      start + this.maxPage * 2 > this.total
        ? this.total - start + 1
        : this.maxPage * 2;
    return [...Array(count).keys()].map((v) => v + start);
  }
  pageNumber = 1; //if not assign an initail value, pageNumber will be immutable. I can not figure out why.
  set page(val: number) {
    this.pageNumber = val;
    this.pageUpdate(val);
  }
  get page() {
    // current page, start from 1
    return this.pageNumber;
  }
  @Emit("pageUpdate")
  pageUpdate(page: number) {
    let search = window.location.search;
    if (!window.location.search.match(/page=\d+/)) {
      if (window.location.search) {
        search += `&page=${page}`;
      } else {
        search += `?page=${page}`;
      }
    } else {
      search = search.replace(/page=\d+/, `page=${page}`);
    }
    window.history.pushState(
      { page: this.page },
      "",
      location.pathname + search
    );
  }
  created() {
    const capGroup = window.location.search.match(/page=(\d+)/);
    if (capGroup && capGroup.length == 2) {
      const page = Number.parseInt(capGroup[1]);
      if (page < 1) {
        this.page = 1;
      } else {
        this.page = page;
      }
    } else {
      this.page = 1;
    }
  }
}
</script>

<style scoped lang="scss">
.pagenation-container {
  display: flex;
  list-style: none;
  padding: 0px;
  justify-content: center;
  user-select: none;
  @media print {
    display: none;
  }
  li {
    margin: 0 0.2em;
    .page-btn {
      cursor: pointer;
      padding: 0.4em 0.7em;
      border-radius: 9%;
      transition: background-color 0.1s;
      &:hover {
        background-color: hsl(0, 0%, 80%);
      }
    }
    .page-btn.disable {
      background-color: hsl(0, 0%, 80%);
      cursor: default;
    }
    .btn-next.disable,
    .btn-prev.disable {
      background-color: hsl(0, 0%, 80%);
      fill: hsl(0, 0%, 65%);
      cursor: default;
      &:hover {
        background-color: hsl(0, 0%, 80%);
        fill: hsl(0, 0%, 65%);
      }
    }
    .btn-next,
    .btn-prev {
      padding: 0.4em 0.7em;
      background-color: hsl(0, 0%, 80%);
      transition: background-color 0.2s, fill 0.2s;
      &:hover {
        fill: white;
        background-color: hsl(0, 90%, 70%);
      }
    }
  }
}
</style>