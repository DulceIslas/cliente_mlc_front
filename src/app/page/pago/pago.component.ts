import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { AuthService } from '../../shared/auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss']
})
export class PagoComponent implements OnInit {

  tipoPlan= "";
  membresia= "";
  fechaContratacion: any;
  fechaVigencia: any;
  formaPago= "";
  frecuenciaPago= "";
  fechaProximoPago: any;
  monto= "";
  periodoPago: any;
  pagos=[];
  currency = 'USD';


  constructor(
    private api: ApiService,
    private auth: AuthService,
    public router: Router,
    public jwtHelper: JwtHelperService,
    private spinner: NgxSpinnerService,
    private ref: ChangeDetectorRef,
  ) {
    this.spinner.show();
    this.auth
      .resigninUser(localStorage.getItem("mail").toString(), localStorage.getItem("identityp").toString())
      .pipe(first())
      .subscribe(
        (data) => {
          this.getPropuestaCurpOMembresia();
          this.getResumenPropuesta();
          this.getPagos();
        });
  }

  ngOnInit(): void {
  }

  getPropuestaCurpOMembresia() {
    this.api
      .getPropuestaCurpOMembresia(localStorage.getItem("curp"), this.auth.currentTokenValue)
      .pipe(first())
      .subscribe(
        (data: any) => {
          let consecu = data.consecutivo == 0 ? '' : + '-' + data.consecutivo;
          console.log("getPropuestaCurpOMembresia:", data);
          this.tipoPlan = data.claveplan;
          this.membresia = data.nummembresia + consecu;
          this.fechaContratacion = moment(data.fechacontratacion);
          this.fechaVigencia = moment(data.fechafin);
          this.formaPago = data.formapago;
          this.fechaProximoPago =  moment(data.fechaProximoPago).add(1, 'd');
          this.monto = data.montopagar;
          this.currency = data.moneda ? data.moneda : 'USD';
          this.frecuenciaPago = data.frecuenciapago;
          this.periodoPago = data.periodopago;
          this.spinner.hide();
          this.ref.detectChanges();


        },
        (error) => {
          console.log(error);
        }
      );
  }

  getResumenPropuesta() {
    this.api
      .getResumenPropuesta(localStorage.getItem("curp"), this.auth.currentTokenValue)
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data);
          this.frecuenciaPago = '' ? data.frecuenciaPago: this.frecuenciaPago;
        },
        (error) => { }
      );
  }

  getPagos() {
    this.api.getPagosPropuesta(localStorage.getItem("curp"), this.auth.currentTokenValue).pipe(first()).subscribe((data: any) => {
      console.log("getPagosPropuesta", data);
      this.pagos = data;
      this.ref.detectChanges();
    },
      error => console.log('oops', error)
    );
  }

}
