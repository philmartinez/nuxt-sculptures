
import * as THREE from 'three'
import O from '~/components/GL/Object.js'
import vertexShader from '~/components/GL/shaders/fish/background-vertex.glsl'
import vertexShaderSingle from '~/components/GL/shaders/fish/background-single-vertex.glsl'

import fragmentShaderDown from '~/components/GL/shaders/fish/background-down-fragment.glsl'
import fragmentShaderUp from '~/components/GL/shaders/fish/background-up-fragment.glsl'


import gsap from 'gsap'

const geometry = new THREE.PlaneBufferGeometry(1,1,20,20)
const material = new THREE.ShaderMaterial({
    fragmentShader: fragmentShaderUp,
    vertexShader: vertexShader
})

export default class ColorBG extends O {

    init(el) {
        super.init(el)
        
        this.el = el
        this.GLscene = APP.Scene

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
            uTimeProg: { value: 2.5 },
            width: { type: "f", value: 1.0 },
            uAmp: { value: 0 },
            uShadowAmp: { value: 0 },
            uVelo: { value: 0 },
            uMeshScale: new THREE.Uniform(new THREE.Vector2(1, 1)),
            uMeshPosition: new THREE.Uniform(new THREE.Vector2(0, 0)),
            uViewSize: new THREE.Uniform(new THREE.Vector2(1, 1))
        }
        this.waveTLs()

        this.resize()
        window.addEventListener('resize',() => { this.resize() })

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.add(this.mesh)
        
        this.position.z = 1 // behind fish
        this.GLscene.scene.add(this)
   
       
       

    }

    setBounds() {
        super.setBounds()
    }
   

    changeColor(color, ease = 'inOut') {
        
        this.animating = true
        this.nextColor = new THREE.Color(color)
        this.material.uniforms.uNextColor.value = new THREE.Vector3(this.nextColor.r, this.nextColor.g, this.nextColor.b)
        
        const duration = ease === 'inOut' ? 1.0 : 1.0
        const tl = gsap.timeline({

          onComplete: () => {

            //this.GLscene.shouldRun = false
            this.animating = false
            this.currColor = new THREE.Color(color)
            this.material.uniforms.uCurrColor.value = new THREE.Vector3(this.currColor.r, this.currColor.g, this.currColor.b)
          }

        });

        this.GLscene.shouldRun = true;


        tl.fromTo(this.material.uniforms.uProg, {
            value: this.material.uniforms.uProg.value != 1 ? this.material.uniforms.uProg.value : 0
        }, {
            duration: duration,
            ease: `power2.${ease}`,
            value: 1,
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

    previewColorInit(direction, color) {
        
        this.nextColor = new THREE.Color(color)
        this.material.uniforms.uNextColor.value = new THREE.Vector3(this.nextColor.r, this.nextColor.g, this.nextColor.b)

        this.changeShader(direction);
  
    }

    singleView() {

        // change shader
        this.material.vertexShader = vertexShaderSingle
        this.material.needsUpdate = true

        this.material.uniforms.uMeshScale.value.x = this.bounds.height*.45
        this.material.uniforms.uMeshScale.value.y = this.bounds.height*.45

        const viewSize = this.GLscene.getViewSize()
        this.material.uniforms.uViewSize.value = new THREE.Vector2(
            viewSize.width,
            viewSize.height
          )
         

        // full size color
        gsap.fromTo(this.material.uniforms.uAmp, {
            value: 0
        },{
            value: 1,
            duration: 1.3,
            ease: 'power1.inOut',
        })

        gsap.fromTo(this.material.uniforms.uShadowAmp, {
            value: 0
        },{
            value: 1,
            duration: 0.6,
            ease: 'power1.inOut'
        })
        gsap.to(this.material.uniforms.uShadowAmp,{
            value: 0,
            delay: 0.6,
            duration: 0.6,
            ease: 'power1.out'
        })
        gsap.fromTo(this.material.uniforms.uTimeProg, {
            value: 4.5,
        },{
            value: 6,
            duration:1,
            ease: 'power1.inOut'
        })
       
       
    }
    
   
    waveTLs() {
        this.waveTL = gsap.timeline({paused: true})
        this.quickWaveTL = gsap.timeline({paused: true})

        this.waveTL
            .fromTo(this.material.uniforms.uAmp, {
                value: 0    
            },{
                value: 1.25,
                duration: 0.5,
                delay:0.2,
                ease: 'sine.out',
            })

        this.waveTL.pause()

  
    }

    quickWave() {

        this.GLscene.shouldRun = true;

        gsap.fromTo(this.material.uniforms.uAmp, {
            value: 0    
        },{
            value: 1,
            duration: 0.3,
            ease: 'power1.out',
        })
        this.material.uniforms.uTimeProg.value = 4.5 // faster rate
       

        gsap.fromTo(this.material.uniforms.uAmp, {
            value: 1    
        },{
            value: 0,
            delay: 0.25,
            duration: 0.7,
            ease: 'power1.out',
        })
       
        
          
    }


    constantWaveStart() {

        this.GLscene.shouldRun = true;
        this.waveTL.play()
        this.material.uniforms.uTimeProg.value = 2.5 // slower rate
          
    }
    constantWaveEnd() {
        this.waveTL.reverse()
    }

    updateTime(time) {
        this.material.uniforms.uTime.value = time;
    }

    resize() {

        this.setBounds()

        if(APP.state.view === 'slider') {
            this.scale.x = this.bounds.height- this.bounds.height*.45
            this.scale.y = this.bounds.height - this.bounds.height*.45
        } else {
            this.scale.x = this.bounds.width 
            this.scale.y = this.bounds.height
        }
    

        if (!this.material) return;
        this.material.uniforms.uMeshSize.value.x = this.bounds.width 
        this.material.uniforms.uMeshSize.value.y = this.bounds.height
    }

}