
import * as THREE from 'THREE'
import O from '~/components/GL/Object.js'
import vertexShader from '~/components/GL/shaders/fish/background-vertex.glsl'
import fragmentShader from '~/components/GL/shaders/fish/background-fragment.glsl'

import gsap from 'gsap'

const geometry = new THREE.PlaneBufferGeometry(1,1,64,64)
const material = new THREE.ShaderMaterial({
    fragmentShader,
    vertexShader
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
            width: { type: "f", value: 5},
            scaleX: { type: "f", value: 7 },
            scaleY: { type: "f", value: 17.0 },
            resolution: { type: "v4", value: new THREE.Vector4() },
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
            this.currColor = new THREE.Color(color)
            this.material.uniforms.uCurrColor.value = new THREE.Vector3(this.currColor.r, this.currColor.g, this.currColor.b)
          }
        });

        tl.fromTo(this.material.uniforms.uTimeProg, {
            value: 0
        }, {
            duration: 0.6,
            ease: "power2.in",
            value: 1
        })
        tl.fromTo(this.material.uniforms.uTimeProg, {
            value: 1
        }, {
            duration: 0.6,
            ease: "power2.out",
            value: 0
        })

        tl.fromTo(this.material.uniforms.uProg, {
            value: 0
        }, {
            duration: 1.2,
            ease: "power2.inOut",
            value: 1
        },'-=1.2')

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