import * as THREE from 'three'
import gsap from 'gsap'

import Events from '~/components/GL/events.js'

export default class Scene {

    constructor() {
        
        this.scene = new THREE.Scene()
        
        this.camera = new THREE.PerspectiveCamera(
            45,
            APP.winW / APP.winH,
            0.1,
            100
        )

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector(".sculpture-slideshow canvas"),
            antialias: true,
            alpha: true
        });

        this.setup()
        this.addEvents()

        this.render()
    }

    setup() {

        this.renderer.setPixelRatio(gsap.utils.clamp(1.5, 1, window.devicePixelRatio))
        this.renderer.setSize( APP.winW, APP.winH )
        this.renderer.setClearColor( 0x000000, 0 )
        this.renderer.outputEncoding = THREE.sRGBEncoding

        this.camera.position.set(0, 0, 50)
        this.camera.lookAt(0, 0, 0)

        this.clock = new THREE.Clock()
        this.run()

    }

    addEvents() {
        window.addEventListener('resize', () => {
            this.resize()
        })
    }

    resize() {
  
        this.renderer.setSize(APP.winW, APP.winH)
        this.camera.updateProjectionMatrix()

        this.scene.children.forEach((el, i) => {
            const fish = this.scene.children[i]
            fish.resize()
        })

    }

    run() {

        let elapsed = this.clock.getElapsedTime()

        this.scene.children.forEach( (el, i) => {
            const fish = this.scene.children[i]
            //fish.updatePosition(current)
            fish.updateTime(elapsed)
        })

        this.render()
        requestAnimationFrame(() => {
            this.run()
        })
    }

    render() {
   
        this.renderer.render(this.scene, this.camera);
    }

}