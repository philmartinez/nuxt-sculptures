import * as THREE from 'three'
import gsap from 'gsap'

import Events from '~/components/GL/events.js'

export default class Scene {

    constructor() {
        
        this.lightsCameraAction()
        this.setup()
        this.resize()
        this.addEvents()
        this.render()
    }

    lightsCameraAction() {

        this.scene = new THREE.Scene()
        
        this.camera = new THREE.PerspectiveCamera(
            70, // fov
            APP.winW / APP.winH, // aspect
            100, // near
            1000 // far
        )

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("#sculpture-gl"),
            antialias: true,
            alpha: true
        })
    }

    setup() {

        this.renderer.setPixelRatio(gsap.utils.clamp(1, 1.5, window.devicePixelRatio))
        this.renderer.setSize( APP.winW, APP.winH )
        this.renderer.setClearColor( 0x000000, 0 )
        this.renderer.outputEncoding = THREE.sRGBEncoding

        this.cameraDistance = 400;
        this.camera.position.set(0, 0, this.cameraDistance)
        this.camera.lookAt(0, 0, 0)

        this.shouldRun = false;
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
        this.camera.aspect = APP.winW / APP.winH;

        // Match HTML DOM
        this.camera.fov =
        2 *
        Math.atan( APP.winW / this.camera.aspect / (2 * this.cameraDistance) ) *
        (180 / Math.PI); // in degrees
        

        this.camera.updateProjectionMatrix()

        /*this.scene.children.forEach((el, i) => {
            const object = this.scene.children[i]
            object.resize()
        })*/

    }

    /*
    Gives the width and height of the current camera's view.
   */
    getViewSize() {
        const fovInRadians = (this.camera.fov * Math.PI) / 180;
        const height = Math.abs(
        this.camera.position.z * Math.tan(fovInRadians / 2) * 2
        );

        return { width: height * this.camera.aspect, height };
    }

    run() {
        
        if( this.shouldRun ) {
            let elapsed = this.clock.getElapsedTime()
           
            this.scene.children.forEach( (el, i) => {
                const object = this.scene.children[i]
                //object.updatePosition()
                object.updateTime(elapsed)
            })

            this.render()
        }
        
        requestAnimationFrame(() => {
            this.run()
        })
    }

    render() {
   
        this.renderer.render(this.scene, this.camera);
    }

}