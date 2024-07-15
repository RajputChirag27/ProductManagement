import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'
import { ToastrService } from 'ngx-toastr'
import { AuthService } from 'src/app/core/services/auth.service'
import { EventserviceService } from 'src/app/core/services/eventservice.service'
import { ProductService } from 'src/app/core/services/product.service'

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent {
  constructor(
    private _productService: ProductService,
    private _authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  rowData: any[] = []
  private gridApi!: GridApi
  isAdminUser: boolean = false // Assume this is determined based on user role

  defaultColDef = {
    sortable: true,
    filter: true
  }

  columnDefs: ColDef[] = [
    { field: '_id', headerName: 'ProductId', flex: 2 },
    { field: 'title', headerName: 'Name', flex: 2 },
    { field: 'categoryID.name', headerName: 'Category', flex: 2 },
    { field: 'price', headerName: 'Price', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 1 },
    {
      headerName: 'Actions',
      cellRenderer: this.actionsRenderer.bind(this),
      autoHeight: true,
      flex: 3
    }
  ]

  ngOnInit(): void {
    this.loadEvents()
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api
    this.loadEvents()
  }

  loadEvents(): void {
    this._productService.getProducts().subscribe({
      next: (response: any) => {
        console.log(response)
        if (response.success && Array.isArray(response.result)) {
          this.rowData = response.result
        } else {
          console.error('Unexpected response format:', response)
          this.toastr.error('Failed to load events', 'Error', { timeOut: 3000 })
          this.rowData = []
        }
      },
      error: (error: any) => {
        console.error('Error fetching events:', error)
        this.toastr.error('Failed to load events', 'Error', { timeOut: 3000 })
        this.rowData = []
      }
    })
  }

  onFilterTextBoxChanged() {
    this.gridApi.setGridOption(
      'quickFilterText',
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    )
  }

  actionsRenderer(params: any): HTMLElement {
    const container = document.createElement('div')
    container.classList.add(
      'actions-container',
      'd-flex',
      'justify-content-center',
      'align-items-center',
      'mt-2'
    )
    const viewButton = document.createElement('button')
    viewButton.innerHTML = '<i class="fa fa-eye"></i> View'
    viewButton.classList.add('btn', 'btn-primary', 'mx-1')
    viewButton.addEventListener('click', () => this.viewPage(params.data))
    container.appendChild(viewButton)

    if (!this._authService.isAdmin()) {
      // Register Button (Visible to users)
      const registerButton = document.createElement('button')
      registerButton.innerHTML = '<i class="fa fa-check-circle"></i> Register'
      registerButton.classList.add('btn', 'btn-success', 'mx-1')
      registerButton.addEventListener('click', () =>
        this.registerEvent(params.data)
      )
      container.appendChild(registerButton)

      // Unregister Button (Visible to users)
      const unregisterButton = document.createElement('button')
      unregisterButton.innerHTML =
        '<i class="fa fa-times-circle"></i> Unregister'
      unregisterButton.classList.add('btn', 'btn-danger', 'mx-1')
      unregisterButton.addEventListener('click', () =>
        this.unregisterEvent(params.data)
      )
      container.appendChild(unregisterButton)
    }
    // Admin Actions (Visible to admin users only)
    if (this._authService.isAdmin()) {
      const updateButton = document.createElement('button')
      updateButton.innerHTML = '<i class="fa fa-edit"></i> Update'
      updateButton.classList.add('btn', 'btn-warning', 'mx-1')
      updateButton.addEventListener('click', () => this.updateItem(params.data))
      container.appendChild(updateButton)

      const deleteButton = document.createElement('button')
      deleteButton.innerHTML = '<i class="fa fa-trash"></i> Delete'
      deleteButton.classList.add('btn', 'btn-danger', 'mx-1')
      deleteButton.addEventListener('click', () => this.deleteItem(params.data))
      container.appendChild(deleteButton)
    }

    return container
  }

  formatDate(date: string): string {
    const eventDate = new Date(date)
    return eventDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  registerEvent(event: any): void {
    console.log('Register for event:', event)
    // Implement registration logic
    this.toastr.info(`Register for event logic`, `Success!`, {
      timeOut: 3000,
      closeButton: true,
      progressBar: true
    })
  }

  unregisterEvent(event: any): void {
    console.log('Unregister from event:', event)
    // Implement unregistration logic
    this.toastr.info(`Unregister from event logic`, `Success!`, {
      timeOut: 3000,
      closeButton: true,
      progressBar: true
    })
  }

  updateItem(item: any): void {
    console.log('Update item:', item._id)
    this.router.navigateByUrl(`/pages/product/${item._id}`)
  }

  deleteItem(item: any): void {
    console.log('Delete item:', item._id)
    this._productService.deleteProduct(item._id).subscribe(
      (res: any) => {
        this.toastr.info(`${res.message}`, 'Success !!', {
          timeOut: 3000,
          closeButton: true,
          progressBar: true
        })
        this.loadEvents()
        console.log('Event deleted successfully', res)
      },
      (error: any) => {
        console.error('Error deleting event', error)
        this.toastr.error('Failed to delete event', 'Error', { timeOut: 3000 })
      }
    )
  }

  viewPage(item: any) {
    console.log('View page for:', item)
    this.router.navigateByUrl(`pages/product/viewProducts/${item._id}`)
  }
}
