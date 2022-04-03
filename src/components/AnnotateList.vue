<template>
  <div class="anno-list">
    <div class="page-item" v-for="(page, index) in data" :key="index">
      <AnnotatePage :data="page" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import AnnotatePage from "./AnnotatePage.vue";
import HypoServiceMixin from "./HypoServiceMixin";

@Component({
  components: {
    AnnotatePage,
  },
})
export default class AnnotateList extends mixins(Vue, HypoServiceMixin) {
  data: Array<Array<any>> = [];
  created() {
    let prevUri = "";
    this.getList("acct:liuzhengyuan@hypothes.is", 0, 20).then((rawData) => {
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
  padding: 2em;
  .page-item {
    padding-bottom: 2em;
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