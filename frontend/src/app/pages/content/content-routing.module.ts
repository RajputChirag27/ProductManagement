import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ContentComponent } from './content.component'
import { ContenteditComponent } from './contentedit/contentedit.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { ViewPageComponent } from './view-page/view-page.component'
import { CategoryComponent } from './category/event.component'
import { CategoryTableComponent } from './category-table/category-table.component'
import { AdminGuard } from 'src/app/core/guards/admin.guard'

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: [
      { path: 'createArticle', component: ContenteditComponent },
      { path: 'createArticle/:id', component: ContenteditComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categoryTable', component: CategoryTableComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'category/:id', component: CategoryComponent },
      { path: 'viewPage/:id', component: ViewPageComponent }
    ],
    canActivate: [AdminGuard]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule {}
