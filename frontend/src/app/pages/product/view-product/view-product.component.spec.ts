import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ViewProductComponent } from './view-product.component'

describe('ViewProductComponent', () => {
  let component: ViewProductComponent
  let fixture: ComponentFixture<ViewProductComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewProductComponent]
    })
    fixture = TestBed.createComponent(ViewProductComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
