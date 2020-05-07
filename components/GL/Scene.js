import * as THREE from 'three'

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