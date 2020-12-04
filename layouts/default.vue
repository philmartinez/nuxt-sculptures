<template>
  <div>
    <Header></Header>
    <Slideshow></Slideshow>
    <Splash></Splash>
    <nuxt />
  </div>
</template>

<script>
import Slideshow from '~/components/Slideshow'
import Header from '~/components/Header'
import Splash from '~/components/Splash'

export default {

    components: {
        Slideshow,
        Header,
        Splash
    }

}
</script>

<style lang="scss">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

@function strip-unit($value) {
  @return $value / ($value * 0 + 1);
}

@mixin fluid-type($min-vw, $max-vw, $min-font-size, $max-font-size) {
  $u1: unit($min-vw);
  $u2: unit($max-vw);
  $u3: unit($min-font-size);
  $u4: unit($max-font-size);

  @if $u1 == $u2 and $u1 == $u3 and $u1 == $u4 {
    & {
      font-size: $min-font-size;
      @media screen and (min-width: $min-vw) {
        font-size: calc(#{$min-font-size} + #{strip-unit($max-font-size - $min-font-size)} * ((100vw - #{$min-vw}) / #{strip-unit($max-vw - $min-vw)}));
      }
      @media screen and (min-width: $max-vw) {
        font-size: $max-font-size;
      }
    }
  }
}

$min_width: 320px;
$max_width: 1400px;
$min_font: 14px;
$max_font: 18px;

html {
  line-height: 1.6;
  @include fluid-type($min_width, $max_width, $min_font, $max_font);
}

$mod_1: 1.2; // mobile
$mod_2: 1.4; // desktop

h1 {  
  font-size: $mod_1*$mod_1*$mod_1*$mod_1*$mod_1 *1rem; 
  @include fluid-type($min_width, $max_width, $mod_1*$mod_1*$mod_1*$mod_1 *$min_font, $mod_2*$mod_2*$mod_2*$mod_2 *$min_font);
}
h2 {  
  font-size: $mod_1*$mod_1*$mod_1 *1rem; 
  @include fluid-type($min_width, $max_width, $mod_1*$mod_1*$mod_1 *$min_font, $mod_2*$mod_2*$mod_2 *$min_font);
}
h3 { 
  font-size: $mod_1*$mod_1 *1rem;
  @include fluid-type($min_width, $max_width, $mod_1*$mod_1 *$min_font, $mod_2*$mod_2 *$min_font);
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

</style>
