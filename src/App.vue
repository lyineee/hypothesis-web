<template>
  <div id="app">
    <keep-alive>
      <component v-bind:is="currentPage"></component>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { Component, ProvideReactive, Vue } from "vue-property-decorator";
import AnnotateList from "./components/AnnotateList.vue";
import LoginPage from "./components/LoginPage.vue";
import AppBar from "./components/AppBar.vue";
import UrlSearchService from "./components/UrlSearchService";
import { VueConstructor } from "vue";
import Router, { Route } from "./components/Router";
import KeyboardService, {
  WithKey,
  registerOption,
} from "./components/KeyboardService";

@Component({
  components: {
    AppBar,
  },
})
export default class App extends Vue {
  showLoginPage = false;
  currentPage: VueConstructor<Vue> = AnnotateList;
  private searchKey = ["page", "search", "redirectTo"];
  routes: Array<Route> = [
    {
      title: "login",
      regex: /.*\/login.*/,
      component: LoginPage,
    },
    {
      title: "main",
      regex: /.*/,
      component: AnnotateList,
    },
  ];

  @ProvideReactive("urlSearchService") urlSearch?: UrlSearchService =
    new UrlSearchService(this.searchKey);
  @ProvideReactive() router: Router = new Router(
    this.routes,
    location.pathname,
    this.updateRoute
  );
  @ProvideReactive() keyboardService: KeyboardService = new KeyboardService();

  updateRoute(r: Route) {
    r.component && (this.currentPage = r.component);
  }

  created() {
    this.router.routeChange(location.pathname);
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  overflow-y: scroll;
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
