<template>
  <div>
    <div class="title-container">
      <h1 class="page-title">
        {{ renderData[0].document.title[0] }}
      </h1>
      <span class="spacer" />
      <span class="anno-count">{{ renderData.length }}</span>
    </div>
    <div class="anno-link">
      <a class="link" :href="renderData[0].uri" target="_blank">{{
        renderData[0].uri
      }}</a>
      <span class="link-svg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          width=".8em"
          height=".8em"
          fill="hsl(0, 0%, 40%)"
        >
          <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
          <path
            d="M256 64C256 46.33 270.3 32 288 32H415.1C415.1 32 415.1 32 415.1 32C420.3 32 424.5 32.86 428.2 34.43C431.1 35.98 435.5 38.27 438.6 41.3C438.6 41.35 438.6 41.4 438.7 41.44C444.9 47.66 447.1 55.78 448 63.9C448 63.94 448 63.97 448 64V192C448 209.7 433.7 224 416 224C398.3 224 384 209.7 384 192V141.3L214.6 310.6C202.1 323.1 181.9 323.1 169.4 310.6C156.9 298.1 156.9 277.9 169.4 265.4L338.7 96H288C270.3 96 256 81.67 256 64V64zM0 128C0 92.65 28.65 64 64 64H160C177.7 64 192 78.33 192 96C192 113.7 177.7 128 160 128H64V416H352V320C352 302.3 366.3 288 384 288C401.7 288 416 302.3 416 320V416C416 451.3 387.3 480 352 480H64C28.65 480 0 451.3 0 416V128z"
          />
        </svg>
      </span>
    </div>

    <div class="anno" v-for="anno in renderData" :key="anno.id">
      <Annotate :data="anno" />
    </div>
  </div>
</template>

<script lang="ts">
import { mixins } from "vue-class-component";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Annotate from "./Annotate.vue";
import HypoServiceMixin, { Annotation } from "./HypoServiceMixin";

@Component({
  components: {
    Annotate,
  },
})
export default class AnnotatePage extends mixins(Vue, HypoServiceMixin) {
  @Prop() private data!: Array<Annotation>;
  renderData: Array<Annotation> = [];
  @Prop({ default: false }) expand!: boolean;
  @Watch("data")
  onDataChange() {
    this.reload();
  }
  @Watch("expand")
  reload() {
    this.renderData = Object.assign([], this.data);
    if (this.expand) {
      this.searchAnno(
        0,
        30,
        this.getUser(),
        this.getToken(),
        undefined,
        undefined,
        undefined,
        undefined,
        encodeURIComponent(this.data[0].uri)
      ).then((resp) => {
        this.renderPage(resp.rows);
      });
    } else {
      this.renderPage(this.data);
    }
  }

  renderPage(data: Array<Annotation>) {
    this.renderData = Object.assign([], data);
    for (let a of this.renderData) {
      if (!a.target[0].selector) {
        // page note
        this.renderData.splice(this.renderData.indexOf(a), 1);
        this.renderData.splice(0, 0, a);
        break;
      }
    }
  }
  created() {
    this.reload();
  }
}
</script>

<style scoped lang="scss">
@use "scss/theme";
$background-color-primary: map-get(theme.$palette, "background-color-primary");
$background-color-secondary: map-get(
  theme.$palette,
  "background-color-secondary"
);
$background-color-secondary-variant: map-get(
  theme.$palette,
  "background-color-secondary-variant"
);
$foreground-color-primary: map-get(theme.$palette, "foreground-color-primary");
$foreground-color-primary-variant: map-get(
  theme.$palette,
  "foreground-color-primary-variant"
);
$accent-color: map-get(theme.$palette, "accent-color");
$accent-color-variant: map-get(theme.$palette, "accent-color-variant");
$accent-color-secondary: map-get(theme.$palette, "accent-color-secondary");
$accent-color-secondary-variant: map-get(
  theme.$palette,
  "accent-color-secondary-variant"
);
$text-color-primary: map-get(theme.$palette, "text-color-primary");
$text-color-secondary: map-get(theme.$palette, "text-color-secondary");

.title-container {
  display: flex;
  .page-title {
    font-size: 2.5ch;
    text-align: start;
  }
  .spacer {
    display: block;
    flex: 1;
  }
  .anno-count {
    position: relative;
    user-select: none;
    top: 2px;
  }
}
.anno-link {
  text-align: start;
  margin-top: -1em;
  margin-bottom: 0.7em;
  font-size: 0.9em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: $foreground-color-primary-variant;
  .link {
    color: $foreground-color-primary-variant;
    text-decoration: none;
  }
  .link-svg {
    opacity: 0;
    margin-left: 0.2em;
  }
  &:hover {
    text-decoration: underline;
    .link-svg {
      opacity: 1;
    }
  }
}
</style>