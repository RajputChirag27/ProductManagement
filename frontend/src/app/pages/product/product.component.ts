import { Component } from '@angular/core'
import { ChildrenOutletContexts } from '@angular/router';
import { fadeAnimation } from 'src/app/core/animations/animation';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  animations: [fadeAnimation]
})
export class ProductComponent {
  constructor(private contexts : ChildrenOutletContexts){

  }


  getRouteAnimationData() {
    const context = this.contexts.getContext('primary');
    console.log(context)
    const animationData = context?.route?.snapshot?.data?.['animation'];
    console.log('Route animation data:', animationData); // Debugging line
    return animationData
  }
}
