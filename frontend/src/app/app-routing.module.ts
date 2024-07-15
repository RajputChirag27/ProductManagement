import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PagesModule } from './pages/pages.module'
import { NotFoundComponent } from './pages/not-found/not-found.component'
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component'

const routes: Routes = [
  { path: '', redirectTo: 'authentication', pathMatch: 'full' },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        m => m.AuthenticationModule
      )
  },
  // { path: 'layouts', loadChildren: () => import('./layouts/layouts.module').then(m => m.LayoutsModule) },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', component: NotFoundComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}