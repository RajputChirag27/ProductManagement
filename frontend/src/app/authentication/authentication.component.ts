import { Component } from '@angular/core'
import { fadeAnimation } from '../core/animations/animation';
import { ChildrenOutletContexts } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  animations: [fadeAnimation]
})
export class AuthenticationComponent {

  constructor(private contexts : ChildrenOutletContexts){

  }
  getRouteAnimationDataAuth() {
    const context = this.contexts.getContext('primary');
    console.log(context)
    const animationData = context?.route?.snapshot?.data?.['animation'];
    console.log('Route animation data:', animationData); // Debugging line
    return animationData;
  }
}
