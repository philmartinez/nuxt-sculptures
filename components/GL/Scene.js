import * as THREE from 'three'
import gsap from 'gsap'

import Events from '~/components/GL/events.js'

export default class Scene {

    constructor() {
        
        this.scene = new THREE.Scene()
        
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
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
        this.renderer.setClearColor( 0xfffffff, 0 )
        this.renderer.outputEncoding = THREE.sRGBEncoding

        this.cameraDistance = 50
        this.camera.position.set(0, 0, this.cameraDistance)
        this.camera.lookAt(0, 0, 0)

        this.clock = new THREE.Clock();

    }

    addEvents() {
        Events.on('resize', this.resize);
        Events.on('tick', this.run);
    }

    resize() {
        
        this.renderer.setSize(APP.winW, APP.winH)
        this.camera.updateProjectionMatrix()

        this.scene.children.forEach((el, i) => {
            const plane = this.scene.children[i]
            plane.resize()
        })

    }

    run({ current }) {

        let elapsed = this.clock.getElapsedTime()

        this.scene.children.forEach( (el, i) => {
            const plane = this.scene.children[i]
            plane.updatePosition(current)
            plane.updateTime(elapsed)
        })

        this.render()
    }

    render() {
   
        this.renderer.render(this.scene, this.camera);
    }

}