
import * as THREE from 'three'
import O from '~/components/GL/Object.js'
import vertexShader from '~/components/GL/shaders/fish/background-vertex.glsl'
import fragmentShaderDown from '~/components/GL/shaders/fish/background-down-fragment.glsl'
import fragmentShaderUp from '~/components/GL/shaders/fish/background-up-fragment.glsl'

import gsap from 'gsap'

const geometry = new THREE.PlaneBufferGeometry(1,1,64,64)
const material = new THREE.ShaderMaterial({
    fragmentShader: fragmentShaderUp,
    vertexShader: vertexShader
})

export default class ColorBG extends O {

    init(el) {
        super.init(el)
        
        this.el = el
        this.GLscene = APP.SceneBG

        this.geometry = geometry
        this.material = material.clone()

        this.currColor = new THREE.Color( 0xFFFFFF );
        this.nextColor = new THREE.Color( 0x00ff00 );

        this.material.uniforms = {
            uCurrColor: { value: new THREE.Vector3( this.currColor.r, this.currColor.g, this.currColor.b) },
            uNextColor: { value: new THREE.Vector3( this.nextColor.r, this.nextColor.g, this.nextColor.b) },
            uMeshSize: { value: [this.rect.width, this.rect.height] },
            uTime: { value: 0 },
            uProg: { value: 0 },
            uTimeProg: { value: 0 },
            width: { type: "f", value:1.0 },
            uAmp: { value: 0 }
        }

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.add(this.mesh)
        
        this.GLscene.scene.add(this)

    }

    changeColor(color) {
        
        this.nextColor = new THREE.Color(color)
        this.material.uniforms.uNextColor.value = new THREE.Vector3(this.nextColor.r, this.nextColor.g, this.nextColor.b)
        
        const tl = gsap.timeline({

          onComplete: () => {

            this.GLscene.shouldRun = false;

            this.currColor = new THREE.Color(color)
            this.material.uniforms.uCurrColor.value = new THREE.Vector3(this.currColor.r, this.currColor.g, this.currColor.b)
          }

        });

        this.GLscene.shouldRun = true;

        tl.fromTo(this.material.uniforms.uProg, {
            value: 0
        }, {
            duration: 1.12,
            ease: "power2.inOut",
            value: 1,
            delay: 0.05
        })

    }

    changeShader(direction) {
        if( 'down' === direction ) {
            this.material.fragmentShader = fragmentShaderUp;
        } else {
            this.material.fragmentShader = fragmentShaderDown
        }
        this.material.needsUpdate = true
      
    }

    updateTime(time) {
        this.material.uniforms.uTime.value = time;
    }

    resize() {
        super.resize();
        if (!this.material) return;
        this.material.uniforms.uMeshSize.value.x = this.rect.width;
        this.material.uniforms.uMeshSize.value.y = this.rect.height;
    }

}