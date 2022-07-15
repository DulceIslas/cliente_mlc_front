import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficioBaseComponent } from './beneficio-base.component';

describe('BeneficioBaseComponent', () => {
  let component: BeneficioBaseComponent;
  let fixture: ComponentFixture<BeneficioBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficioBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficioBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
