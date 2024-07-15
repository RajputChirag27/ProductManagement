import { Component } from '@angular/core'
import { AbstractControl, FormBuilder, ValidationErrors } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { EventserviceService } from 'src/app/core/services/eventservice.service'
import { Router } from '@angular/router'
import { FormGroup } from '@angular/forms'
import { Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { IEvent } from 'src/app/core/interfaces/IEvent'
import { EventService } from 'ag-grid-community'
import { Location } from '@angular/common'

@Component({
  selector: 'app-event',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  eventForm: FormGroup
  eventId!: string
  isDarkMode: boolean = false
  editMode: boolean = false

  constructor(
    private fb: FormBuilder,
    private eventService: EventserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private location : Location
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!
    this.editMode = !!this.eventId
    if (this.eventId && this.editMode) {
      this.eventService.getEvent(this.eventId).subscribe((event: any) => {
        console.log(event)
        this.eventForm.patchValue(event.result)
      })
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const event: IEvent = this.eventForm.value
      if (this.eventId) {
        this.eventService
          .updateEvent(this.eventId, event)
          .subscribe((response: any) => {
            this.toastr.info(`${response.message}`, `Success!`, {
              timeOut: 3000,
              closeButton: true,
              progressBar: true
            })
            this.router.navigateByUrl('/pages/content/dashboard')
          })
      } else {
        this.eventService.createEvent(event).subscribe((response: any) => {
          this.toastr.info(`${response.message}`, `Success!`, {
            timeOut: 3000,
            closeButton: true,
            progressBar: true
          })
          this.router.navigateByUrl('/pages/content/dashboard')
        })
      }
    }
  }

  back() {
    this.location.back(); 
  }
}
