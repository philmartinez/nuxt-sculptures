
<template>
<main> 
<div class="container" data-scroll>
<div class="imgs">
    <img src="food.jpg" />
    <h3>Check this out</h3>
    <p>We got some text here. We got some text here. We got some text here.
        We got some text here.We got some text here. 
        We got some text here.
        We got some text here.</p>
    <img src="book.jpg" />
<h3>Check this out</h3>
    <p>We got some text here. We got some text here. We got some text here.
        We got some text here.We got some text here. 
        We got some text here.
        We got some text here.</p>
    <img src="food.jpg" />
    <h3>Check this out</h3>
    <p>We got some text here. We got some text here. We got some text here.
        We got some text here.We got some text here. 
        We got some text here.
        We got some text here.</p>
</div>
</div>
<canvas id="app"></canvas>
</main>
</template>




<script>

const vertex =`
uniform float time;
uniform float progress;
uniform vec4 resolution;
varying vec2 vUv;
uniform sampler2D texture1;

const float pi = 3.1415925;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
}`;



const fragment =`
uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;


void main()	{
	vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	// newUV.x += 0.02*sin(newUV.y*20. + time);
	gl_FragColor = texture2D(texture1,newUV);
}`;

import * as THREE from 'three'

const MathUtils = {
  // map number x from range [a, b] to [c, d]
  map: (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c,
  // linear interpolation
  lerp: (a, b, n) => (1 - n) * a + n * b
};

let app;

const STATE = {
    docScroll: 0,
    winH: 0,
    windW: 0,
    items: []
}

class THREE_App {

    constructor() {
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        100,
        1000
        );
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("#app"),
            antialias: true,
            alpha: true
        });

        this.images = document.querySelectorAll('img');
        this.items = []

        this.setup()
        this.trackScroll()
       
    }

    setup() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor( 0xffffff ); 
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.cameraDistance = 400;
        this.camera.position.set(0, 0, this.cameraDistance);
        this.camera.lookAt(0, 0, 0);
        this.targetSpeed = 0;
        
        this.addObjects()

        window.addEventListener('resize', this.resize.bind(this))
        //window.addEventListener('load',this.load.bind(this)) // I know
        window.addEventListener('scroll', this.trackScroll.bind(this)) // both ways

        this.resize();
    }
    trackScroll() {
        
        STATE.docScroll = window.pageYOffset || document.documentElement.scrollTop
        
    }

    addObjects() {
        let that = this;
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 80, 80);
        this.material = new THREE.ShaderMaterial({
        extensions: {
            derivatives: "#extension GL_OES_standard_derivatives : enable"
        },
        side: THREE.DoubleSide,
        uniforms: {
            time: { type: "f", value: 0 },
            progress: { type: "f", value: 0 },
            angle: { type: "f", value: 0 },
            texture1: { type: "t", value: null },
            texture2: { type: "t", value: null },
            resolution: { type: "v4", value: new THREE.Vector4() },
            uvRate1: {
            value: new THREE.Vector2(1, 1)
            }
        },
        transparent: true,
        vertexShader: vertex,
        fragmentShader: fragment
        });
    }

    createMesh({img, width, height, iHeight, iWidth}) {
      
        let texture = new THREE.TextureLoader().load(img.src); 

        let material = this.material.clone();

        // image cover
        let imageAspect = iHeight / iWidth;
        let a1;
        let a2;

        if (height / width > imageAspect) {
            a1 = (width / height) * imageAspect;
            a2 = 1;
        } else {
            a1 = 1;
            a2 = height / width / imageAspect;
        }

        texture.minFilter = THREE.LinearFilter;
        material.uniforms.resolution.value.x = width;
        material.uniforms.resolution.value.y = height;
        material.uniforms.resolution.value.z = a1;
        material.uniforms.resolution.value.w = a2;
        material.uniforms.progress.value = 0;
        material.uniforms.angle.value = 0.3;


        material.uniforms.texture1.value = texture;
        material.uniforms.texture1.value.needsUpdate = true;


        let mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(1, 1, 80, 80), 
            material
        )

        mesh.scale.set(width, height, width / 2);
        
        return mesh
    }

    resize() {
        STATE.winH = window.innerHeight
        STATE.winW = window.innerWidth

        this.renderer.setSize(STATE.winW, STATE.winH);
        this.camera.aspect = STATE.winW / STATE.winH;

        this.camera.fov =
         2 *
         Math.atan(STATE.winW / this.camera.aspect / (2 * this.cameraDistance)) *
         (180 / Math.PI); // in degrees

         //this.customPass.uniforms.resolution.value.y = STATE.winH / STATE.winW;

        this.camera.updateProjectionMatrix();

    }
    render() {

        this.time+=0.05;
        this.targetSpeed *=0.999;
        this.renderer.render(this.scene,this.camera);

        
    }
    

}





class MeshItem {

    constructor(img) {
        this.img = img
        this.DOM = { el: img };

        this.isBeingAnimatedNow = false;
        this.shouldRollBack = false;
        this.shouldUnRoll = false;
        this.positions = [];

        this.getSize()

        this.mesh = app.createMesh({
            width: this.width,
            height: this.height,
            iWidth: this.DOM.el.width,
            iHeight: this.DOM.el.height,
            img: this.img
        })
        
        app.scene.add(this.mesh);

        this.intersectionRatio;
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: [0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    };
    this.observer = new IntersectionObserver(entries => {
    
      entries.forEach(entry => {
         
        this.positions.push(entry.boundingClientRect.y);

        let compareArray = this.positions.slice(
          this.positions.length - 2,
          this.positions.length
        );
        let down = compareArray[0] > compareArray[1] ? true : false;

        this.isVisible = entry.intersectionRatio > 0.0;

        this.shouldRollBack = false;
        this.shouldUnRoll = false;

        if (
          entry.intersectionRatio < 0.5 &&
          entry.boundingClientRect.y > 0 &&
          this.isVisible &&
          !down
        ) {
          this.shouldRollBack = true;
        }

        if (
          entry.intersectionRatio > 0.5 &&
          entry.boundingClientRect.y > 0 &&
          this.isVisible
        ) {
          this.shouldUnRoll = true;
        }
        //console.log(this.isVisible,'vis');
        this.mesh.visible = this.isVisible;
      });
    }, options);

    this.observer.observe(this.DOM.el);

    // init/bind events
    window.addEventListener("resize", () => this.resize());
    this.render(0);

    }

    getSize() {
    // get all the sizes here, bounds and all
    const bounds = this.DOM.el.getBoundingClientRect();
    const fromTop = bounds.top;
    const windowHeight = window.innerHeight;
    const withoutHeight = fromTop - windowHeight;
    const withHeight = fromTop + bounds.height;

    this.insideTop = withoutHeight - STATE.docScroll;
    this.insideRealTop = fromTop + STATE.docScroll;
    this.insideBottom = withHeight - STATE.docScroll + 50;
    this.width = bounds.width;
    this.height = bounds.height;
    this.left = bounds.left;
  }

  resize() {
    // on resize rest sizes and update the translation value
    this.getSize();
    this.mesh.scale.set(this.width, this.height, 200);
    this.render(this.scroll.renderedStyles.translationY.current);
    this.scroll.shouldRender = true;
  }

    render(currentScroll) {
       
        this.currentScroll = currentScroll;
        this.mesh.position.y =
        currentScroll + STATE.winH / 2 - this.insideRealTop - this.height / 2;
        this.mesh.position.x = 0 - STATE.winW / 2 + this.left + this.width / 2;
 
    }
  

}





// SmoothScroll
class SmoothScroll {
  constructor() {
    this.shouldRender = false;
    // the <main> element
    this.DOM = { main: document.querySelector("main") };
    // the scrollable element
    // we translate this element when scrolling (y-axis)
    this.DOM.scrollable = this.DOM.main.querySelector("div[data-scroll]");
    // the items on the page
    this.items = [];
    this.images = document.querySelectorAll('img');

    this.createItems();
    this.listenMouse()

    // here we define which property will change as we scroll the page
    // in this case we will be translating on the y-axis
    // we interpolate between the previous and current value to achieve the smooth scrolling effect
    this.renderedStyles = {
      translationY: {
        // interpolated value
        previous: 0,
        // current value
        current: 0,
        // amount to interpolate
        ease: 0.1,
        // current value setter
        // in this case the value of the translation will be the same like the document scroll
        setValue: () => STATE.docScroll
      }
    };
    // set the body's height
    this.setSize();
    // set the initial values
    this.update();
    // the <main> element's style needs to be modified
    this.style();
    // init/bind events
    this.initEvents();
    // start the render loop
    requestAnimationFrame(() => this.render());
  }

  listenMouse(){
    document.addEventListener('mousemove',()=>{
      this.shouldRender = true;
    })
  }


  update() {
    // sets the initial value (no interpolation) - translate the scroll value
    for (const key in this.renderedStyles) {
      this.renderedStyles[key].current = this.renderedStyles[
        key
      ].previous = this.renderedStyles[key].setValue();
    }
    // translate the scrollable element
    this.setPosition();
    this.shouldRender = true;
  }
  
  setPosition() {
    // translates the scrollable element
 
    if (
      Math.round(this.renderedStyles.translationY.previous) !==
        Math.round(this.renderedStyles.translationY.current) ||
      this.renderedStyles.translationY.previous < 10
    ) {
      this.shouldRender = true;
      this.DOM.scrollable.style.transform = `translate3d(0,${-1 *
        this.renderedStyles.translationY.previous}px,0)`;
      // console.log(this.items);
      for (const item of this.items) {
        // if the item is inside the viewport call it's render function
        // this will update the item's inner image translation, based on the document scroll value and the item's position on the viewport
        if (item.isVisible || item.isBeingAnimatedNow) {
          item.render(this.renderedStyles.translationY.previous);
        }
      }
    }
    ;
    if(app.scene.targetSpeed>0.01) this.shouldRender = true;

    if (this.shouldRender) {
      this.shouldRender = false;
      app.render();
    }

  }
  setSize() {
    // set the heigh of the body in order to keep the scrollbar on the page
    // console.log(this.DOM.scrollable.scrollHeight, 'HEIGHT');
    document.body.style.height = `${this.DOM.scrollable.scrollHeight}px`;
  }

  createItems() {
    this.images.forEach(image => {
      //if (image.img.classList.contains("js-image")) {
        this.items.push(new MeshItem(image));
      //}
    });
  }

  style() {
    // the <main> needs to "stick" to the screen and not scroll
    // for that we set it to position fixed and overflow hidden
    this.DOM.main.style.position = "fixed";
    this.DOM.main.style.width = this.DOM.main.style.height = "100%";
    this.DOM.main.style.top = this.DOM.main.style.left = 0;
    this.DOM.main.style.overflow = "hidden";
  }
  initEvents() {
    // on resize reset the body's height
    window.addEventListener("resize", () => this.setSize());
  }
  render() {
      
    // update the current and interpolated values
    for (const key in this.renderedStyles) {
      this.renderedStyles[key].current = this.renderedStyles[key].setValue();
      this.renderedStyles[key].previous = MathUtils.lerp(
        this.renderedStyles[key].previous,
        this.renderedStyles[key].current,
        this.renderedStyles[key].ease
      );
    }
    // and translate the scrollable element
    this.setPosition();

    // loop..
    requestAnimationFrame(() => this.render());
  }
}




export default {

    mounted() {

        app = new THREE_App();
        window.addEventListener('load',() => {
            new SmoothScroll();
        })
        
    }

}

</script>

<style>

.container {
    max-width: 80vw;
    margin: 100px auto;
}
.imgs img
 {
     margin: 10% 0;
     width: 100%;
     opacity: 0;
 }

 #app {
     display: block;
     z-index: -1;
     position: fixed;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
 }
</style>