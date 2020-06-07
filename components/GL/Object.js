import { Object3D } from 'three'


export default class O extends Object3D {

    init(el) {

        this.el = el
        this.GLscene = APP.Scene
        this.setBounds()
    }

    setBounds() {
        this.rect = this.el.getBoundingClientRect();  
        
        this.bounds = {
          left: this.rect.left,
          top: this.rect.top,
          width: this.rect.width,
          height: this.rect.height
        }
        this.pos = {
          x: (this.bounds.left + (this.bounds.width / 2)) - (APP.winW / 2)
        }

        this.position.x = this.pos.x

      }

      updateX(current) {
         current && (this.position.x = current + this.pos.x)
      }
      
      
      /*calculateUnitSize(distance = this.position.z) {
        const vFov = this.GLscene.camera.fov * Math.PI / 180;
        const height = 2 * Math.tan(vFov / 2) * distance;
        const width = height * this.GLscene.camera.aspect;
    
        return { width, height };
      }*/
    
      /*
      updateSize() {
  
        this.scale.x = this.bounds.width 
        this.scale.y = this.bounds.height
        
        this.camUnit = this.calculateUnitSize(this.GLscene.camera.position.z - this.position.z);
        
        const x = this.bounds.width / APP.winW;
        const y = this.bounds.height / APP.winH;
    
        if (!x || !y) return;
    
        this.scale.x = this.camUnit.width * x;
        this.scale.y = this.camUnit.height * y; 
      } */
      
      /*
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
      
      updatePosition(x) {
        //this.updateY(y);
        this.updateX(x);
      } */

}