<template>

    <div class="sculpture-slideshow">
        <canvas></canvas>
        <div class="sculptures">
            <div class="sculpture" v-for="item in this.items">
                
                <div class="images">
                    <img v-for="image in item.images" :src="image" :alt="item.name" />
                </div>
                
                <h2 class="name">{{ item.name }}</h2>
            </div>
        </div>
    </div>

</template>

<script>

import Scene from '~/components/GL/Scene.js'
import Slideshow from '~/components/GL/Slideshow.js'

export default {
data() {
        return {
            items: [
                {
                    name: 'Fish AX',
                    images: ['book.jpg','food.jpg'],
                    bg_color: '#f3f3f3',
                    font_color: 'red',
                    id: 1
                },
                {
                    name: 'Whale HL',
                    images: ['food.jpg','book.jpg'],
                    bg_color: '#000',
                    font_color: 'blue',
                    id: 2
                }
            ]
        }
    },
    mounted() {
       const scene = new Scene()
       const slideshow = new Slideshow()
    }
}

</script>

<style lang="scss" scoped>

    @mixin expand {
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
    }

    .sculpture-slideshow {
        position: fixed;
        @include expand;
        .sculpture, canvas {
            position: absolute;
            @include expand;
        }
        .images {
            visibility: hidden;
        }
    }

</style>

