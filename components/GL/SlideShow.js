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
            previewColorTracked: false,
            previewColorDir: 'down',
            direction: 'down',
            dragging: false,
            instant: false,
            targetX: 0,
            velocity: 0,
            offX: 0,
            lerpX: 0,
            lerpX2: 0
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
        this.ColorBG = new ColorBG()
        this.ColorBG.init(this.els.slideBGcolor)
        this.createGLTL()

        // DOM
        this.createMarkup()

        // Start the slider
        this.transformSlides()
        this.state.prevSlideType = this.slides[0].type
        this.changeSlide(0)
        this.state.duration = 0.7

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
                this.ColorBG.quickWave()

 
                // stop all future events for 1 second
                setTimeout( () => { this.state.changingSlides = false }, 1250 )
                
                
            }
            
        })

        document.addEventListener('mousedown', this.onDown.bind(this) )
        document.addEventListener('mousemove', this.onMove.bind(this) )
        document.addEventListener('mouseup', this.onUp.bind(this) )
        
        this.els.parent.querySelector('.link').addEventListener('mouseup', this.viewDetailOpen.bind(this) )
        
        this.els.parent.querySelector('.link').addEventListener('mouseover', this.viewDetailOver.bind(this) )
        this.els.parent.querySelector('.link').addEventListener('mouseleave', this.viewDetailLeave.bind(this) )

        window.addEventListener('resize',() => { 
            this.state.instant = true
            clearTimeout(this.glAnimation)
            APP.Scene.shouldRun = true
            this.slideTo(this.getClosestSlide())
        })
    }

    createGLTL() {
        this.GLTL.scene.to(APP.Scene.scene.position,{
            z: -30,
            duration: 0.6,
            ease: 'power1.inOut'
        })
        this.GLTL.scene.to(this.ColorBG.position,{
            z: -50,
            duration: 0.6,
            ease: 'power1.inOut'
        },'-=0.6')
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

    viewDetailOpen() {
        this.singleSculptureEnter()
    }

    onDown(e) {
        if( this.state.changingSlides ) return

        clearTimeout(this.glAnimation)

        this.state.dragging = true
        this.state.ease = 0.11
        this.startMouseX = this.getPosition(e).x
        this.endMouseX = 0 // reset

        this.ColorBG.constantWaveStart()

        this.GLTL.scene.play()
        
    }

    onMove(e) {
        if( !this.state.dragging || this.state.changingSlides ) return
        
        APP.Scene.shouldRun = true;
        const limit = this.slides[this.slides.length-1].Fish.bounds.left - APP.winW*0.325 + 50


        let currentX = this.getPosition(e).x
        this.endMouseX = (currentX - this.startMouseX) 
        this.state.targetX = clamp(this.state.offX + this.endMouseX * 1.6, `-${limit}`, 50)
       
        // when dragging past bounds, reset tracking
        if( this.state.targetX == `-${limit}` || this.state.targetX == 50) {
            this.state.offX = this.state.targetX
            this.endMouseX = 0
            this.startMouseX = this.getPosition(e).x
        }
      
    
        
        //let color;

        if( !this.state.previewColorTracked && (this.endMouseX > 15 || this.endMouseX < -15) ) {
            
            /*
            this.ColorBG.material.uniforms.uProg.value = 0

            if( this.endMouseX < 0 ) {
                color = this.slides[this.getNextSlideI()].bg_color 
                this.state.previewColorDir = 'down'
            } else {
                color = this.slides[this.getPrevSlideI()].bg_color 
                this.state.previewColorDir = 'up'
            } */
            
            this.state.previewColorTracked = true

            /*this.ColorBG.preview = true
            this.ColorBG.previewColorInit(this.state.previewColorDir,color)
            this.ColorBG.previewColor = color */

        }
        
        this.ColorBG.previewX = this.state.previewColorDir === 'down' ? clamp(this.endMouseX,-3000, 0) : clamp(this.endMouseX,0, 3000)
       
     
    }   

    onUp() {
        if( !this.state.dragging || this.state.changingSlides ) return

        this.state.dragging = false
  
        setTimeout( () => { this.slideTo(this.getClosestSlide()) },200)
        
        
        this.state.offX = this.state.targetX

        this.state.previewColorTracked = false
        this.ColorBG.constantWaveEnd()

        this.GLTL.scene.reverse()
        
        if( this.endMouseX <= -20 ) {
            this.state.direction = 'down'
           // this.state.activeSlideIndex = this.getNextSlideI()
        } else if( this.endMouseX >= 20 ) {
            this.state.direction = 'up'
            //this.state.activeSlideIndex = this.getPrevSlideI()
        }

        if( this.endMouseX <= -20 || this.endMouseX >= 20) {
        
            this.state.easing = 'out'
            //this.changeSlide(this.state.activeSlideIndex, 'out')
            return
        }
        
        //this.ColorBG.previewColorReset()
    
    }



    changeSlide(index, ease) {

        // DOM
        this.state.activeSlide = this.slides[index]

        this.updateSculptureText(index)
        this.updateSculptureLink()
   
        //this.Fish.switchTextures(index, ease)
        this.ColorBG.changeColor(this.state.activeSlide.bg_color, ease)
        //this.ColorBG.changeShader(this.state.direction)
        //this.ColorBG.preview = false

        // State
        //this.state.changingSlides = true
        //setTimeout( () => { this.state.changingSlides = false }, 300 )
    
    }

    transformSlides() {

        // Lerp Movement
        let ease = this.state.instant ? 1 : this.state.ease
        this.state.lerpX += (this.state.targetX - this.state.lerpX) * ease
        
        // Track Velocity
        this.state.lerpX2 += (this.state.targetX - this.state.lerpX2) * ease

        let clampVal = (this.state.changingSlides) ? 0.8 : 1.5;
        let multVal  = (this.state.changingSlides) ? 0.006 :  0.0065;

        this.state.velocity = clamp((this.state.targetX - this.state.lerpX2 ) * multVal, `-${clampVal}`, clampVal)


        // Update GL
        this.slides.forEach((slide) => {
            // Move
            slide.Fish.updateX(this.state.lerpX)
            // Send uniforms
            slide.Fish.material.uniforms.uVelo.value = this.state.velocity
    
        })
        this.ColorBG.material.uniforms.uVelo.value = this.state.velocity
        
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
        
        nameTL.fromTo(el,{
            y: '0%'
        }, {
            y: this.state.direction == 'down' ? '-100%' : '100%',
            ease: this.state.easing == 'inOut' ? "power2.in" : "power1.out",
            duration: this.state.easing == 'inOut' ? 0.6 : 0.3,
            onComplete: () => {
                
                nameTL.call(callback)
                nameTL.fromTo(el,{
                    y: this.state.direction == 'down' ? '100%' : '-100%'
                }, {
                    y: '0%',
                    ease: this.state.easing == 'inOut' ? "power2.out" : "power1.out",
                    duration: this.state.easing == 'inOut' ? 0.6 : 0.5,
                })
            }
        })
        
      
        nameTL.play()
     }


     singleSculptureEnter() {

        this.state.changingSlides = true
        APP.state.view = 'single'
        gsap.to([this.els.sculptureTotal, this.els.sculptureViewDetail], {
            opacity: 0,
            stagger: 0.2,
            y: '20px',
            duration: 0.6,
            ease: "power2.Out"
        })

        // Transform Color BG
        this.GLTL.scene.reverse()
        this.ColorBG.constantWaveEnd()
        this.ColorBG.singleView()
        
     }

     singleSculptureExit() {
        this.state.changingSlides = false
        APP.state.view = 'slider'
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

            return {
                el: el,
                index: i,
                name: title,
                type: type,
                font_color: font_color,
                bg_color: bg_color,
                Fish: fish
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
        const targetX = (slide.Fish.bounds.left - (APP.winW*.325)) * -1

        //drag
        if(!this.state.changingSlides) {
            this.state.targetX = targetX
             state.offX = state.targetX
             // smoothe harsh velocity diff on drag
            this.state.lerpX2 = targetX - this.state.velocity * 200
            this.state.easing = 'out'
        } else {
            state.ease = 0.16
            this.state.easing = 'inOut'
            gsap.to(state,{
                targetX,
                ease: 'power2.in',
                duration: 0.6,
                onComplete: () => {
                    state.offX = state.targetX
                }
            })
        }


        // pause GL after animation complete
        this.glAnimation = setTimeout(() => {
            APP.Scene.shouldRun = false
        }, !this.state.changingSlides ? 1000 : 1800)


        this.state.activeSlideIndex = slide.index
        

        if( this.state.activeSlideIndex !== this.state.prevSlideIndex ) {
            this.changeSlide(slide.index,this.state.easing)
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