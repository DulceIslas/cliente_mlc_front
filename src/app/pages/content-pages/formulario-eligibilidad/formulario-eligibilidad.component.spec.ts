import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEligibilidadComponent } from './formulario-eligibilidad.component';

describe('FormularioEligibilidadComponent', () => {
  let component: FormularioEligibilidadComponent;
  let fixture: ComponentFixture<FormularioEligibilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioEligibilidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioEligibilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
