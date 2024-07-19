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
    const animationData = context?.route?.snapshot?.data?.['animation'];
    return animationData;
  }
}
