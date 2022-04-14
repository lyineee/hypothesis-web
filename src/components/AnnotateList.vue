<template>
  <div>
    <AppBar class="app-bar" :text.sync="search" @onSearch="onSearch" />
    <div class="anno-list">
      <div class="page-item" v-for="(page, index) in data" :key="index">
        <AnnotatePage :data="page" />
      </div>
      <Pagenation
        :pageNumber="page"
        :total="totalPage"
        @pageUpdate="pageUpdate($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, InjectReactive, Vue } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import AnnotatePage from "./AnnotatePage.vue";
import HypoServiceMixin, { Annotation } from "./HypoServiceMixin";
import Pagenation from "./Pagination.vue";
import AppBar from "./AppBar.vue";
import UrlSearchService from "./UrlSearchService";

@Component({
  components: {
    AnnotatePage,
    Pagenation,
    AppBar,
  },
})
export default class AnnotateList extends mixins(Vue, HypoServiceMixin) {
  data: Array<Array<Annotation>> = [];
  pageSize = 15;
  totalPage = 1;
  search = "";
  page = 1;
  @InjectReactive("urlSearchService") urlSearchService!: UrlSearchService;
  pageUpdate(page: number) {
    // this.urlSearchService.set("page", page.toString());
    this.page = page;
    this.data = [];
    if (this.search != "") {
      this.searchAnno(
        (page - 1) * this.pageSize,
        this.pageSize,
        this.getUser(),
        this.getToken(),
        this.search.replaceAll(/\w+:[^ ]*/g, "").trim(),
        this.getSearchProperty(this.search, "tag")?.split(","),
        this.getSearchProperty(this.search, "quote"),
        this.getSearchProperty(this.search, "text"),
        this.getSearchProperty(this.search, "url")
      ).then((rawData) => {
        this.totalPage = Math.ceil(rawData.total / this.pageSize);
        this.renderList(rawData.rows);
      });
      return;
    }
    this.getList(
      this.getUser(),
      (page - 1) * this.pageSize,
      this.pageSize
    ).then((rawData) => {
      this.totalPage = Math.ceil(rawData.total / this.pageSize);
      this.renderList(rawData.rows);
    });
  }

  getSearchProperty(searchText: string, key: string): string | undefined {
    const match = searchText.match(`${key}:([^ ]*)`);
    if (match?.length == 2) {
      return match[1];
    }
  }

  renderList(data: Array<Annotation>) {
    let prevUri = "";
    let pageList = [];
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
    console.log(this.urlSearchService);
    this.search = this.urlSearchService.get("search");
    this.page = Number.parseInt(this.urlSearchService.get("page") || "1");
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
.anno-list {
  background-color: hsla(0, 0%, 98%);
  border: solid 1px hsla(0, 0%, 90%);
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
      background: hsl(0, 0%, 90%);
      bottom: 0px;
      height: 2px;
      width: 90%;
      right: 5%;
    }
  }
}
</style>