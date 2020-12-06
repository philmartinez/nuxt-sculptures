import * as THREE from 'three'
import gsap from 'gsap'


import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';


import Events from '~/components/GL/Events.js'

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
        this.renderer.setClearColor( 0xfbf7ef, 1 )
        this.renderer.outputEncoding = THREE.sRGBEncoding

        this.cameraDistance = 400;
        this.camera.position.set(0, 0, this.cameraDistance)
        this.camera.lookAt(0, 0, 0)

        // postprocessing
        this.composer = new EffectComposer( this.renderer );
        this.composer.addPass( new RenderPass( this.scene, this.camera ) );
                
        this.filmpass = new FilmPass( 0.45, 0.02, 1600, false )

       // this.composer.addPass( this.filmpass );
        
        
        this.shouldRun = true;
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
            console.log('run');
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
        //this.renderer.render(this.scene, this.camera);
        this.composer.render();
    }


    stopRender(timeout = 0) {
        clearTimeout(this.stopRenderTimeout)
        this.stopRenderTimeout = setTimeout(() => {
            this.shouldRun = false
        }, timeout)
    }
    startRender() {
        clearTimeout(this.stopRenderTimeout)
        this.shouldRun = true
    }

}