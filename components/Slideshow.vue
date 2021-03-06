<template>
    <div class="sculpture-slideshow">

        <!--<canvas id="sculpture-bg-gl"></canvas>-->
        <canvas id="sculpture-gl"></canvas>

        <div class="sculpture-bg-color"></div>
        <!--<div class="sculpture-shadow"></div>-->
        <div class="sculptures">
            <div class="sculpture" v-for="item in this.items" :id="`sculpture-${item.id}`">
                <div class="color-plane"></div>
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
                <div class="link" :class="{ active: this.page === 'index' }">
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
import Slideshow from '~/components/GL/SlideShow.js'
import App from '~/components/GL/App.js'
import { mapState, mapMutations } from 'vuex'

export default {
    methods: {
        ...mapMutations(['updateLoaded']),
        getURL(sculpture) {
            return `sculptures/${sculpture.name.toLowerCase()}`
        },
        createSlideshow() {
            window.APP = new App()
            APP.Scene = new Scene()

            preloadImages('.sculpture-slideshow').then(() => {
                APP.Slideshow = new Slideshow(this.items)
                
                this.updateLoaded(true)

               if(this.page !== 'index') {
                    this.setFishView(this.page)
                }
            })
            
        },
        setFishView(page) {
           if( page === 'index' ) {
               
                APP.Slideshow.singleSculptureExit()
           } else if( page === 'sculptures-sculpture' ) {
              ///console.log('enter');
              // moved to _sculpture
             // APP.Slideshow.singleSculptureEnter()
           }
        }
    },
    computed: mapState(['page','items','loaded']),
    watch: {
        page: function(page) {
           this.setFishView(page)
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
        cursor: grab;
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
            margin-right: 24%;
            margin-left: 24%;
            .color-plane {
                position: absolute;
                width: calc(100% + 30vw);
                height: 70vh;
                left: calc(-15vw);
                top: 50%;
                transform: translateY(-50%);
                .top-aligned {
                    top: 0;
                    left:0;
                }
            }
            &:first-child {
                margin-left: 32.5%;
            }
            @media only screen and (max-width: $breakpoint-tablet) {
                flex: 0 0 50%;
                margin-right: 18%;
                &:first-child {
                    margin-left: 25%;
                }
            }
            h2 {
                position: absolute
            }
        }
        .sculptures {
            display: flex;
            align-items: center;
        }
        /*.sculptures > div:first-child {
            margin-left: 32.5%;
        }*/
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

    .sculpture-slideshow.dragging {
        cursor: grabbing;
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
            .link:not(.active) {
                pointer-events: none;
            }
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
                font-family: 'Playfair Display',sans-serif;
                font-weight: 700;
                font-size: 12vh;
                margin-bottom: 4vh;
                line-height: 12vh;
                @media only screen and (max-width: $breakpoint-tablet) {
                    font-size: 7vh;
                    line-height: 7vh;
                    margin-bottom: 6vh;
                }
                .name-wrap {
                    display: inline-block;
                    height: 13.2vh;
                    overflow: hidden;
                    @media only screen and (max-width: $breakpoint-tablet) {
                        height: 7.8vh;
                    }
                    .inner, span {
                        display: block;
                    }
                    .name {
                        opacity: 0;
                        transform: translateY(20px);
                        text-transform: capitalize;
                    }
                }
            }
           
            .view-detail, .model {
                width: 100%;
                display: flex;
                justify-content: center;
            }
            .view-detail {
                font-size: $meta-font-size;
            }
        }

        a {
            color: #000;
            text-decoration: none;
        }

    }

    .progress {
        position: fixed;
        right: 10vw;
        line-height: 20px;
        font-weight: 700;
        font-size: 16px;
        transform: rotate(90deg) translateY(-50%);
        top: 50%;
        opacity: 0;
        line-height: 20px;
        font-weight: 700;
        font-size: $meta-font-size;
        @media only screen and (max-width: $breakpoint-tablet) {
           
        }
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

