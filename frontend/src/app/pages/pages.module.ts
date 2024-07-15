import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { PagesRoutingModule } from './pages-routing.module'
import { PagesComponent } from './pages.component'
import { LayoutsModule } from '../layouts/layouts.module'
import { HomepageComponent } from './user/homepage/homepage.component'
import { DashboardComponent } from './content/dashboard/dashboard.component'
import { ProfileComponent } from './user/profile/profile.component'
import { NotFoundComponent } from './not-found/not-found.component'
import { AboutComponent } from './user/about/about.component'
import { HttpClientModule } from '@angular/common/http'
import { UnauthorizedComponent } from './unauthorized/unauthorized.component'

@NgModule({
  declarations: [
    PagesComponent,
    HomepageComponent,
    ProfileComponent,
    NotFoundComponent,
    AboutComponent,
    UnauthorizedComponent
  ],
  imports: [CommonModule, PagesRoutingModule, LayoutsModule, HttpClientModule],
  exports: [NotFoundComponent, UnauthorizedComponent]
})
export class PagesModule {}
