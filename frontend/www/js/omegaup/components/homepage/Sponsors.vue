<template>
  <div class="row p-4 text-center justify-content-around align-items-center">
    <h3 class="col-12 mb-3 display-4">{{ title }}</h3>
    <div v-for="logo in logos" :key="logo.href" class="p-3 mt-2 mt-md-0">
      <a :href="logo.href" target="_blank">
        <img class="img-fluid" :src="logo.src" :alt="logo.alt" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Sponsors extends Vue {
  @Prop() title!: string;
  @Prop() logos!: {
    src: string;
    alt: string;
    href: string;
  }[];
}
</script>

<style lang="scss" scoped>
@import '../../../../sass/main.scss';

h3.display-4 {
  color: $omegaup-primary--darker;
  font-weight: normal;
}

img.img-fluid {
  max-height: 200px;
}
</style>
