import * as THREE from 'three'
import gsap from 'gsap'
import Scene from '~/components/GL/Scene.js'

export default class SceneBG extends Scene {
    
    lightsCameraAction() {

        this.scene = new THREE.Scene()
        
        this.camera = new THREE.PerspectiveCamera(
            70, // fov
            APP.winW / APP.winH, // aspect
            300, // near
            1000 // far
        )

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("#sculpture-bg-gl"),
            antialias: true,
            alpha: true
        })
    }
}