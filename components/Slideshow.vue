<template>

    <div class="sculpture-slideshow">

        <canvas></canvas>

        <div class="sculptures">
            <div class="sculpture" v-for="item in this.items" :id="`sculpture-${item.id}`">
                <img :src="item.image" :alt="item.name" />
                <h2 class="name">{{ item.name }}</h2>
                <span class="type">{{ item.type }}</span>
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
                    name: 'X',
                    type: 'Fish',
                    image: 'book.jpg',
                    bg_color: '#f1e8da',
                    font_color: '#f4bb51',
                    id: 1
                },
                {
                    name: 'Q9',
                    type: 'Whale',
                    image: 'food.jpg',
                    bg_color: '#000',
                    font_color: 'blue',
                    id: 2
                },
                {
                    name: 'H4',
                    type: 'Fish',
                    image: 'book.jpg',
                    bg_color: '#ffe1d6',
                    font_color: '#ff561a',
                    id: 3
                },
            ]
        }
    },
    methods: {
        createSlideshow() {
            const scene = new Scene()
            const slideshow = new Slideshow(scene, this.items)
        }
    },
    mounted() {
       this.createSlideshow()
    }
}

</script>

<style lang="scss">

    @mixin expand {
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
    }

    .sculpture-slideshow {
        background-color: #fff;
        position: fixed;
        @include expand;
        .sculpture, canvas {
            position: absolute;
            @include expand;
        }
        img, .name {
            visibility: hidden;
            pointer-events: none;
        }

    }

    .sculpture-type {
        font-weight: 400;
        font-family: 'Playfair Display';
        font-size: 24vh;
        width:100%;
        top: 50%;
        color: #000;
        text-align: center;
        left: 0;
        transform: translate3d(0, -50%, 0);
        position: absolute;

        > span:not(:nth-child(1)) {
            position: absolute;
            text-align: center;
            width: 100%;
            top: 0;
            left: 0;
        }
    }

</style>

