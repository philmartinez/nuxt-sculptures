
import * as THREE from 'three'
import O from '~/components/GL/Object.js'
import fragmentShader from '~/components/GL/shaders/fish/fish-fragment.glsl'
import vertexShader from '~/components/GL/shaders/fish/fish-vertex.glsl'

import gsap from 'gsap'

const geometry = new THREE.PlaneBufferGeometry(1,1,14,14)
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
            uTexture: { value: 0 },
            uMeshSize: { value: [this.rect.width, this.rect.height] },
            uImageSize: { value: [0, 0] },
            uTime: { value: 0 },
            uMultiplier: { value: 9.0 },
            uTimeProg: { value: 0 },
            uPreview: { value: 0 },
            uPreviewTimeProg: { value: 0},
            uProg: { value: 0 },
            uAmp: { value: 0 },
            uVelo: { value: 0 }
        }

        this.state = {
            current: 0
        }

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.add(this.mesh)
        
        this.position.z = 120

        this.resize()
        window.addEventListener('resize',() => { this.resize() })

        this.GLscene.scene.add(this)

        this.loadTextures()
    
        this.previewTimeline()
    }

    setBounds() {
      super.setBounds()
    }

    loadTextures() {

        const loader = new THREE.TextureLoader();
        const fishImg = this.el.querySelector('img')

       
        loader.load(fishImg.src, texture => {

            texture.minFilter = THREE.LinearFilter
            texture.generateMipmaps = false
    
            this.material.uniforms.uImageSize.value = [fishImg.naturalWidth, fishImg.naturalHeight]
            this.material.uniforms.uTexture.value = texture;

            setTimeout(() => {
              //this.GLscene.shouldRun = false;
            }, 300)
           

        })
       
    }
    /*
    switchTextures(index, ease) {

        
        let { texture } = this.getTexture(index)[0]

        this.state.current = index;
        //this.material.uniforms.uNextTex.value = texture;
    
        const tl = gsap.timeline({
          onComplete: () => {
            //this.material.uniforms.uCurrTex.value = texture;
           // this.GLscene.shouldRun = false;
          }
        });

        let duration, firstEase, texSwapDivider = ''

        if(ease === 'out') {
          this.material.uniforms.uMultiplier.value = 6.0
          duration = 0.95
          firstEase = 'out' 
          texSwapDivider = 1.2
        } else {
          this.material.uniforms.uMultiplier.value = 9.0
          duration = 1.2
          firstEase = 'in' 
          texSwapDivider = 2
        }

        //this.GLscene.shouldRun = true;

        this.previewTL.seek(0).pause()


          // Wave
          tl
          .fromTo(this.material.uniforms.uAmp, {
              value: 0
          },{
            value: 1,
            duration: duration/2,
            ease: `sine.${firstEase}`,
          })
          .fromTo(this.material.uniforms.uAmp, {
            value: 1
          }, {
            value: 0,
            duration: duration/2,
            ease: 'sine.out',
          })
          tl
          .fromTo(this.material.uniforms.uTimeProg, {
              value: 1.7
          },{
            value: 11,
            duration: duration,
            ease: ease === 'out' ? 'sine.out' : 'sine.inOut',
          },`-=${duration}`)



          // Texture opacity
          tl
          .fromTo(this.material.uniforms.uProg, {
            value: 0
          }, {
            value: 1,
            duration: 0.01,
            ease: 'none',
          },`-=${duration/texSwapDivider}`);

    } */
    
    previewTimeline() {

      this.previewTL = gsap.timeline()

      this.previewTL.fromTo(this.material.uniforms.uPreview,{
          value: 0
      }, {
          value: 1,
          duration: 0.5,
          ease: 'power1.in'
      },'start')
      

      this.previewTL.to(this.material.uniforms.uPreview, {
        value: 0,
        duration: 0.5,
        ease: 'power1.out',
        onComplete: () => {
          //this.GLscene.shouldRun = false;
        }
      })
      
      this.previewTL.fromTo(this.material.uniforms.uPreviewTimeProg, {
          value: 1.7
      }, {
          value: 11,
          duration: 1,
          ease: 'sine.inOut'
      },'-=1')

      this.previewTL.pause()

    }

    previewFlopInit() {
      //this.GLscene.shouldRun = true;
      this.previewTL.play('start')
    }


    updateTime(time) {
        this.material.uniforms.uTime.value = time
    }

    resize() {
        this.setBounds()
        this.scale.x = this.bounds.width 
        this.scale.y = this.bounds.height

        if (!this.material) return

        this.material.uniforms.uMeshSize.value.x = this.bounds.width 
        this.material.uniforms.uMeshSize.value.y = this.bounds.height

        //this.GLscene.shouldRun = true
        //setTimeout(() => { this.GLscene.shouldRun = false }, 80)
        
    }

}