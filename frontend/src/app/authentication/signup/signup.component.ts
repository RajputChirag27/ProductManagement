import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { HttpClient } from '@angular/common/http'
import { UserService } from 'src/app/core/services/user.service'
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat
} from 'ngx-intl-tel-input'
import { AuthService } from 'src/app/core/services/auth.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  userForm!: FormGroup
  roles: string[] = ['Admin', 'User']
  selectedFile: File | null = null
  uploadProgress: number | null = null
  editMode: boolean = false
  userId: string | null = null
  user: any
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedStates]
  separateDialCode = true
  imagePreview: string | ArrayBuffer | null = null
  zoomLevel: number = 1

  // Expose enums to the template
  SearchCountryField = SearchCountryField
  CountryISO = CountryISO
  PhoneNumberFormat = PhoneNumberFormat

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private _userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editMode = true
        this.userId = params['id']
        this.initForm()
        this.loadUserData()
      } else {
        this.initForm()
      }
    })

    this.userForm.statusChanges.subscribe(status => {
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key)
      })
    })
  }

  onFileChange(event: any): void {
    const file = event.target.files[0]
    if (file) {
      this.selectedFile = file
      this.userForm.patchValue({ profilePicture: file })

      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result
        console.log('Image Preview URL:', this.imagePreview) // Debugging step
      }
      reader.readAsDataURL(file)
    }
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

  initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      mobile: ['', [Validators.required]],
      password: [
        '',
        this.editMode ? [] : [Validators.required, Validators.minLength(6)]
      ],
      profilePicture: [null]
    })
  }

  loadUserData(): void {
    if (this.userId) {
      this._userService.getUser(this.userId).subscribe(
        (user: any) => {
          console.log(user)
          this.user = user.result
          this.userForm.patchValue({
            firstName: user.result.firstName,
            lastName: user.result.lastName,
            email: user.result.email,
            role: user.result.role,
            mobile: user.result.mobile,
            profilePicture: user.result.profilePicture
          })

          this.imagePreview = this.user.result.profilePicture // Use the URL directly

          if (this.editMode) {
            this.userForm.removeControl('password')
          }
        },
        (error: any) => {
          // this.toastr.error('Error loading user data', 'Error');
        }
      )
    }
  }

  onSubmit(): void {
    console.log(this.userForm)
    if (this.userForm.valid) {
      console.log(this.userForm)
      const formData = new FormData()
      const mobileControl = JSON.stringify(this.userForm.get('mobile')?.value)
      formData.append('firstName', this.userForm.get('firstName')?.value)
      formData.append('lastName', this.userForm.get('lastName')?.value)
      formData.append('email', this.userForm.get('email')?.value)
      formData.append('role', this.userForm.get('role')?.value)
      formData.append('mobile', mobileControl)

      if (!this.editMode && this.userForm.get('password')) {
        formData.append('password', this.userForm.get('password')?.value)
      }

      if (this.selectedFile) {
        formData.append(
          'profilePicture',
          this.selectedFile,
          this.selectedFile.name
        )
      } else if (this.editMode && this.user.profilePicture) {
        formData.append('profilePicture', this.user.profilePicture)
      }

      if (this.editMode) {
        this.updateUser(formData)
      } else {
        this.createUser(formData)
      }
    } else {
      this.toastr.error(
        'Please fill all required fields correctly',
        'Form Error'
      )
    }
  }

  createUser(formData: any): void {
    console.log(formData)
    this._userService.createUser(formData).subscribe(() => {
      this.toastr.info('User created successfully', 'Success')
      this.router.navigate(['/authentication/login'])
    })
  }

  updateUser(formData: any): void {
    console.log('FormData', formData)
    if (this.userId) {
      this._userService
        .updateUser(this.userId, this.userForm.value)
        .subscribe(() => {
          this.toastr.info('Profile updated successfully', 'Success')
          if (this._authService.isAdmin()) {
            this.router.navigate(['/pages/content/dashboard'])
          } else {
            this.router.navigate(['/pages/profile'])
          }
        })
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    if (file) {
      this.selectedFile = file
      this.userForm.patchValue({ profilePicture: file })
    }
  }

  get f() {
    return this.userForm.controls
  }
}
