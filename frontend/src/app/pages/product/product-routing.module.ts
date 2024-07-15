import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ProductComponent } from './product.component'
import { EditProductComponent } from './edit-product/edit-product.component'
import { ProductTableComponent } from './product-table/product-table.component'
import { ViewProductComponent } from './view-product/view-product.component'

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
      { path: '', component: EditProductComponent },
      { path: 'productTable', component: ProductTableComponent },
      { path: 'viewProducts/:id', component: ViewProductComponent },
      { path: ':id', component: EditProductComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}
