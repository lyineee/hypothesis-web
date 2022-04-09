<template>
  <div id="app">
    <component :is="currentPage"></component>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AnnotateList from "./components/AnnotateList.vue";
import LoginPage from "./components/LoginPage.vue";
import AppBar from "./components/AppBar.vue";

@Component({
  components: {
    AnnotateList,
    AppBar,
  },
})
export default class App extends Vue {
  showLoginPage = false;
  currentPage!: any;
  route = [
    {
      regex: /.*\/login.*/,
      page: LoginPage,
    },
  ];
  router(pathname: string) {
    for (let r of this.route) {
      if (pathname.match(r.regex)) {
        this.currentPage = r.page;
      }
    }
    if (!this.currentPage) {
      this.currentPage = AnnotateList;
    }
  }
  created() {
    this.router(location.pathname);
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  overflow: scroll;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  @media print {
    margin: 0px;
  }
}
</style>
