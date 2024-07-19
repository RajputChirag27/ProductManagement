import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ProductRoutingModule } from './product-routing.module'
import { ProductComponent } from './product.component'
import { EditProductComponent } from './edit-product/edit-product.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ToastrModule } from 'ngx-toastr'
import { ProductTableComponent } from './product-table/product-table.component'
import { AgGridModule } from 'ag-grid-angular'
import { ViewProductComponent } from './view-product/view-product.component'
import { HttpClientModule } from '@angular/common/http';
import { ViewAllProductsComponent } from './view-all-products/view-all-products.component'

@NgModule({
  declarations: [
    ProductComponent,
    EditProductComponent,
    ProductTableComponent,
    ViewProductComponent,
    ViewAllProductsComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    ToastrModule,
    AgGridModule
  ]
})
export class ProductModule {}
