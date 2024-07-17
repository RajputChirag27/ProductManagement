import { Component } from '@angular/core'
import { ChildrenOutletContexts } from '@angular/router';
import { fadeAnimation } from 'src/app/core/animations/animation';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [fadeAnimation]
})
export class UserComponent {
  animationInProgress: boolean = false;
  constructor(private contexts : ChildrenOutletContexts){

  }


  onAnimationEvent(event: any) {
    // The event type is 'start' or 'done'
    if (event.type === 'done') {
      this.animationInProgress = false;
    }
  }
  getRouteAnimationData() {
    const context = this.contexts.getContext('primary');
    console.log(context)
    this.animationInProgress = true;
    const animationData = context?.route?.snapshot?.data?.['animation'];
    console.log('Route animation data:', animationData); // Debugging line
    return animationData
  }
}
