import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ProductService } from 'src/app/core/services/product.service'
import { CategoryService } from 'src/app/core/services/category.service'
import { ToastrService } from 'ngx-toastr'
import { Location } from '@angular/common'

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  productForm!: FormGroup
  categories: any[] = []
  isEditMode = false
  submitted = false
  productId: string | null = null
  selectedFile: File | null = null
  imagePreview: string | ArrayBuffer | null = null
  private zoomLevel = 1

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private location : Location
  ) {}

  zoomIn() {
    this.zoomLevel *= 1.1
    this.applyZoom()
  }

  zoomOut() {
    this.zoomLevel /= 1.1
    this.applyZoom()
  }

  private applyZoom() {
    const img = document.querySelector('#imageModal img') as HTMLImageElement
    if (img) {
      img.style.transform = `scale(${this.zoomLevel})`
    }
  }

  downloadImage() {
    const link = document.createElement('a')
    link.href = this.imagePreview as string
    link.download = 'image.jpg' // You might want to use a more specific filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  openImageModal(): void {
    const modal = document.getElementById('imageModal')
    if (modal) {
      modal.classList.add('show')
      modal.style.display = 'block'
      document.body.classList.add('modal-open')
    }
  }

  closeImageModal(): void {
    const modal = document.getElementById('imageModal')
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none'
      document.body.classList.remove('modal-open')
    }
  }

  onModalHidden(): void {
    this.imagePreview = null // Clear image preview when modal is hidden
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')
    this.isEditMode = !!this.productId

    this.initializeForm()
    this.loadCategories()

    if (this.isEditMode && this.productId) {
      this.loadProductDetails(this.productId)
    }
  }

  get f() {
    return this.productForm.controls
  }

  initializeForm(): void {
    this.productForm = this.formBuilder.group({
      image: [null],
      title: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [
        0,
        [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]
      ],
      categoryID: ['', Validators.required]
    })
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      data => {
        this.categories = data.result
      },
      error => {
        console.error('Error loading categories:', error)
        // Handle error here, e.g., show a notification to the user
      }
    )
  }

  loadProductDetails(id: string): void {
    this.productService.getProductById(id).subscribe(
      data => {
        console.log(data.result)
        this.productForm.patchValue(data.result)
        if (data.image) {
          this.imagePreview = data.result.image
        }
      },
      error => {
        console.error('Error loading product details:', error)
        // Handle error here, e.g., show a notification to the user
      }
    )
  }

  onFileChange(event: any): void {
    const file = event.target.files[0]
    if (file) {
      this.selectedFile = file
      this.productForm.patchValue({ image: file })

      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  onSubmit(): void {
    this.submitted = true

    if (this.productForm.invalid) {
      return
    }

    const formData = this.createFormData()

    if (this.isEditMode && this.productId) {
      this.updateProduct(formData)
    } else {
      this.addProduct(formData)
    }
  }

  createFormData(): FormData {
    const formData = new FormData()
    if (this.selectedFile) {
      formData.append('image', this.selectedFile)
    }
    formData.append('title', this.productForm.get('title')!.value)
    formData.append('description', this.productForm.get('description')!.value)
    formData.append('price', this.productForm.get('price')!.value)
    formData.append('quantity', this.productForm.get('quantity')!.value)
    formData.append('categoryID', this.productForm.get('categoryID')!.value)

    return formData
  }

  updateProduct(formData: FormData): void {
    if (this.productId) {
      this.productService.updateProduct(this.productId, formData).subscribe(
        response => {
          this.toastr.info(response.message, 'Success!!')
          console.log('Product updated successfully:', response)
          this.router.navigate(['/pages/content/dashboard'])
        },
        error => {
          console.error('Error updating product:', error)
          // Handle error here, e.g., show a notification to the user
        }
      )
    }
  }

  addProduct(formData: FormData): void {
    this.productService.addProduct(formData).subscribe(
      response => {
        this.toastr.info(response.message, 'Success!!')
        // console.log('Product added successfully:', response);
        this.router.navigate(['/pages/content/dashboard'])
      },
      error => {
        console.error('Error adding product:', error)
        // Handle error here, e.g., show a notification to the user
      }
    )
  }

  back() {
    this.location.back(); 
  }
}
