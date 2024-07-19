import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ProductComponent } from './product.component'
import { EditProductComponent } from './edit-product/edit-product.component'
import { ProductTableComponent } from './product-table/product-table.component'
import { ViewProductComponent } from './view-product/view-product.component'
import { AdminGuard } from 'src/app/core/guards/admin.guard'
import { ViewAllProductsComponent } from './view-all-products/view-all-products.component'
import { animation } from '@angular/animations'

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
      {path: 'viewProducts', component:ViewAllProductsComponent, data: {animation: 'ViewAllProduct'}},
      { path: '', component: EditProductComponent, data :{ animation: 'EditProduct' }, canActivate: [AdminGuard] },
      { path: 'productTable', component: ProductTableComponent, data :{ animation: 'ProductTable' }, canActivate: [AdminGuard] },
      { path: 'viewProducts/:id', component: ViewProductComponent, data :{ animation: 'ViewProduct' }, canActivate: [AdminGuard] },
      { path: ':id', component: EditProductComponent, data :{ animation: 'EditProduct' }, canActivate: [AdminGuard] }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}
