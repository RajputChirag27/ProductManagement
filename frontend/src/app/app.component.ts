import { Component } from '@angular/core'
import { ChildrenOutletContexts } from '@angular/router';
import { trigger, transition, style, query, group, animate, animateChild } from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ]),
        query(':enter', [
          style({ left: '-100%' })
        ], { optional: true }),
        query(':leave', animateChild(), { optional: true }),
        group([
          query(':leave', [
            animate('600ms ease-out', style({ left: '100%' }))
          ], { optional: true }),
          query(':enter', [
            animate('600ms ease-out', style({ left: '0%' }))
          ], { optional: true })
        ]),
      ]),
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ left: '-100%' })
        ], { optional: true }),
        query(':leave', animateChild(), { optional: true }),
        group([
          query(':leave', [
            animate('600ms ease-out', style({ left: '100%', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('600ms ease-out', style({ left: '0%' }))
          ], { optional: true }),
          query('@*', animateChild(), { optional: true })
        ]),
      ])
    ])
  ]
  
})
export class AppComponent {
  title = 'BookManagementSystemFrontend'

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
