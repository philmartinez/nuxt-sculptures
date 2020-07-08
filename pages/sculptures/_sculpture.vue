<template>

<div class="single-sculpture">
    <div class="product-images">


    </div>
    <div class="product-meta">
        <div class="inner">
            <span class="collection">{{ fish.type }} Collection <span class="sep"></span> {{ fish.artist}}</span>
            <h1 :style="`color: ${fish.bg_color};`">Model {{ fish.name }} </h1>
            <div class="description">{{ fish.description }}</div>
            <div class="buttons">
                <button>Purchase <span>{{ fish.price }}</span></button>
            </div>
        </div>
    </div>
</div>

</template>

<script>

import { mapState } from 'vuex'

export default {
    data() {
        return {
            fishSet: false,
            sculpture: this.$route.params.sculpture
        }
    },
    computed: {
        ...mapState(['items','loaded', 'page']),
        fish() {
            return this.items.find( item => item.name.toLowerCase() === this.sculpture )
        }
    },

    methods: {
        changeFish() {
            const index = this.fish.id-1
            APP.Slideshow.state.activeSlideIndex = index
            APP.Slideshow.singleSculptureEnter()
            APP.Slideshow.changeSlide(index)
            APP.Slideshow.state.instant = true
            APP.Scene.shouldRun = true
            APP.Slideshow.slideTo(APP.Slideshow.slides[index])
        }
    },
    watch: {
        loaded: function(loaded) {
            // If user accesses single fish view directly
            if( loaded === true && this.fishSet === false) {
                this.changeFish()
            }
        }
    },
    mounted() {
        // back/forward history 
        if(this.loaded === true) {
            this.changeFish()
            this.fishSet = true
        }
    
    }
}
</script>

<style scoped lang="scss" scoped>

.single-sculpture {
    display: flex;
    position: relative;
    z-index: 10;
    .product-images {
        width: 50%;
    }
    .product-meta {
        padding: 6%;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        font-size: 16px;
        align-items: center;
        .inner {
            width: 100%;
            height: auto;
        }
        .collection {
            font-size: 14px;
            display: block;
            text-transform: capitalize;
            margin-bottom: -5px;
            display: flex;
            align-items: center;
        }
        .sep {
            display: inline-block;
            height: 1px;
            width: 20px;
            margin: 0 10px;
            background-color: #000;
        }
        h1 {
            margin-bottom: 30px;
        }
    }
}

.price {
    font-size: 24px;
    font-weight: 800;
}
.buttons {
    margin-top: 30px;
}
.buttons button {
    background: none;
    border: none;
    position: relative;
    text-align: left;
    padding: 15px 0px;
    display: block;
    width: 100%;
    &:after {
        position: absolute;
        content: '';
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background: #000;
    }
}

</style>
