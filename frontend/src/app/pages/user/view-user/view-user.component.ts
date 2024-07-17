import { Component, NgZone } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { UserService } from 'src/app/core/services/user.service'
import { Location } from '@angular/common'

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent {
  user: any
  modalImage: string | null = null
  productId!: string | null
  imagePreview!: string
  private zoomLevel = 1

  constructor(
    private _userService: UserService,
    private toastr: ToastrService,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private location: Location
  ) {}
  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id')
    this._userService.getUser(this.productId as string).subscribe(
      (res: any) => {
        console.log(res.result)
        this.user = res.result
        this.imagePreview = `http://localhost:8000/uploads/${res.result.profilePicture}`
      },
      (error: any) => {
        console.error('Error fetching products:', error)
        // this.toastr.error('Failed to fetch products', 'Error')
      }
    )
  }

  openImageModal(image: string): void {
    this.modalImage = image
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
    this.modalImage = null
  }

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
  downloadImage(): void {
    if (this.imagePreview) {
      this.ngZone.run(() => {
        const link = document.createElement('a')

        // Ensure imagePreview is defined and a string
        if (typeof this.imagePreview === 'string' && this.imagePreview) {
          // Fetch the image from the backend to ensure it's available for download
          fetch(this.imagePreview)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
              }
              return response.blob()
            })
            .then(blob => {
              const url = window.URL.createObjectURL(blob)
              link.href = url
              link.download = 'image.jpg' // You might want to use a more specific filename
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              window.URL.revokeObjectURL(url)
            })
            .catch(error => {
              console.error('Error fetching the image from the backend:', error)
            })
        } else {
          console.error('Image preview is not a valid URL.')
        }
      })
    } else {
      console.error('No image preview available.')
    }
  }

  back() {
    this.location.back()
  }
}
