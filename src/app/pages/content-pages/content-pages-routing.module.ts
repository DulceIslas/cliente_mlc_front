import { AutorizacionComponent } from './autorizacion/autorizacion.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorPageComponent } from "./error/error-page.component";
import { LoginPageComponent } from "./login/login-page.component";
import { PropuestaComponent } from './propuesta/propuesta.component';
import { FormularioEligibilidadComponent } from './formulario-eligibilidad/formulario-eligibilidad.component';
import { DatosFormularioComponent } from './datos-formulario/datos-formulario.component';
import { BeneficiosBaseComponent } from './beneficios-base/beneficios-base.component';
import { VideoComponent } from '../video/video.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'error',
        component: ErrorPageComponent,
        data: {
          title: 'Error Page'
        }
      },
      {
        path: 'login',
        component: LoginPageComponent,
        data: {
          title: 'Login Page'
        }
      },
      {
        path: 'beneficios-base',
        component: BeneficiosBaseComponent,
        data: {
          title: 'Beneficios Base'
        }
      },
      {
        path: 'datos-formulario',
        component: DatosFormularioComponent,
        data: {
          title: 'Datos Formulario'
        }
      },
      {
        path: 'formulario-eligibilidad',
        component: FormularioEligibilidadComponent,
        data: {
          title: 'Formulario eligibilidad'
        }
      },
      {
        path: 'propuesta',
        component: PropuestaComponent,
        data: {
          title: 'Propuesta'
        }
      },
      {
        path: 'home',
        component: HomeComponent,
        data: {
          title: 'Home'
        }
      },
      {
        path: 'video',
        component: VideoComponent,
        data: {
          title: 'Video'
        }
      },
      {
        path: 'autorizacion',
        component: AutorizacionComponent,
        data: {
          title: 'Autorización'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentPagesRoutingModule { }
