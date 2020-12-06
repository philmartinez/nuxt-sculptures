import * as THREE from 'three'
import gsap from 'gsap'
import Fish from '~/components/GL/Fish.js'
import ColorBG from '~/components/GL/ColorBG.js'
import { Vector3 } from 'three';
import { clamp } from 'lodash';

gsap.defaults({
    ease: "power2.inOut", 
    duration: 1.2
});

// make bg color and slide change based on this.getClosestSlide()

export default class Slideshow {

    constructor(items) {

        // Data
        this.items = items

        // DOM
        this.els = {
            parent: document.querySelector('.sculpture-slideshow'),
            slides: document.querySelectorAll('.sculpture-slideshow .sculpture'),
            slideSizer: document.querySelector('.sculpture-slideshow .sculptures .img-wrap'),
            slideType: document.querySelector('.sculpture-slideshow .sculpture-type'),
            slideBGcolor: document.querySelector('.sculpture-bg-color'),
            sculptureMetaLinks: Array.from(document.querySelectorAll('.sculpture-slideshow .sculpture-meta .link a')),
            sculptureMetaName: document.querySelector('.sculpture-slideshow .sculpture-meta .name-wrap .inner .name'),
            sculptureBGtext: {},
            sculptureTracking: {}
        }

        // State
        this.state = {
            activeSlide: 0,
            activeSlideIndex: 0,
            prevSlideIndex: 0,
            prevSlideType: 0,
            duration: 0,
            easing: 'inOut',
            ease: 0.12,
            changingSlides: false,
            previewColorDir: 'down',
            direction: 'down',
            dragging: false,
            instant: true,
            targetX: 0,
            targetY: 0,
            fishTargetY: 0,
            velocity: 0,
            offX: 0,
            lerpX: 0,
            lerpColorX: 0,
            lerpVel: 0
        }
        this.GLTL = {
            scene: gsap.timeline({ paused: true })
        }


        this.setup()
        this.events()
        
    }

    setup() {

        // Store
        this.slides = this.getSlides()

        // GL 
        this.createGLTL()

        // DOM
        this.createMarkup()

        // Start the slider
        this.state.prevSlideType = this.slides[0].type
        this.changeSlide(0)
        this.state.duration = 0.7
        this.transformSlides()

    }

    events() {

        document.addEventListener('wheel', (e) => {

            if( this.state.changingSlides ) return
           
            // next
            if( e.deltaY > 5 ) {
                this.state.direction = 'down'
                this.state.activeSlideIndex = this.getNextSlideI()
                
            } 
            // prev
            else if( e.deltaY < -5 ) {
                this.state.direction = 'up'
                this.state.activeSlideIndex = this.getPrevSlideI()
            }

            if( e.deltaY > 5 || e.deltaY < -5) {
                this.state.easing = 'inOut'
                
                // Change slide
                clearTimeout(this.glAnimation)
                this.state.changingSlides = true
                APP.Scene.shouldRun = true

                this.slideTo(this.slides[this.state.activeSlideIndex])

                // Quick Wave
                //this.ColorBG.quickWave()

 
                // stop all future events for 1 second
                setTimeout( () => { this.state.changingSlides = false }, 1450 )
                
                
            }
            
        })

        document.addEventListener('mousedown', this.onDown.bind(this) )
        document.addEventListener('mousemove', this.onMove.bind(this) )
        document.addEventListener('mouseup', this.onUp.bind(this) )
    
        
        this.els.parent.querySelector('.link').addEventListener('mouseover', this.viewDetailOver.bind(this) )
        this.els.parent.querySelector('.link').addEventListener('mouseleave', this.viewDetailLeave.bind(this) )

        window.addEventListener('resize',() => { 
            this.state.instant = true
            clearTimeout(this.glAnimation)
            APP.Scene.startRender()
            this.slideTo(this.getClosestSlide())
        })
    }

    createGLTL() {

        let tweens = []
        
        this.slides.forEach((slide) => {

            tweens.push( 
                gsap.to(slide.Fish.position,{
                    z: 10,
                    duration: 0.6,
                    ease: 'power1.inOut'
                })
            )
            tweens.push( 
                gsap.to(slide.ColorPlane.position,{
                    z: -30,
                    duration: 0.6,
                    ease: 'power1.inOut'
                })
            )

        })

        this.GLTL.scene.add(tweens)
        
    }
    createMarkup() {


        // Bg type
        this.els.sculptureType = document.createElement('div');
        this.els.sculptureType.classList.add('sculpture-type')
        this.els.sculptureType.innerHTML = `<span class="grouper">
            <span>G</span>
            <span>r</span>
            <span>o</span>
            <span>u</span>
            <span>p</span>
            <span>e</span>
            <span>r</span>
        </span>
        <span class="snapper">
            <span>S</span>
            <span>n</span>
            <span>a</span>
            <span>p</span>
            <span>p</span>
            <span>e</span>
            <span>r</span>
        </span>
        <span class="bowhead">
            <span>B</span>
            <span>o</span>
            <span>w</span>
            <span>h</span>
            <span>e</span>
            <span>a</span>
            <span>d</span>
        </span>`

        // Total count
        this.els.sculptureTotal = document.createElement('div')
        this.els.sculptureTotal.classList.add('progress')
        this.els.sculptureTotal.innerHTML = `
            <span class="number">No.</span>
            <span class="current">
                <span class="inner">1</span>
            </span>
            <span class="indicator"><span></span></span>
            <span class="total">${this.slides.length}</span>`

        // Cache els.
        this.els.sculptureBGtext.bowhead = this.els.sculptureType.querySelector('.bowhead')
        this.els.sculptureBGtext.grouper = this.els.sculptureType.querySelector('.grouper')
        this.els.sculptureBGtext.snapper = this.els.sculptureType.querySelector('.snapper')
        this.els.sculptureViewDetail = this.els.parent.querySelector('.view-detail')

        // Append els.
        this.els.parent.appendChild(this.els.sculptureType)
        this.els.parent.querySelector('.sculpture-meta').prepend(this.els.sculptureTotal)
        this.els.sculptureTracking.number = this.els.parent.querySelector('.current .inner')
        this.els.sculptureTracking.indicator = this.els.parent.querySelector('.indicator span')

    }

    viewDetailOver() {
        if( this.state.changingSlides ) return
        //this.Fish.previewFlopInit()
    }

    viewDetailLeave() {
       
    }

    onDown(e) {
        if( this.state.changingSlides ) return

        clearTimeout(this.glAnimation)

        APP.Scene.startRender()
        this.state.dragging = true
        this.state.ease = 0.11
        this.startMouseX = this.getPosition(e).x
        this.endMouseX = 0 // reset

        //this.ColorBG.constantWaveStart()

        this.GLTL.scene.play()
        
    }

    onMove(e) {
        if( !this.state.dragging || this.state.changingSlides ) return
        
        
        const limit = this.slides[this.slides.length-1].Fish.bounds.left - APP.winW*0.325 


        let currentX = this.getPosition(e).x
        this.endMouseX = (currentX - this.startMouseX) 
      
        this.state.targetX = clamp(this.state.offX + this.endMouseX * (1 + APP.winW/1400), `-${limit}`, 0)
       
        // when dragging past bounds, reset tracking
        if( this.state.targetX == `-${limit}` || this.state.targetX == 0) {
            this.state.offX = this.state.targetX
            this.endMouseX = 0
            this.startMouseX = this.getPosition(e).x
            return;
        }
      
        /*
        if( this.endMouseX >= 0 || this.endMouseX < 0 ) {

            if( this.endMouseX < 0 ) {
                color = this.slides[this.getNextSlideI()].bg_color 
                this.state.previewColorDir = 'down'
            } else {
                color = this.slides[this.getPrevSlideI()].bg_color 
                this.state.previewColorDir = 'up'
            } 
         

        } */


    }   

    onUp() {

        if( !this.state.dragging || this.state.changingSlides ) return

        this.state.dragging = false
  
        setTimeout( () => { 
            if(APP.state.view === 'single') return
            this.slideTo(this.getClosestSlide()) 
        },200)
        
        
        this.state.offX = this.state.targetX

        this.GLTL.scene.reverse()
        
        
        this.state.direction = this.state.previewColorDir

        if( this.endMouseX <= -20 || this.endMouseX >= 20) {
        
            this.state.easing = 'out'
           
            return
        }
        
    
    
    }



    changeSlide(index, ease) {

        // DOM
        this.state.activeSlide = this.slides[index]

        this.updateSculptureText(index)
        this.updateSculptureLink()
   
        //this.Fish.switchTextures(index, ease)
        //this.ColorBG.changeColor(this.state.activeSlide.bg_color, ease)
        //this.ColorBG.changeShader(this.state.direction)
        //this.ColorBG.preview = false

        // State
        //this.state.changingSlides = true
        //setTimeout( () => { this.state.changingSlides = false }, 300 )
    
    }

    transformSlides() {

        let ease = this.state.instant ? 1 : this.state.ease


        // Lerp Movement
        this.state.lerpX += (this.state.targetX - this.state.lerpX) * ease
        this.state.lerpColorX += (this.state.targetX - this.state.lerpColorX) * ease/1.05
        
        // Track Velocity
        this.state.lerpVel += (this.state.targetX - this.state.lerpVel) * ease

        let clampVal  = (this.state.changingSlides) ? 0.8 : 1.3
        let multVal   = (this.state.changingSlides) ? 0.006 :  0.005
        let colorVelD = 2.0

        if( APP.onMobile ) {
            clampVal = clampVal*2
            multVal =  multVal*2
            colorVelD = 1
        }
        this.state.velocity = clamp((this.state.targetX - this.state.lerpVel ) * multVal, `-${clampVal}`, clampVal)


        // Update GL
        this.slides.forEach((slide) => {
             
            // Move
            slide.Fish.updatePos(this.state.lerpX, this.state.fishTargetY)
            slide.ColorPlane.updatePos(this.state.lerpColorX, this.state.targetY)
        
            // Send uniforms
            slide.Fish.material.uniforms.uVelo.value = this.state.velocity
            slide.ColorPlane.material.uniforms.uVelo.value = this.state.velocity/colorVelD
            //APP.Scene.rgbShift.uniforms[ 'amount' ].value = this.state.velocity/80
        })
        //this.ColorBG.material.uniforms.uVelo.value = this.state.velocity
        
        this.state.instant = false

        requestAnimationFrame(() => { this.transformSlides() })
    }

    
    updateSculptureText(index) {

        /*
        let tl = gsap.timeline()

        // BG Text.
        let typeOut = this.els.sculptureBGtext[this.state.prevSlideType]
        let typeIn = this.els.sculptureBGtext[this.state.activeSlide.type]
        
        //// In.
        tl.fromTo(typeIn.querySelectorAll('span'), {
            rotateX: this.state.direction == 'down' ? -90 : 90,
            y: this.state.direction == 'down' ? '23vh' : '-23vh',
            z: -100
        },{
            opacity: 1,
            rotateX: 0,
            y: '0vh',
            z: 0,
            stagger: 0.06,
            duration: 0.78,
            ease: `power2.${this.state.easing}`
        })

         //// Out.
         tl.fromTo(typeOut.querySelectorAll('span'), {
            opacity: 1,
            rotateX: 0,
            z: 0,
            y: '0vh'
        },{
            rotateX: this.state.direction == 'down' ? 90 : -90,
            y: this.state.direction == 'down' ? '-23vh' : '23vh',
            z: -100,
            stagger: 0.06,
            duration: 0.78,
            ease: `power2.${this.state.easing}`
        },'-=1.2')
       
*/

        // Bottom Meta Name
        this.updateVerticalOverflowSelection(this.els.sculptureMetaName, () => {
            this.els.sculptureMetaName.innerHTML = `${this.state.activeSlide.type} ${this.state.activeSlide.name}`
        })
        
        // Tracking Number
        this.updateVerticalOverflowSelection(this.els.sculptureTracking.number, () => {
            this.els.sculptureTracking.number.innerHTML = index + 1
        })


        // Store previous type
        this.state.prevSlideType = this.state.activeSlide.type
        

     }


     updateVerticalOverflowSelection(el, callback) {

        let nameTL = gsap.timeline()
        
        nameTL.pause()
        
        let duration1 = (this.state.easing == 'inOut') ? 0.7 : 0.3
        let duration2 = (this.state.easing == 'inOut') ? 0.7 : 0.5

        nameTL.fromTo(el,{
            y: '0%'
        }, {
            y: this.state.direction == 'down' ? '-100%' : '100%',
            ease: this.state.easing == 'inOut' ? "power2.in" : "power1.out",
            duration: APP.state.view !== 'single' && !this.state.instant ? duration1 : 0,
            onComplete: () => {
                
                nameTL.call(callback)
                nameTL.fromTo(el,{
                    y: this.state.direction == 'down' ? '100%' : '-100%'
                }, {
                    y: '0%',
                    ease: this.state.easing == 'inOut' ? "power2.out" : "power1.out",
                    duration: APP.state.view !== 'single' && !this.state.instant ? duration2 : 0,
                })
            }
        })
        
      
        nameTL.play()
     }

     startingAnimation() {
      
        gsap.to([this.els.sculptureMetaName,this.els.sculptureTotal], {
            opacity: 1,
            stagger: 0.2,
            y: '0px',
            duration: 1,
            ease: "power2.Out"
        })
     }

     singleSculptureEnter() {

        this.state.changingSlides = true
        this.state.single = true
        
        APP.state.view = 'single'

        gsap.to([this.els.sculptureTotal, this.els.sculptureViewDetail, this.els.sculptureMetaName], {
            opacity: 0,
            stagger: 0.1,
            y: '20px',
            duration: 0.6,
            ease: "power2.Out"
        })

        // Transform Color BG
        this.GLTL.scene.reverse()
        

       const curPlane = this.slides[this.state.activeSlideIndex].ColorPlane

       // objects are already aligned in the middle, 
       // so we manually caluclate the new Y top move it to the top
        /*const tarY = APP.onMobile ? APP.winH/3.09 : 0
        const fishTarY = APP.onMobile ? APP.winH/8 : 0
        const tarX = APP.onMobile ? this.state.targetX  : this.state.targetX - APP.winW/3.09
        
        gsap.to(this.state, {
            targetY: tarY, // move up by 32%
            fishTargetY: fishTarY, // move up by 32%
            targetX: tarX,
            duration: 1,
            ease: 'power1.inOut'
        }) */
 
        curPlane.singleView()
        //this.slides[this.state.activeSlideIndex].Fish.flopStart()
        this.slides[this.state.activeSlideIndex].Fish.hideFishWithDisplacement()
        
     }

     singleSculptureExit() {
        this.state.changingSlides = false
        this.state.single = false
        APP.Scene.startRender()
        APP.Scene.stopRender(2200)
        APP.state.view = 'slider'
        gsap.to([this.els.sculptureTotal, this.els.sculptureViewDetail, this.els.sculptureMetaName], {
            opacity: 1,
            stagger: 0.1,
            y: '0px',
            duration: 0.6,
            ease: "power2.Out"
        })

        gsap.to(this.state, {
            targetY: 0,
            fishTargetY: 0,
            duration: 1,
            ease: 'power1.inOut'
        })

        const planes = [...this.els.slides].map((el) => {
            el.querySelector('.color-plane').classList.remove('top-aligned')
        })

        this.slides.map(slide => slide.ColorPlane).forEach((colorBG) => {
            colorBG.singleViewExit()
        })
        //this.slides[this.state.activeSlideIndex].Fish.flopReverse()
        this.slides[this.state.activeSlideIndex].Fish.showFishWithDisplacement()
        
     }


     updateSculptureLink() {

        this.els.sculptureMetaLinks.forEach((el, index) => {
            if( index === this.state.activeSlideIndex) {
                this.els.sculptureMetaLinks[index].classList.add('active')
            } else {
                this.els.sculptureMetaLinks[index].classList.remove('active')
            }
        })
     }
 

     // loop ready wrap logic
     getNextSlideI() {
        return gsap.utils.wrap(0, this.slides.length, this.state.activeSlideIndex + 1)
     }
     getPrevSlideI() {
        return gsap.utils.wrap(0, this.slides.length, this.state.activeSlideIndex - 1)
     }

    // store all slide data is js obj
    getSlides() {
        
        let arrEls = Array.from(this.els.slides);

        return arrEls.map((el,i) => {

            let title = el.querySelector('h2').textContent

            // grabbing the attrs from actual json to avoid using any data attrs in dom
            let currentItem = this.items.filter((el) => {
                return el.name === title
            });

            let { font_color, bg_color, type } = currentItem[0]
            
            const fish = new Fish()
            fish.init(el.querySelector('.img-wrap'), this.els.parent)

            const plane = new ColorBG()
            plane.init(el.querySelector('.color-plane'),bg_color)

            return {
                el: el,
                index: i,
                name: title,
                type: type,
                font_color: font_color,
                bg_color: bg_color,
                Fish: fish,
                ColorPlane: plane
            }
        })
    }

    
    getClosestSlide() {
        let closest = this.slides[0]
        const center = new Vector3()

        this.slides.map(slide => slide.Fish).forEach((fish, i) => {
            const closestDist = closest.Fish.position.distanceTo(center)
            const newDist     = fish.position.distanceTo(center)

            if (newDist < closestDist) {
                closest = this.slides[i]
            }
        })
     
        return closest
    }

    slideTo(slide) {

        const state = this.state
        let margin = APP.onMobile ? .25 : .325
       
        let targetX = (slide.Fish.bounds.left - (APP.winW*margin)) * -1
        
        //if(APP.state.view === 'single') {
        //    targetX += APP.winW*0.25;
        //}

        //drag
     
        if(!this.state.changingSlides || APP.state.view === 'single') {
            this.state.targetX = targetX
             state.offX = state.targetX
             // smoothe harsh velocity diff on drag
            this.state.lerpVel = targetX - this.state.velocity * 200
            this.state.easing = 'out'
        } else {
            state.ease = 0.18
            this.state.easing = 'inOut'
            gsap.to(state,{
                targetX,
                ease: 'power2.in',
                duration: 0.8,
                onComplete: () => {
                    state.offX = state.targetX
                }
            })
        }


        // pause GL after animation complete
        APP.Scene.stopRender(2200)
    


        this.state.activeSlideIndex = slide.index
        

        if( this.state.activeSlideIndex !== this.state.prevSlideIndex && !this.state.instant ) {
            this.changeSlide(slide.index,this.state.easing)
        } else {
          //  this.ColorBG.previewColorReset()
        }

        this.state.prevSlideIndex = slide.index

    }

    

    // normalize touch and mouse
    getPosition({clientX, clientY, changedTouches, target}) {
        const x = changedTouches ? changedTouches[0].clientX : clientX
        const y = changedTouches ? changedTouches[0].clientY : clientY

        return {
            x, y, target,
        }
    }

}