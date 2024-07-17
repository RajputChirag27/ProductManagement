import { Component } from '@angular/core'
import { ContentService } from 'src/app/core/services/content.service'
import { ToastrService } from 'ngx-toastr'
import { ChildrenOutletContexts, Router } from '@angular/router'
import { fadeAnimation } from 'src/app/core/animations/animation';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  animations: [fadeAnimation]
})
export class ContentComponent {

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
