import * as THREE from 'three'
import gsap from 'gsap'

//import Events from '~/components/GL/events.js'

export default class Scene {

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
        this.addEvents()

        this.render()
    }

    setup() {

        this.renderer.setPixelRatio(gsap.utils.clamp(1.5, 1, window.devicePixelRatio))
        this.renderer.setSize( window.innerWidth, window.innerHeight )
        this.renderer.setClearColor( 0xfffffff, 0 )
        this.renderer.outputEncoding = THREE.sRGBEncoding

        this.cameraDistance = 400
        this.camera.position.set(0, 0, this.cameraDistance)
        this.camera.lookAt(0, 0, 0)

        this.clock = new THREE.Clock();

    }

    addEvents() {
        window.addEventListener('resize', this.resize.bind(this))
        //Events.on('tick', this.run);
    }

    resize() {
        
        APP.winH = window.innerHeight
        APP.winW = window.innerWidth

        this.renderer.setSize(APP.winW, APP.winH)
        this.camera.aspect = APP.winW / APP.winH

        this.camera.fov =
         2 *
         Math.atan(APP.winW / this.camera.aspect / (2 * this.cameraDistance)) *
         (180 / Math.PI) // in degrees

         //this.customPass.uniforms.resolution.value.y = STATE.winH / STATE.winW;

        this.camera.updateProjectionMatrix()

    }

    run() {

    }

    render() {
   
        this.renderer.render(this.scene,this.camera)

        requestAnimationFrame(() => { this.render() })
    }

}