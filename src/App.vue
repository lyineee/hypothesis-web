<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <AnnotateList />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AnnotateList from "./components/AnnotateList.vue";
//import HelloWorld from './components/HelloWorld.vue';

@Component({
  components: {
    AnnotateList,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  @media print {
    margin: 0px;
  }
}
</style>
