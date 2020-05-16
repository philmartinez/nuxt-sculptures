<template>

    <div class="sculpture-slideshow">

        <canvas></canvas>

        <div class="sculptures">
            <div class="sculpture" v-for="item in this.items" :id="`sculpture-${item.id}`">
                <img :src="item.image" :alt="item.name" />
                <h2 class="name"><nuxt-link :to="getURL(item)">{{ item.name }}</nuxt-link></h2>
            </div>
        </div>

        <div class="sculpture-meta">
            <div class="sculpture-link" v-for="item in this.items">
                <nuxt-link :to="getURL(item)" class="name-link">Model <span class="name">{{ item.name }}</span></nuxt-link>
                <nuxt-link :to="getURL(item)" class="detail-link">View Detail</nuxt-link>
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
                    type: 'snapper',
                    image: 'book.jpg',
                    bg_color: '#f1e8da',
                    font_color: '#f4bb51',
                    id: 1
                },
                {
                    name: 'Q9',
                    type: 'whale',
                    image: 'food.jpg',
                    bg_color: '#e1e1ff',
                    font_color: 'blue',
                    id: 2
                },
                {
                    name: 'H4',
                    type: 'grouper',
                    image: 'book.jpg',
                    bg_color: '#ffe1d6',
                    font_color: '#ff561a',
                    id: 3
                },
            ]
        }
    },
    methods: {
        getURL(sculpture) {
            return `sculptures/${sculpture.type}-${sculpture.name.toLowerCase()}`
        },
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
        img, .sculpture .name {
            visibility: hidden;
            pointer-events: none;
        }

    }

    .sculpture-type {
        font-weight: 400;
        font-family: 'Playfair Display';
        font-size: 20vw;
        width:100%;
        top: 45%;
        color: #000;
        text-align: center;
        left: 0;
        pointer-events: none;
         -webkit-user-select: none;
        user-select: none;
        transform: translate3d(0, -50%, 0);
        position: absolute;

        > span:not(:nth-child(1)) {
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            display: flex;
        }

        > span {
            display: flex;
            justify-content: center;
            perspective: 1000px;
        }

        > span > span {
            display: block;
            transform-origin: top;
            opacity: 0;
            transform: translateY(-30vh) rotateY(-50deg);
        }
    }

    .sculpture-meta {
        position: absolute;
        bottom: 60px;
        width: 100%;
        display: flex;
        justify-content: center;

        > div:not(:first-child) {
            position: absolute;
        }
        .sculpture-link {
            text-align: center;
        }

        .name-link {
            font-weight: 700;
            font-size: 32px;
            margin-bottom: 15px;
            display: block;
            opacity: 0;
        }

        .detail-link {
            opacity: 0.6
        }

        .sculpture-link:not(.active) {
            pointer-events: none;
        }

        a {
            color: #000;
            text-decoration: none;
        }
    }

</style>

