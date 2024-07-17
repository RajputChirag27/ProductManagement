import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UserComponent } from './user.component'
import { HomepageComponent } from './homepage/homepage.component'
import { ProfileComponent } from './profile/profile.component'
import { AboutComponent } from './about/about.component'
import { UserTableComponent } from './user-table/user-table.component'
import { AdminGuard } from 'src/app/core/guards/admin.guard'
import { ViewUserComponent } from './view-user/view-user.component'

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', component: HomepageComponent, pathMatch: 'full', data :{ animation: 'HomePage' }  },
      { path: 'home', component: HomepageComponent,  data: { animation: 'HomePage' } },
      { path: 'profile', component: ProfileComponent,data: { animation: 'ProfilePage' } },
      { path: 'about', component: AboutComponent,  data: { animation: 'AboutPage' } },
      {
        path: 'userTable',
        component: UserTableComponent,
        data :{ animation: 'UserTable' } ,
        canActivate: [AdminGuard]
      },
      {
        path: 'viewUser/:id',
        component: ViewUserComponent,
        data :{ animation: 'ViewUser' } ,
        canActivate: [AdminGuard]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
