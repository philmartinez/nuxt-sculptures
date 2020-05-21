
import * as THREE from 'three'
import O from '~/components/GL/Object.js'
import fragmentShader from '~/components/GL/shaders/fragment.glsl'
import vertexShader from '~/components/GL/shaders/vertex.glsl'

import gsap from 'gsap'

const geometry = new THREE.PlaneBufferGeometry(1,1,64,64)
const material = new THREE.ShaderMaterial({
    fragmentShader,
    vertexShader,
    transparent: true
})

export default class Fish extends O {

    init(el, parentEl) {

        super.init(el)

        this.parentEl = parentEl
        this.GLscene = APP.Scene

        this.geometry = geometry
        this.material = material.clone()

        this.material.uniforms = {
            uCurrTex: { value: 0 },
            uNextTex: { value: 0 },
            uDisp: { value: new THREE.TextureLoader().load('/displacement.png') },
            uMeshSize: { value: [this.rect.width, this.rect.height] },
            uImageSize: { value: [0, 0] },
            uTime: { value: 0 },
            uProg: { value: 0 },
            uAmp: { value: 0 }
        }

        this.textures = []

        this.state = {
            current: 0
        }

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.add(this.mesh)
        
        this.GLscene.scene.add(this)

        this.loadTextures();
    }

    loadTextures() {

        const manager = new THREE.LoadingManager(() => {
            // Set first fish as default
            this.material.uniforms.uCurrTex.value = this.textures[0]
        });

        const loader = new THREE.TextureLoader(manager);
        const fishImgs = [...this.parentEl.querySelectorAll('img')]

        fishImgs.forEach( (img) => {
            loader.load(img.src, texture => {

                texture.minFilter = THREE.LinearFilter
                texture.generateMipmaps = false
        
                this.material.uniforms.uImageSize.value = [img.naturalWidth, img.naturalHeight]
                this.textures.push(texture)

            })
        })
    }

    switchTextures(index) {

        this.state.current = index;
        this.material.uniforms.uNextTex.value = this.textures[index];
    
        const tl = gsap.timeline({
          onComplete: () => {
            this.material.uniforms.uCurrTex.value = this.textures[index];
          }
        });
    
        tl
          .fromTo(this.material.uniforms.uProg, {
            value: 0
          }, {
            value: 1,
            duration: 1.1,
            ease: 'power1.inOut',
          });

          tl
          .fromTo(this.material.uniforms.uAmp, {
              value: 0
          },{
            value: 1,
            duration: 0.6,
            ease: 'power1.in',
          },'-=1.1')
          .fromTo(this.material.uniforms.uAmp, {
            value: 1
          }, {
            value: 0,
            duration: 0.5,
            ease: 'power1.out',
          },'-=0.5')

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