<template>
  <header class="app-bar">
    <div class="header-container">
      <div class="spacer" />
      <div class="search-box-container">
        <div class="search-box">
          <img class="search-icon" src="../assets/search.svg" />
          <input
            ref="input"
            v-model="searchText"
            placeholder="按下 / 搜索"
            @keydown.enter="$emit('onSearch')"
          />
          <img
            class="clear"
            :class="searchText ? '' : 'diable'"
            @click="searchText ? (searchText = '') || $emit('onSearch') : ''"
            src="../assets/cross.svg"
          />
        </div>
      </div>
      <div class="setting-container">
        <a href="/login" @click.prevent="router.goto('/login')">
          <img src="../assets/gear.svg" />
        </a>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { mixins } from "vue-class-component";
import {
  Component,
  InjectReactive,
  PropSync,
  Ref,
  Vue,
} from "vue-property-decorator";
import HypoServiceMixin from "./HypoServiceMixin";
import KeyboardService from "./KeyboardService";
import Router from "./Router";

@Component
export default class Annotate extends mixins(Vue, HypoServiceMixin) {
  @PropSync("text") searchText?: string;
  @InjectReactive() router!: Router;
  @InjectReactive() keyboardService!: KeyboardService;
  @Ref("input") input!: HTMLInputElement;

  created() {
    this.keyboardService.register(
      "/",
      (() => {
        return () => {
          this.input.focus();
        };
      })(),
      { preventDefault: true }
    );
  }

  mounted() {
    this.keyboardService.register(
      "Escape",
      (() => {
        return () => {
          this.input.blur();
        };
      })(),
      { target: this.input } // this.input has value after mounted
    );
  }
}
</script>

<style scoped lang="scss">
@use "scss/theme";

$primary: map-get(theme.$palette, "primary");
$background: map-get(theme.$palette, "background");
$secondary: map-get(theme.$palette, "secondary");
$on-background: map-get(theme.$palette, "on-background");

.app-bar {
  position: relative;
  top: 0px;
  width: 100%;
  height: 3em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  border-bottom: 2px solid theme.darken($background);
  background-color: $background;
  @media (max-width: theme.$layout-breakpoint-small) {
    height: 2.5em;
    padding-top: 0.2em;
    padding-bottom: 0.2em;
  }
  .header-container {
    display: flex;
    height: 100%;
    .spacer {
      flex: 1;
    }
    .search-box-container {
      flex: 2;
      display: flex;
      justify-content: center;
      .search-box {
        width: 100%;
        padding: 0.1em 1em 0.1em 0.5em;
        border: 2px solid theme.darken($background);
        background-color: theme.lighten($background, 20);
        margin-right: 8em;
        position: relative;
        display: flex;
        img.search-icon {
          filter: invert(45%) sepia(9%) saturate(1934%) hue-rotate(169deg)
            brightness(86%) contrast(82%); // from https://stackoverflow.com/questions/22252472/how-to-change-the-color-of-an-svg-element
        }
        img {
          padding: 0.6em;
          user-select: none;
          -webkit-user-drag: none;
        }
        input {
          outline: none;
          border: none;
          font-size: 1.2em;
          width: 100%;
          color: $on-background;
          &:focus {
            outline: none;
            border: none;
          }
          &:focus::placeholder {
            opacity: 0;
          }
          &::placeholder {
            font-size: 0.9em;
            color: hsl(0, 0%, 80%);
          }
        }
        .clear {
          padding: 0.5em;
          transition: opacity 0.2s;
          cursor: pointer;
        }
        .diable {
          opacity: 0.4;
          cursor: initial;
        }
      }
    }
    .setting-container {
      flex: 1;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      svg,
      img {
        height: 1.4em;
        margin-right: 1em;
      }
    }
    @media (max-width: theme.$layout-breakpoint-medium) {
      .spacer {
        flex: 0;
      }
      .search-box-container {
        flex: 2;
        .search-box {
          padding: 0;
          margin-right: 1em;
          margin-left: 1em;
          display: flex;
          svg,
          img {
            padding: 0.4em;
          }
          .clear {
            padding: 0.2em 1em 0.2em 0.2em;
          }
        }
      }
    }
  }
}
</style>