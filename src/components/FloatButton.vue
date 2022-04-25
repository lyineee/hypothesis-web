<template>
  <div>
    <button @click="$emit('click')">
      <div class="icon" />
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Annotate extends Vue {}
</script>

<style scoped lang="scss">
@use "scss/svg";
@use "scss/theme";

$primary: map-get(theme.$palette, "primary");
$background: map-get(theme.$palette, "background");
$secondary: map-get(theme.$palette, "secondary");
$on-background: map-get(theme.$palette, "on-background");

div {
  transform: scale(1.3);

  button {
    cursor: pointer;
    padding: 0px;
    user-select: none;
    -webkit-user-drag: none;
    border-radius: 50%;
    border: none;
    position: relative;
    .icon {
      @include svg.svg("leftarrow");
      user-select: none;
      -webkit-user-drag: none;
      background-color: var(--foreground-color-primary);
      transform: rotate(90deg);
      padding: 1em;
      position: relative;
      margin: 1em;
      left: -0.2px;
      top: 0.2em;
    }
    background-color: var(--background-color-primary-3);
    transition: background-color 0.2s, fill 0.2s;
    &:hover {
      fill: var(--background-color-primary);
      background-color: var(--accent-color-primary-9);
    }
  }
}
</style>