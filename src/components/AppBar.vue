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
        <a @click.prevent="toggleTheme">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M32 256c0-123.8 100.3-224 223.8-224c11.36 0 29.7 1.668 40.9 3.746c9.616 1.777 11.75 14.63 3.279 19.44C245 86.5 211.2 144.6 211.2 207.8c0 109.7 99.71 193 208.3 172.3c9.561-1.805 16.28 9.324 10.11 16.95C387.9 448.6 324.8 480 255.8 480C132.1 480 32 379.6 32 256z"
            />
          </svg>
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
import ThemeService from "./ThemeService";
import Router from "./Router";

@Component
export default class Annotate extends mixins(Vue, HypoServiceMixin) {
  @PropSync("text") searchText?: string;
  @InjectReactive() router!: Router;
  @InjectReactive() keyboardService!: KeyboardService;
  @InjectReactive() themeService!: ThemeService;
  @Ref("input") input!: HTMLInputElement;

  toggleTheme() {
    if (this.themeService.theme == "dark") {
      this.themeService.theme = "light";
    } else {
      this.themeService.theme = "dark";
    }
  }
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
  border-bottom: 2px solid var(--background-color-primary-8);
  background-color: var(--background-color-secondary);
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
        border: 2px solid var(--background-color-primary-8);
        background-color: var(--background-color-primary);
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
          color: var(--foreground-color-secondary);
          background: var(--background-primary);
          &:focus {
            outline: none;
            border: none;
          }
          &:focus::placeholder {
            opacity: 0;
          }
          &::placeholder {
            font-size: 0.9em;
            color: var(--background-color-primary-4);
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
        cursor: pointer;
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