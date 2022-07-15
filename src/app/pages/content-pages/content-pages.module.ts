import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

import { ContentPagesRoutingModule } from "./content-pages-routing.module";

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { MatSliderModule } from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DialogModule} from 'primeng/dialog';
import { VgCoreModule, } from '@videogular/ngx-videogular/core';
import {StepsModule} from 'primeng/steps';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatRadioModule} from '@angular/material/radio';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { esLocale } from "ngx-bootstrap/locale";
import { defineLocale } from 'ngx-bootstrap/chronos';
import { NgxStripeModule } from 'ngx-stripe';
import { MomentModule } from 'ngx-moment';
import {DropdownModule} from 'primeng/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxExtendedPdfViewerModule, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {CheckboxModule} from 'primeng/checkbox';
import {InputSwitchModule} from 'primeng/inputswitch';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';


/////// ****** Components

import { ErrorPageComponent } from "./error/error-page.component";
import { LoginPageComponent } from "./login/login-page.component";
import { BeneficioBaseComponent } from './beneficio-base/beneficio-base.component';
import { DatosFormularioComponent } from './datos-formulario/datos-formulario.component';
import { BeneficiosBaseComponent } from './beneficios-base/beneficios-base.component';
import { FormularioEligibilidadComponent } from './formulario-eligibilidad/formulario-eligibilidad.component';
import { PropuestaComponent } from './propuesta/propuesta.component';
import { HomeComponent } from './home/home.component';
import { AutorizacionComponent } from './autorizacion/autorizacion.component';

import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(es);
defineLocale("es", esLocale);

const absoluteCMapUrl = pdfDefaultOptions.cMapUrl().replace('./', '/');
pdfDefaultOptions.cMapUrl = () => absoluteCMapUrl;

@NgModule({
    imports: [
        CommonModule,
        ContentPagesRoutingModule,
        FormsModule ,
        ReactiveFormsModule,
        NgbModule,
        NgxSpinnerModule,
        MatFormFieldModule,
        MatStepperModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        DialogModule,
        VgCoreModule,
        StepsModule,
        FlexLayoutModule,
        MatRadioModule,
        MatSnackBarModule,
        BsDatepickerModule.forRoot(),
        NgxStripeModule.forRoot('pk_test_51JZMBDLm93TetmkamLaX6DbO9PrSOY7zTlNJB2hLfXQLCwBWZMcH9LuCW0ZG6ZYURPVWWzGxyeD9JO9Q5zAruFmf00QuPJRxUr'),
        MomentModule,
        NgxSpinnerModule,
        DropdownModule,
        NgSelectModule,
        NgxExtendedPdfViewerModule,
        PdfViewerModule,
        CheckboxModule,
        InputSwitchModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule
    ],
    declarations: [
        ErrorPageComponent,
        LoginPageComponent,
        BeneficioBaseComponent,
        BeneficiosBaseComponent,
        DatosFormularioComponent,
        FormularioEligibilidadComponent,
        PropuestaComponent,
        HomeComponent,
        AutorizacionComponent
    ],
    providers: [
      { provide: LOCALE_ID, useValue: "es-MX" }
    ],

})
export class ContentPagesModule {
  constructor(private bsLocaleService: BsLocaleService) {
    this.bsLocaleService.use("es"); //fecha en español, datepicker
  }
}
