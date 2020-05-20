import { Object3D } from 'three'
import gsap from 'gsap'

export default class O extends Object3D {

    init(el) {

        this.el = el
        this.GLscene = APP.Scene
        this.resize()
    }

    setBounds() {
        this.rect = this.el.getBoundingClientRect();
        
        this.bounds = {
          left: this.rect.left,
          top: this.rect.top,
          width: this.rect.width,
          height: this.rect.height
        };

        this.updateSize();
        //this.updatePosition();
      }
      
      resize() {
        this.setBounds();
      }
      
      calculateUnitSize(distance = this.position.z) {
        const vFov = this.GLscene.camera.fov * Math.PI / 180;
        const height = 2 * Math.tan(vFov / 2) * distance;
        const width = height * this.GLscene.camera.aspect;
    
        return { width, height };
      }
    
      updateSize() {
        this.camUnit = this.calculateUnitSize(this.GLscene.camera.position.z - this.position.z);
        
        const x = this.bounds.width / APP.winW;
        const y = this.bounds.height / APP.winH;
    
        if (!x || !y) return;
    
        this.scale.x = this.camUnit.width * x;
        this.scale.y = this.camUnit.height * y;
      }
      
      updateY(y = 0) {
        const { top, height } = this.bounds;
    
        this.position.y = (this.camUnit.height / 2) - (this.scale.y / 2);
        this.position.y -= ((top - y) / APP.winH) * this.camUnit.height;
    
        this.progress = gsap.utils.clamp(0, 1, 1 - (-y + top + height) / (window.innerHeight + height));
      }  
    
      updateX(x = 0) {
        const { left } = this.bounds;
    
        this.position.x = -(this.camUnit.width / 2) + (this.scale.x / 2);
        this.position.x += ((left + x) / APP.winW) * this.camUnit.width;
      }  
      
      /*updatePosition(y) {
        this.updateY(y);
        this.updateX(0);
      }*/

}