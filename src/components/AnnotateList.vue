<template>
  <div>
    <AppBar
      ref="appBar"
      class="app-bar"
      :text.sync="search"
      @onSearch="onSearch"
    />
    <div class="anno-list" :class="loading ? 'loading' : ''">
      <div class="page-item" v-for="(page, index) in data" :key="index">
        <AnnotatePage :data="page" :expand="expand" />
      </div>
      <Pagenation
        :pageNumber="page"
        :total="totalPage"
        @pageUpdate="pageUpdate($event)"
      />
    </div>
    <FloatButton
      class="to-top"
      :class="showToTop ? '' : 'hidden'"
      @click="toTop(true)"
    />
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Ref, Vue } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import AnnotatePage from "./AnnotatePage.vue";
import HypoServiceMixin, { Annotation } from "./HypoServiceMixin";
import Pagenation from "./Pagination.vue";
import AppBar from "./AppBar.vue";
import FloatButton from "./FloatButton.vue";
import UrlSearchService from "./UrlSearchService";

@Component({
  components: {
    AnnotatePage,
    Pagenation,
    AppBar,
    FloatButton,
  },
})
export default class AnnotateList extends mixins(Vue, HypoServiceMixin) {
  data: Array<Array<Annotation>> = [];
  pageSize = 15;
  totalPage = 1;
  search = "";
  page = 1;
  loading = false;
  showToTop = true;
  expand = false;
  @InjectReactive("urlSearchService") urlSearchService!: UrlSearchService;
  @Ref("appBar") appBar!: Vue;
  pageUpdate(page: number) {
    this.loading = true;
    this.toTop();
    this.urlSearchService.set("page", page.toString(), true);
    this.page = page;
    this.expand = !!this.search.match(/(?:^| )expand:[^ ]*/);
    if (this.search != "") {
      this.searchAnno(
        (page - 1) * this.pageSize,
        this.pageSize,
        this.getUser(),
        this.getToken(),
        encodeURIComponent(
          this.search
            .replaceAll(/(?<=tag|url|text|quote|expand):[^ ]*/g, "")
            .replaceAll(/tag|url|text|quote|expand/g, "")
            .replaceAll(/ +/g, " ")
            .trim()
        ),
        this.getSearchProperty(this.search, "tag")?.split(","),
        this.getSearchProperty(this.search, "quote"),
        this.getSearchProperty(this.search, "text"),
        encodeURIComponent(this.getSearchProperty(this.search, "url") || "") ||
          undefined
      )
        .then((rawData) => {
          this.totalPage = Math.ceil(rawData.total / this.pageSize);
          this.renderList(rawData.rows);
        })
        .finally(() => (this.loading = false));
      return;
    }
    this.getList(this.getUser(), (page - 1) * this.pageSize, this.pageSize)
      .then((rawData) => {
        this.totalPage = Math.ceil(rawData.total / this.pageSize);
        this.renderList(rawData.rows);
      })
      .finally(() => (this.loading = false));
  }

  toTop(smooth?: boolean) {
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  }

  getSearchProperty(searchText: string, key: string): string | undefined {
    const match = searchText.match(`${key}:([^ ]+)`);
    if (match?.length == 2) {
      return match[1];
    }
  }

  renderList(data: Array<Annotation>) {
    let prevUri = "";
    let pageList = [];
    this.data = [];
    for (let anno of data) {
      if (anno.uri != prevUri) {
        pageList.length != 0 ? this.data.push(pageList) : "";
        pageList = [];
        prevUri = anno.uri;
      }
      pageList.push(anno);
    }
    pageList.length != 0 ? this.data.push(pageList) : "";
  }

  onSearch() {
    this.urlSearchService.set("search", this.search, true);
    this.pageUpdate(1);
  }
  created() {
    this.search = decodeURIComponent(this.urlSearchService.get("search"));
    this.page = Number.parseInt(this.urlSearchService.get("page") || "1");
  }
  mounted() {
    let observer = new IntersectionObserver(
      (() => {
        return (e: Array<IntersectionObserverEntry>) =>
          (this.showToTop = !e[0].isIntersecting);
      })()
    );
    observer.observe(this.appBar.$el);
  }
}
</script>

<style scoped lang="scss">
@use "scss/theme.scss";
.app-bar {
  margin-bottom: 2em;
  @media (max-width: theme.$layout-breakpoint-small) {
    margin-bottom: 0.5em;
  }
}
.anno-list.loading {
  &::after {
    content: "";
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: var(--foreground-color-primary-10);
    opacity: 0.5;
  }
}
.anno-list {
  position: relative;
  background-color: var(--background-color-primary-9);
  border: solid 1px var(--background-color-primary-7);
  margin-left: 10%;
  margin-right: 30%;
  padding: 2em;
  @media print {
    margin: 0px;
    border: none;
  }
  @media screen and (max-width: 900px) {
    margin-left: 2%;
    margin-right: 2%;
    padding: 0.7em;
  }
  .page-item {
    padding-bottom: 0.5em;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      background: var(--background-color-primary-7);
      bottom: 0px;
      height: 2px;
      width: 90%;
      right: 5%;
    }
  }
}
.to-top {
  position: fixed;
  right: 10vh;
  bottom: 10vh;
  transition: transform 0.15s;
  @media screen and (max-width: 900px) {
    transform: scale(0);
  }
  &.hidden {
    transform: scale(0);
  }
}
</style>