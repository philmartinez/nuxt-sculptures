
import * as THREE from 'three'
import O from '~/components/GL/Object.js'
import vertexShader from '~/components/GL/shaders/fish/background-vertex.glsl'
import vertexShaderSingle from '~/components/GL/shaders/fish/background-single-vertex.glsl'

//import fragmentShaderDown from '~/components/GL/shaders/fish/background-down-fragment.glsl'
import fragmentShader from '~/components/GL/shaders/fish/background-fragment.glsl'


import gsap from 'gsap'

const geometry = new THREE.PlaneBufferGeometry(1,1,20,20)
const material = new THREE.ShaderMaterial({
    fragmentShader: fragmentShader,
    vertexShader: vertexShader,
    side: THREE.DoubleSide
})

export default class ColorBG extends O {

    init(el, color) {
        super.init(el)
        
        this.el = el
        this.color = new THREE.Color(color)
        this.GLscene = APP.Scene

        this.geometry = geometry
        this.material = material.clone()

        //this.currColor = new THREE.Color( 0xFFFFFF );
        //this.nextColor = new THREE.Color( 0x00ff00 );
        
        this.material.uniforms = {
            uColor: { value: new THREE.Vector3( this.color.r, this.color.g, this.color.b) },
            //uNextColor: { value: new THREE.Vector3( this.nextColor.r, this.nextColor.g, this.nextColor.b) },
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
            uResolution: new THREE.Uniform(new THREE.Vector2(APP.winW, APP.winH)),
            uViewHeight: { value: 0 },
            uEndSize: new THREE.Uniform(new THREE.Vector2(1, 1)),
            uPlaneCenter: new THREE.Uniform(new THREE.Vector2(0, 0)),
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
   
    /*
    changeColor(color, ease = 'inOut') {
        
        this.animating = true

        this.nextColor = new THREE.Color(color)
        this.material.uniforms.uNextColor.value = new THREE.Vector3(this.nextColor.r, this.nextColor.g, this.nextColor.b)
        
        //this.material.uniforms.uCurrColor.value = new THREE.Vector3(this.currColor.r, this.currColor.g, this.currColor.b)
        //this.currColor = new THREE.Color(color)
        
        const duration = ease === 'inOut' ? 1.4 : 0.8
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
            ease: `power3.${ease}`,
            value: 1,
        })

    

    } 
    */
  /*
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
  
    previewColorRAF() {

        if( this.preview ) {
           this.material.uniforms.uProg.value += (Math.abs(this.previewX/APP.winW*1.5) - this.material.uniforms.uProg.value ) * 0.13 
        }

        requestAnimationFrame(() => { this.previewColorRAF() })
    } 

    previewColorReset() {

        this.preview = false

        gsap.to(this.material.uniforms.uProg, {
            value: 0,
            duration: 0.4,
            ease: 'power1.out',
            onComplete: () => {
                //this.GLscene.shouldRun = false;
            }
        })
    } */

    singleView() {
        
        // change shader
        this.material.vertexShader = vertexShaderSingle
        this.material.needsUpdate = true


        const viewSize = this.GLscene.getViewSize()

        this.material.uniforms.uMeshScale.value.x = this.bounds.width
        this.material.uniforms.uMeshScale.value.y = this.bounds.height

        
        // objects are already aligned in the middle, 
        // so we manually caluclate the new Y top move it to the top

        /*if(APP.onMobile) {
            this.material.uniforms.uEndSize.value = new THREE.Vector2(
                viewSize.width,
                viewSize.height/2.857, // shink to 35% of the screen height
            )
        } else { */
        this.material.uniforms.uEndSize.value = new THREE.Vector2(
            viewSize.width,
            viewSize.height
        )

        // remove shadow
        gsap.to(this.material.uniforms.uShadowAmp,{
            value: 0,
            duration: 1,
            ease: 'power1.inOut' 
        });
        
        
        
        // full size color
        this.singleTL.play()
            
        
        gsap.fromTo(this.material.uniforms.uTimeProg, {
            value: 4.5,
        },{
            value: 6,
            duration:1.5,
            ease: 'power1.inOut'
        })
       
       
    }

    singleViewExit() {
        
        // full size color
        this.singleTL.reverse()
        

        gsap.fromTo(this.material.uniforms.uTimeProg, {
            value: 4.5,
        },{
            value: 6,
            duration:1.5,
            ease: 'power1.inOut'
        });

        // add shadow
        gsap.to(this.material.uniforms.uShadowAmp,{
            value: 1,
            duration: 1,
            ease: 'power1.inOut',
            delay: 0.5
        });
       
       
    }
    
   
    waveTLs() {
        this.waveTL = gsap.timeline({ paused: true })
        this.quickWaveTL = gsap.timeline({ paused: true })
        this.singleTL = gsap.timeline({ 
            paused: true,
            onReverseComplete: () => {
                // change shader
                this.material.vertexShader = vertexShader
                this.material.needsUpdate = true
            }
         })

        this.singleTL.fromTo(this.material.uniforms.uAmp,{
            value: 0
        }, {
            value: 1,
            duration: 1.4,
            ease: 'power1.inOut'
        })

        /*
        this.waveTL
            .fromTo(this.material.uniforms.uAmp, {
                value: 0    
            },{
                value: 1.25,
                duration: 0.5,
                delay:0.2,
                ease: 'sine.out',
            })

        this.waveTL.pause() */

  
    }

    quickWave() {

        gsap.fromTo(this.material.uniforms.uAmp, {
            value: 0    
        },{
            value: 2,
            duration: 0.6,
            ease: 'power2.in',
            onComplete: () => {
                gsap.fromTo(this.material.uniforms.uAmp, {
                    value: 2 
                },{
                    value: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                })
            }
        })
        this.material.uniforms.uTimeProg.value = 4.5 // faster rate
       
          
    }


    constantWaveStart() {
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

        this.scale.x = this.bounds.width 
        this.scale.y = this.bounds.height
    

        if (!this.material) return;
        this.material.uniforms.uMeshSize.value.x = this.bounds.width 
        this.material.uniforms.uMeshSize.value.y = this.bounds.height


        if( APP.state.view === 'single' ) {
           
            const viewSize = this.GLscene.getViewSize()
            
            this.material.uniforms.uMeshScale.value.x = this.bounds.width
            this.material.uniforms.uMeshScale.value.y = this.bounds.height
            this.material.uniforms.uEndSize.value = new THREE.Vector2(
                viewSize.width,
                viewSize.height
            )
        }

    }

}