import { Component } from '@angular/core'
import { ChildrenOutletContexts } from '@angular/router';
import { fadeAnimation } from '../core/animations/animation';
import { trigger, transition, style, query, group, animate, animateChild } from '@angular/animations';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  animations: [fadeAnimation]

})
export class PagesComponent {
  constructor(private contexts : ChildrenOutletContexts){

  }
    
  getRouteAnimationData() {
    const context = this.contexts.getContext('primary');
    const animationData = context?.route?.snapshot?.data?.['animation'];
    return animationData
  }
}
