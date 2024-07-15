import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ProductRoutingModule } from './product-routing.module'
import { ProductComponent } from './product.component'
import { EditProductComponent } from './edit-product/edit-product.component'
import { ReactiveFormsModule } from '@angular/forms'
import { ToastrModule } from 'ngx-toastr'
import { ProductTableComponent } from './product-table/product-table.component'
import { AgGridModule } from 'ag-grid-angular'
import { ViewProductComponent } from './view-product/view-product.component'
import { HttpClientModule } from '@angular/common/http'

@NgModule({
  declarations: [
    ProductComponent,
    EditProductComponent,
    ProductTableComponent,
    ViewProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule,
    AgGridModule
  ]
})
export class ProductModule {}
