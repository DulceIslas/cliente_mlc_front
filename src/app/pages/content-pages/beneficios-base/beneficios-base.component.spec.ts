import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosBaseComponent } from './beneficios-base.component';

describe('BeneficiosBaseComponent', () => {
  let component: BeneficiosBaseComponent;
  let fixture: ComponentFixture<BeneficiosBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiosBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiosBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
