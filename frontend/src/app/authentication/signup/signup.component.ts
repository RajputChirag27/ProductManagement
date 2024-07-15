import { Component } from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { Router } from '@angular/router'
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField
} from 'ngx-intl-tel-input'
import { ToastrService } from 'ngx-toastr'
import { IAuth } from 'src/app/core/interfaces/IAuth'
import { UserService } from 'src/app/core/services/user.service'
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm!: FormGroup
  separateDialCode = false
  SearchCountryField = SearchCountryField
  CountryISO = CountryISO
  PhoneNumberFormat = PhoneNumberFormat
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom
  ]
  roles: string[] = ['Admin', 'User']
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada]
  }
  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: new FormControl(undefined, [Validators.required]),
      profilePicture: [
        'https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png'
      ]
    })
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData: IAuth = this.signupForm.value
      console.log(formData)
      console.log(formData.mobile)
      if (formData.mobile.e164Number === undefined) {
        formData.mobile = formData.mobile.number
      } else {
        formData.mobile = formData.mobile.e164Number || formData.mobile.number
      }
      this._userService.createUser(formData).subscribe(
        (response: any) => {
          this.toastr.info('User created successfully', 'Success!!')
          console.log('User created successfully', response)
          this.router.navigate(['/authentication/login'])
        },
        (error: any) => {
          console.error('Error creating user', error)
          this.signupForm.reset()
        }
      )
    } else {
      console.log('Form is invalid')
      this.displayFormErrors()
    }
  }

  get f() {
    return this.signupForm.controls
  }

  displayFormErrors() {
    for (const key in this.signupForm.controls) {
      if (this.signupForm.controls.hasOwnProperty(key)) {
        const control = this.signupForm.controls[key]
        if (control.errors) {
          for (const errorKey in control.errors) {
            if (control.errors.hasOwnProperty(errorKey)) {
              this.toastr.error(
                this.getErrorMessage(key, errorKey, control.errors[errorKey]),
                'Validation Error'
              )
            }
          }
        }
      }
    }
  }

  getErrorMessage(
    controlName: string,
    errorKey: string,
    errorValue: any
  ): string {
    const errorMessages: { [key: string]: { [key: string]: string } } = {
      firstName: {
        required: 'FirstName is required',
        minlength: `Username must be at least ${errorValue.requiredLength} characters long`
      },
      lastName: {
        required: 'LastName is required',
        minlength: `Username must be at least ${errorValue.requiredLength} characters long`
      },
      email: {
        required: 'Email is required',
        email: 'Email must be a valid email address'
      },
      role: {
        required: 'Role is required'
      },
      password: {
        required: 'Password is required',
        minlength: `Password must be at least ${errorValue.requiredLength} characters long`
      },
      mobile: {
        required: 'Mobile number is required'
      }
    }

    return errorMessages[controlName][errorKey] || 'Invalid value'
  }
}
