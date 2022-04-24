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
          <svg
            v-if="theme == 'light'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M256 159.1c-53.02 0-95.1 42.98-95.1 95.1S202.1 351.1 256 351.1s95.1-42.98 95.1-95.1S309 159.1 256 159.1zM509.3 347L446.1 255.1l63.15-91.01c6.332-9.125 1.104-21.74-9.826-23.72l-109-19.7l-19.7-109c-1.975-10.93-14.59-16.16-23.72-9.824L256 65.89L164.1 2.736c-9.125-6.332-21.74-1.107-23.72 9.824L121.6 121.6L12.56 141.3C1.633 143.2-3.596 155.9 2.736 164.1L65.89 256l-63.15 91.01c-6.332 9.125-1.105 21.74 9.824 23.72l109 19.7l19.7 109c1.975 10.93 14.59 16.16 23.72 9.824L256 446.1l91.01 63.15c9.127 6.334 21.75 1.107 23.72-9.822l19.7-109l109-19.7C510.4 368.8 515.6 356.1 509.3 347zM256 383.1c-70.69 0-127.1-57.31-127.1-127.1c0-70.69 57.31-127.1 127.1-127.1s127.1 57.3 127.1 127.1C383.1 326.7 326.7 383.1 256 383.1z"
            />
          </svg>
          <svg
            v-if="theme == 'dark'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M32 256c0-123.8 100.3-224 223.8-224c11.36 0 29.7 1.668 40.9 3.746c9.616 1.777 11.75 14.63 3.279 19.44C245 86.5 211.2 144.6 211.2 207.8c0 109.7 99.71 193 208.3 172.3c9.561-1.805 16.28 9.324 10.11 16.95C387.9 448.6 324.8 480 255.8 480C132.1 480 32 379.6 32 256z"
            />
          </svg>
          <svg
            v-if="theme == undefined"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 64V448C362 448 448 362 448 256C448 149.1 362 64 256 64z"
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

  get theme() {
    return this.themeService.getSetting().theme;
  }

  toggleTheme() {
    if (this.theme == "light") {
      this.themeService.setTheme("dark");
    } else if (this.theme == "dark") {
      this.themeService.setTheme();
    } else {
      this.themeService.setTheme("light");
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
      a {
        margin-left: 0.5em;
        @media (max-width: theme.$layout-breakpoint-small) {
          margin-left: 0px;
        }
      }
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