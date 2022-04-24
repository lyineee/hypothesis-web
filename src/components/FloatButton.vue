<template>
  <div>
    <button @click="$emit('click')">
      <svg width="10" height="15">
        <use xlink:href="../assets/leftarrow.svg#leftarrow"></use>
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Annotate extends Vue {}
</script>

<style scoped lang="scss">
@use "scss/theme";

$primary: map-get(theme.$palette, "primary");
$background: map-get(theme.$palette, "background");
$secondary: map-get(theme.$palette, "secondary");
$on-background: map-get(theme.$palette, "on-background");

div {
  transform: scale(1.3);

  button {
    cursor: pointer;
    user-select: none;
    -webkit-user-drag: none;
    border-radius: 50%;
    border: none;
    position: relative;
    svg {
      user-select: none;
      -webkit-user-drag: none;
      padding: 1em;
      position: relative;
      top: 0.1em;
      left: -0.02em;
      transform: rotate(90deg);
      use{
          transform: scale(1.25);
      }
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