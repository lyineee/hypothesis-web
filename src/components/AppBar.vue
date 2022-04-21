<template>
  <header class="app-bar">
    <div class="header-container">
      <div class="spacer" />
      <div class="search-box-container">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"
            />
          </svg>
          <input
            ref="input"
            v-model="searchText"
            placeholder="按下 / 搜索"
            @keydown.enter="$emit('onSearch')"
          />
          <svg
            class="clear"
            :class="searchText ? '' : 'diable'"
            @click="searchText ? (searchText = '') || $emit('onSearch') : ''"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"
            />
          </svg>
        </div>
      </div>
      <div class="setting-container">
        <a href="/login" @click.prevent="router.goto('/login')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"
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
        svg {
          padding: 0.6em;
          fill: theme.lighten($on-background, 5);
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
          padding: 0.4em;
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
      svg {
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
          svg {
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