import { BeneficiosComponent } from './beneficios/beneficios.component';
import { ContactoComponent } from './contacto/contacto.component';
import { BeneficioBaseComponent } from './../pages/content-pages/beneficio-base/beneficio-base.component';
import { PagoComponent } from './pago/pago.component';
import { PlanComponent } from './plan/plan.component';
import { DemoComponent } from './demo/demo.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from './page.component';
import { AuthGuard } from 'app/shared/auth/auth-guard.service';


const routes: Routes = [
  {
    path: '',

    children: [
      {
        path: '',
        component: PageComponent,
        data: {
          title: 'Mi Perfil'
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'plan',
        component: PlanComponent,
        data: {
          title: 'Mi Plan'
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'plan',
        component: PlanComponent,
        data: {
          title: 'Mi Plan'
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'pago',
        component: PagoComponent,
        data: {
          title: 'Pago'
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'beneficios',
        component: BeneficiosComponent,
        data: {
          title: 'Beneficios'
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'contacto',
        component: ContactoComponent,
        data: {
          title: 'Contacto'
        },
        canActivate: [AuthGuard],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule { }
