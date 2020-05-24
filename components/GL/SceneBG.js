import * as THREE from 'three'
import gsap from 'gsap'
import Scene from '~/components/GL/Scene.js'

export default class SceneBG extends Scene {
    
    lightsCameraAction() {

        this.scene = new THREE.Scene()
        
        this.camera = new THREE.PerspectiveCamera(
            45,
            APP.winW / APP.winH,
            0.1,
            100
        )

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("#sculpture-bg-gl"),
            antialias: true,
            alpha: true
        })
    }
}