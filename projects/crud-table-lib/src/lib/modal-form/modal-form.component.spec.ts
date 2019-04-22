import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormComponent } from './modal-form.component';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormInputComponent } from '../dynamic-form/dynamic-form-input.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarModule } from 'primeng/calendar';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ModalFormComponent', () => {
  let component: ModalFormComponent;
  let fixture: ComponentFixture<ModalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ModalFormComponent,
        DynamicFormComponent,
        DynamicFormInputComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        CalendarModule
      ],
      providers: [
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
