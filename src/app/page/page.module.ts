import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PageRoutingModule } from "./page-routing.module";
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSpinnerModule } from 'ngx-spinner';
import {DialogModule} from 'primeng/dialog';

import { PageComponent } from "./page.component";
import { DemoComponent } from './demo/demo.component';
import { PlanComponent } from './plan/plan.component';
import { PagoComponent } from './pago/pago.component';
import { BeneficiosComponent } from './beneficios/beneficios.component';
import { ContactoComponent } from './contacto/contacto.component';

import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(es);

@NgModule({
  imports: [
    CommonModule,
    PageRoutingModule,
    FlexLayoutModule,
    NgxSpinnerModule,
    DialogModule,
    FormsModule ,
    ReactiveFormsModule,
  ],
  exports: [],
  declarations: [
    PageComponent,
    DemoComponent,
    PlanComponent,
    PagoComponent,
    BeneficiosComponent,
    ContactoComponent,

  ],
  providers: [
    { provide: LOCALE_ID, useValue: "es-MX" }
  ],
})
export class PageModule { }
