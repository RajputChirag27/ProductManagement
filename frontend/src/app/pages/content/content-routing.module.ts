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
      { path: 'createArticle', component: ContenteditComponent , data :{ animation: 'CreateArticle' } },
      { path: 'createArticle/:id', component: ContenteditComponent, data :{ animation: 'CreateArticle' } },
      { path: 'dashboard', component: DashboardComponent, data :{ animation: 'Dashboard' } },
      { path: 'categoryTable', component: CategoryTableComponent, data :{ animation: 'CategoryTable' } },
      { path: 'category', component: CategoryComponent, data :{ animation: 'Category' } },
      { path: 'category/:id', component: CategoryComponent,data :{ animation: 'Category' } },
      { path: 'viewPage/:id', component: ViewPageComponent, data :{ animation: 'ViewPage' } }
    ],
    canActivate: [AdminGuard]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule {}
