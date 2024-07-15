import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { QuillModule } from 'ngx-quill'
import { ContentRoutingModule } from './content-routing.module'
import { ContentComponent } from './content.component'
import { ContenteditComponent } from './contentedit/contentedit.component'
import { ReactiveFormsModule } from '@angular/forms'
import { AgGridModule } from 'ag-grid-angular'
import { DashboardComponent } from './dashboard/dashboard.component'
import { ViewPageComponent } from './view-page/view-page.component'
import { CategoryComponent } from './category/event.component'
import { CategoryTableComponent } from './category-table/category-table.component'
import { AgChartsModule } from 'ag-charts-angular'

@NgModule({
  declarations: [
    ContentComponent,
    ContenteditComponent,
    DashboardComponent,
    ViewPageComponent,
    CategoryComponent,
    CategoryTableComponent
  ],
  imports: [
    CommonModule,
    ContentRoutingModule,
    ReactiveFormsModule,
    QuillModule,
    AgGridModule,
    AgChartsModule
  ]
})
export class ContentModule {}
