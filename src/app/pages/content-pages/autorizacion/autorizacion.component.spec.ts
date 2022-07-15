import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizacionComponent } from './autorizacion.component';

describe('AutorizacionComponent', () => {
  let component: AutorizacionComponent;
  let fixture: ComponentFixture<AutorizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutorizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
