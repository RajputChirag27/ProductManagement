import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { UserRoutingModule } from './user-routing.module'
import { UserComponent } from './user.component'
import { UserTableComponent } from './user-table/user-table.component'
import { AgGridModule } from 'ag-grid-angular'
import { ViewUserComponent } from './view-user/view-user.component'

@NgModule({
  declarations: [UserComponent, UserTableComponent, ViewUserComponent],
  imports: [CommonModule, UserRoutingModule, AgGridModule]
})
export class UserModule {}
