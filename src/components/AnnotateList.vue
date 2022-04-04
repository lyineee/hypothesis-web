<template>
  <div class="anno-list">
    <div class="page-item" v-for="(page, index) in data" :key="index">
      <AnnotatePage :data="page" />
    </div>
    <Pagenation :total="totalPage" @pageUpdate="pageUpdate($event)" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import AnnotatePage from "./AnnotatePage.vue";
import HypoServiceMixin, { Annotation } from "./HypoServiceMixin";
import Pagenation from "./Pagination.vue";

@Component({
  components: {
    AnnotatePage,
    Pagenation,
  },
})
export default class AnnotateList extends mixins(Vue, HypoServiceMixin) {
  data: Array<Array<Annotation>> = [];
  pageSize = 15;
  totalPage = 1;
  pageUpdate(page: number) {
    this.data = [];
    this.getList(
      this.getUser(),
      (page - 1) * this.pageSize,
      this.pageSize
    ).then((rawData) => {
      this.totalPage = Math.ceil(rawData.total / this.pageSize);
      let prevUri = "";
      let pageList = [];
      for (let anno of rawData.rows) {
        if (anno.uri != prevUri) {
          pageList.length != 0 ? this.data.push(pageList) : "";
          pageList = [];
          prevUri = anno.uri;
        }
        pageList.push(anno);
      }
      pageList.length != 0 ? this.data.push(pageList) : "";
    });
  }
}
</script>

<style scoped lang="scss">
.anno-list {
  background-color: hsla(0, 0%, 88%, 0.2);
  border: solid 1px hsla(0, 0%, 61%, 0.234);
  margin-left: 10%;
  margin-right: 30%;
  @media print {
    margin: 0px;
    border: none;
  }
  @media screen and (max-width: 900px) {
    margin-left: 2%;
    margin-right: 2%;
  }
  padding: 2em;
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