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
            <div class="text">
                <div class="model">
                    <span>Model</span>
                    <span class="name-wrap">
                        <span class="inner">
                            <span class="name">{{ this.items[0].name }}</span>
                        </span>
                    </span>
                </div>
                <div class="view-detail">View Detail</div>
                <div class="link">
                    <nuxt-link v-for="item in this.items" :key="item.id" :to="getURL(item)" class="detail-link"></nuxt-link>
                </div>
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
                    name: 'S3',
                    type: 'snapper',
                    image: 'fish-1.png',
                    bg_color: '#f1e8da',
                    font_color: '#f4bb51',
                    id: 1
                },
                {
                    name: 'W9',
                    type: 'whale',
                    image: 'fish-2.png',
                    bg_color: '#e1e1ff',
                    font_color: 'blue',
                    id: 2
                },
                {
                    name: 'G4',
                    type: 'grouper',
                    image: 'fish-1.png',
                    bg_color: '#ffe1d6',
                    font_color: '#ff561a',
                    id: 3
                },
                {
                    name: 'W2',
                    type: 'whale',
                    image: 'fish-2.png',
                    bg_color: '#ecece7',
                    font_color: '#333',
                    id: 4
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

    $meta-font-size: 16px;

    .sculpture-slideshow {
        background-color: #fff;
        position: fixed;
        @include expand;
        .sculpture, canvas {
            position: absolute;
            @include expand;
        }
        .sculpture {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 20%;
        }
        canvas {
            z-index: 100;
        }
        img, .sculpture .name {
            visibility: hidden;
            pointer-events: none;
        }
        img {
            max-width: 100%;
            height: auto;
            width: auto;
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
            perspective: 4000px;
        }

        > span > span {
            display: block;
            transform-origin: center;
            backface-visibility: hidden;
            opacity: 0;
            //transform: rotateY(-50deg);
            //transform: translateY(-30vh) rotateY(-50deg);
        }
    }

    .sculpture-meta {

        position: absolute;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        bottom: 60px;
        align-items: flex-end;
        justify-content: center;
        z-index: 1000;

        .text {
            position: relative;
            -webkit-user-select: none;
            user-select: none;
            .link, .link a {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: 10;
                display: block;
                a:not(.active) {
                    display: none;
                }
            }

            .model {
                font-size: 34px;
                font-weight: 700;
                margin-bottom: 15px;
                line-height: 34px;
                .name-wrap {
                    display: inline-block;
                    height: 34px;
                    margin-left: 10px;
                    overflow: hidden;
                    .inner, span {
                        display: block;
                    }
                    .name {
                        width: 53px;
                    }
                }
            }
            .view-detail {
                font-size: $meta-font-size;
            }
            .view-detail, .model {
                width: 100%;
                display: flex;
                justify-content: center;
            }
        }

        a {
            color: #000;
            text-decoration: none;
        }

    }

    .progress {
        position: absolute;
        left: 50px;
        line-height: 20px;
        font-weight: 700;
        font-size: $meta-font-size;
        
        .indicator {
            height: 2px;
            background-color: rgba(0,0,0,0.3);
            width: 30px;
            margin: 0 2px;
            position: relative;
            display: inline-block;

            span {
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: #000;
                display: block;
                transform: scaleX(0)
            }
        }
        .current {
            overflow: hidden;
            height: 16px;
            display: inline-block;

            .inner {
                display: block;
            }
            .inner span {
                display: block;
                margin-bottom: 10px;
            }
        
        }
    }

</style>

