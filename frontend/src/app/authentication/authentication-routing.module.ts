import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthenticationComponent } from './authentication.component'
import { LoginComponent } from './login/login.component'
import { SignupComponent } from './signup/signup.component'
import { LoginGuard } from '../core/guards/login-guard.guard'


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full', data :{ animation: 'LoginPage' }  },

  { path: 'login', component: LoginComponent, canActivate: [LoginGuard],  data :{ animation: 'LoginPage' } },
  { path: 'signup', component: SignupComponent,  data :{ animation: 'SignUpPage' } },

  { path: 'signup/:id', component: SignupComponent , data :{ animation: 'SignUpPage' } }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {}
