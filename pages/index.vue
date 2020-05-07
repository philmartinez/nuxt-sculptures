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


import * as THREE from 'three'

class SculptureScene {

    constructor() {
        
        this.scene = new THREE.Scene()
        
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            100,
            1000
        )

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector(".sculpture-slideshow canvas"),
            antialias: true,
            alpha: true
        });

        this.setup()
    }

    setup() {

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor( 0x000000 ); 
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.cameraDistance = 400;
        this.camera.position.set(0, 0, this.cameraDistance);
        this.camera.lookAt(0, 0, 0);

    }
}

class SculptureSlideshow {

    constructor() {

        this.slideshowEl = document.querySelector('.sculpture-slideshow')

        this.state = {
            activeID: 0
        }

        this.init()
        
    }

    init() {
        this.createMarkup()
    }

    createMarkup() {
        // create.
        this.headingEl = document.createElement('h2')
        this.headingEl.className = 'sculpture-name'
        this.headingElSpan = document.createElement('span')

        // append.
        this.headingEl.appendChild(this.headingElSpan)
        this.slideshowEl.appendChild(this.headingEl)
    }
}

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
        new SculptureScene()
        const slideshow = new SculptureSlideshow()
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
