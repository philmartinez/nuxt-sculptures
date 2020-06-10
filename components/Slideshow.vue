<template>

    <div class="sculpture-slideshow">

        <!--<canvas id="sculpture-bg-gl"></canvas>-->
        <canvas id="sculpture-gl"></canvas>

        <div class="sculpture-bg-color"></div>
        <!--<div class="sculpture-shadow"></div>-->
        <div class="sculptures">
            <div class="sculpture" v-for="item in this.items" :id="`sculpture-${item.id}`">
                <div class="img-wrap"><img :src="'/'+item.image" :alt="item.name" /></div>
                <h2 class="name"><nuxt-link :to="getURL(item)">{{ item.name }}</nuxt-link></h2>
            </div>
        </div>

        <div class="sculpture-meta">
            <div class="text">
                <div class="model">
                    <span class="name-wrap">
                        <span class="inner">
                            <span class="name">{{ this.items[0].type }} {{ this.items[0].name }}</span>
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

import preloadImages from '~/components/util/preload.js'
import Scene from '~/components/GL/Scene.js'
//import SceneBG from '~/components/GL/SceneBG.js'
import Slideshow from '~/components/GL/Slideshow.js'
import App from '~/components/GL/App.js'

export default {
data() {
        return {
            items: [
                {
                    name: 'S3',
                    type: 'snapper',
                    image: 'fish.png',
                    bg_color: '#ffd493',
                    font_color: '#e4ba7b',
                    id: 1
                },
                {
                    name: 'W9',
                    type: 'bowhead',
                    image: 'whale.png',
                    bg_color: '#8198ff',
                    font_color: '#c1c1f1',
                    id: 2
                },
                {
                    name: 'G4',
                    type: 'grouper',
                    image: 'fish2.png',
                    bg_color: '#e4434f',
                    font_color: '#ff561a',
                    id: 3
                },
                {
                    name: 'W2',
                    type: 'bowhead',
                    image: 'fish4.png',
                    bg_color: '#f9f9c5',
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
            window.APP = new App()
            APP.Scene = new Scene()

            preloadImages('.sculpture-slideshow').then(() => {
                APP.Slideshow = new Slideshow(this.items)
            })
            
        }
    },
    mounted() {
       this.createSlideshow()
    }
}

</script>

<style lang="scss">

    $breakpoint-tablet: 768px;

    @mixin expand {
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
    }

    @mixin playfair {
        font-family: 'Playfair Display';
        font-weight: 700;
    }

    $meta-font-size: 16px;

    .sculpture-slideshow {
        background-color: #fdf9f4;
        position: fixed;
        @include expand;
        .sculptures, .sculpture, canvas, .sculpture-bg-color {
            @include expand;
        }
        .sculpture {
            position: relative;
            display: flex;
            flex: 0 0 35%;
            align-items: center;
            justify-content: center;
            margin-right: 40%;
            @media only screen and (max-width: $breakpoint-tablet) {
                //padding: 0 10%;
            }
            h2 {
                position: absolute
            }
        }
        .sculptures {
            display: flex;
            align-items: center;
        }
        .sculptures > div:first-child {
            margin-left: 32.5%;
        }
        canvas, .sculpture-bg-color {
            position: absolute;
        }
        #sculpture-gl {
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

    .sculpture-shadow {
        background-size: cover;
        position: absolute;
        width: 55%;
        padding-bottom: 40%;
        opacity: 0.42;
        top: 57%;
        transform: translateY(-50%) translateX(-50%);
        left: 52%;
        z-index: 1;
        background-image: url('~assets/fish-shadow.png');
    }

    .sculpture-type {
        @include playfair;
        font-size: 20vw;
        width:100%;
        top: 45%;
        @media only screen and (max-width: $breakpoint-tablet) {
            top: 47%;
            font-size: 21vw;
        }
        color: rgba(0,0,0,0.08);
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
        }
    }

    .sculpture-meta {

        position: absolute;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        bottom: 50px;
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
                font-family: 'Roboto',sans-serif;
                font-weight: 700;
                font-size: 44px;
                margin-bottom: 10px;
                line-height: 44px;
                .name-wrap {
                    display: inline-block;
                    height: 54px;
                    margin-left: 10px;
                    overflow: hidden;
                    .inner, span {
                        display: block;
                    }
                    .name {
                        text-transform: capitalize;
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
        .current, .total {
            width: 12px;
            
        }
    }

</style>

