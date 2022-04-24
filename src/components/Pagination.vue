<template>
  <ul class="pagenation-container">
    <li>
      <a
        class="page-btn btn-prev"
        ref="btn-prev"
        :class="page == 1 ? 'disable' : ''"
        @click.prevent="page != 1 ? (page = pageNumber - 1) : ''"
      >
        <svg width="8" height="12">
          <use xlink:href="../assets/leftarrow.svg#leftarrow"></use>
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
        ref="btn-next"
        :class="page == total ? 'disable' : ''"
        @click.prevent="page != total ? (page = pageNumber + 1) : ''"
      >
        <svg width="8" height="12">
          <use xlink:href="../assets/leftarrow.svg#leftarrow"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  InjectReactive,
  Prop,
  Ref,
  Vue,
} from "vue-property-decorator";
import KeyboardService from "./KeyboardService";

@Component
export default class AnnotateTags extends Vue {
  maxPage = 4;
  @Ref("btn-prev") btnPrev!: HTMLElement;
  @Ref("btn-next") btnNext!: HTMLElement;
  @InjectReactive() keyboardService!: KeyboardService;
  @Prop({ type: Number }) private total!: number;
  @Prop() pageNumber!: number; //if not assign an initail value, pageNumber will be immutable. I can not figure out why.
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
  set page(val: number) {
    this.pageUpdate(val);
  }
  get page() {
    // current page, start from 1
    return this.pageNumber;
  }
  @Emit("pageUpdate")
  pageUpdate(page: number) {
    return page;
  }
  onMediaChange(mql: MediaQueryListEvent) {
    this.maxPage = mql.matches ? 2 : 4;
  }
  created() {
    this.page = this.pageNumber;
    this.maxPage = window.matchMedia("(max-width: 400px)").matches ? 2 : 4;
    window
      .matchMedia("(max-width: 400px)")
      .addEventListener("change", this.onMediaChange);
    this.keyboardService.register(
      "ArrowLeft",
      (() => {
        return () => {
          this.btnPrev.click();
        };
      })()
    );
    this.keyboardService.register(
      "ArrowRight",
      (() => {
        return () => {
          this.btnNext.click();
        };
      })()
    );
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
      fill: var(--foreground-color-primary-10);
      &:hover {
        background-color: var(--background-color-primary-3);
      }
    }
    .page-btn.disable {
      background-color: var(--background-color-primary-3);
      cursor: default;
    }
    .btn-next.disable,
    .btn-prev.disable {
      background-color: var(--background-color-primary-3);
      fill: var(--foreground-color-primary-10);
      cursor: default;
      &:hover {
        background-color: var(--background-color-primary-3);
        fill: var(--foreground-color-primary-10);
      }
    }
    .btn-next {
      svg {
        transform: rotate(180deg);
      }
    }
    .btn-next,
    .btn-prev {
      padding: 0.4em 0.7em;
      background-color: var(--background-color-primary-3);
      transition: background-color 0.2s, fill 0.2s;
      &:hover {
        fill: var(--background-color-primary);
        background-color: var(--accent-color);
      }
    }
  }
}
</style>