import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ApiService } from '../../../shared/services/api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from "ngx-spinner";

import * as _ from 'lodash';

@Component({
  selector: 'app-propuesta',
  templateUrl: './propuesta.component.html',
  styleUrls: ['./propuesta.component.scss']
})
export class PropuestaComponent implements OnInit {

  precioAnual = 0;
  precioMensual = 0;
  precioMensualAlaMedida = 0;
  arrBeneficios = [];
  arrBeneficiosSeleccionados = [];
  arrTabla = [];
  tipoPago = 0;
  frecuenciaPago = 0;
  arrResumen = [];
  arrResumenAlaMedida = [];
  decodedToken = this.jwtHelper.decodeToken(this.api.currentTokenValue);
  mostrarMsj = false;
  edad = 0;
  tarjetaMexico = false;
  currency = 'USD';
  plan = [];
  precioGastoAdmon = 5;
  checkedAviso = false;
  displayModalPdf = false;
  stringSource:any;

  constructor(
    private api: ApiService,
    public router: Router,
    private ref: ChangeDetectorRef,
    public jwtHelper: JwtHelperService,
    private spinner: NgxSpinnerService

  ) {

    // this.precioAnual = localStorage.getItem('precioAnual');
    // this.precioMensual = localStorage.getItem('precioMensual');
    this.api.loginapp().pipe(first()).subscribe((data: any) => {
      this.getResumenPropuesta();
      this.edad = parseInt(localStorage.getItem('edad'));
    });
  }

  ngOnInit(): void {
  }

  getResumenPropuesta() {
    this.arrResumen = [];
    this.spinner.show();
    this.plan = [];
    this.api.getPropuesta(localStorage.getItem('curp'), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
      console.log(data);
    });
    this.api.getResumenPropuesta(localStorage.getItem('curp'), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
      console.log(data);
      this.plan = data['plan'];
      console.log(data['plan'][0]['beneficiarios'][0]['beneficioSimpleDTO']);
      const exists = data['plan'][0]['beneficiarios'][0]['beneficioSimpleDTO'].find(b => b.beneficioId == 3);
      console.log(exists);

      exists.activo ? this.mostrarMsj = false : this.mostrarMsj = true;

      this.precioMensual = data['plan'][0].mensual ? data['plan'][0].mensual : localStorage.getItem('precioMensual');
      this.precioGastoAdmon = data['plan'][0].precioGastoAdmon ? data['plan'][0].precioGastoAdmon : 5;
      this.precioMensualAlaMedida = data['plan'][1] ? parseInt(data['plan'][1].mensual) * parseInt(data['plan'][1]['beneficiarios'].length) : 0;
      this.precioAnual = data['plan'][0].anual ? data['plan'][0].anual : localStorage.getItem('precioAnual');




      this.arrResumen = data['plan'][0]['beneficiarios'];
      this.arrResumenAlaMedida = data['plan'][1] ? data['plan'][1]['beneficiarios'] : [];
      this.spinner.hide();
      this.ref.detectChanges();
    });
  }

  getSeleccionados(tipo) {

    let arr = this.arrTabla.filter(function (e) {
      return e.tipobeneficiario == tipo;
    });

    arr = [...new Map(arr.map(item =>
      [item['beneficioid'], item])).values()];

    if (tipo != 'Titular') {
      arr.push({
        beneficioid: 3,
        esseleccionado: false
      });
    }
    arr.sort((a, b) => (a.beneficioid > b.beneficioid) ? 1 : ((b.beneficioid > a.beneficioid) ? -1 : 0));
    console.log(arr);
    return arr
  }

  changeFrecuenciaPago(id) {
    this.frecuenciaPago = id;
  }

  changeFormaPago(id) {
    this.tipoPago = id;
  }

  aceptarPropuesta() {
    this.spinner.show();
    let arrSend = [];
    let arrSendAlaMedida = [];

    arrSend.push({
      "propuestaId": localStorage.getItem('propuestaId'),
      "frecuenciaPagoId": this.frecuenciaPago,
      "tipoPlanId": localStorage.getItem('tipoplanId'),
      "formaPagoId": this.tipoPago,
      "monto": this.precioMensual,
      "tipoBeneficioId": 66, // Base
      "tarjetaMX": this.tarjetaMexico
    });


    console.log("Prouesta Base: ", JSON.stringify(arrSend[0]));



    this.api.loginapp().pipe(first()).subscribe((data: any) => {
      this.api.postAceptarPropuesta(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {

          console.log(data);
          if (data.servicioContratadoId) {
            localStorage.setItem('servicioContratadoId', data.servicioContratadoId);
            this.api.putStatus(this.api.currentTokenValue, localStorage.getItem('propuestaId'), 3).pipe(first()).subscribe((data2: any) => {});
            if (this.arrResumenAlaMedida.length > 0) {

              arrSendAlaMedida.push({
                "propuestaId": localStorage.getItem('propuestaId'),
                "frecuenciaPagoId": this.frecuenciaPago,
                "tipoPlanId": localStorage.getItem('tipoplanAlaMedidaId'),
                "formaPagoId": this.tipoPago,
                "monto": this.precioMensualAlaMedida,
                "tipoBeneficioId": 67, // A la medida
                "tarjetaMX": this.tarjetaMexico
              });

              console.log("Prouesta A la medida: ", JSON.stringify(arrSendAlaMedida[0]));

              this.api.loginapp().pipe(first()).subscribe((data: any) => {
                this.api.postAceptarPropuesta(JSON.stringify(arrSendAlaMedida[0]), this.api.currentTokenValue).pipe(first()).subscribe((data2: any) => {
                  console.log(data2);
                  if (data2.servicioContratadoId) {
                    this.api.putStatus(this.api.currentTokenValue, localStorage.getItem('propuestaId'), 3).pipe(first()).subscribe((data3: any) => {
                      localStorage.setItem('servicioContratadoAlaMedidaId', data2.servicioContratadoId);
                      this.spinner.hide();
                      this.router.navigate(["./pages/datos-formulario"]);
                    });
                  }
                });
              });
            } else {
              this.spinner.hide();
              this.router.navigate(["./pages/datos-formulario"]);
            }
          }
      });
    });
  }

  actualizarPrecio() {

    console.log("Plan:", this.plan);

    if(this.tarjetaMexico) {
      this.currency = 'MXN'
      this.precioMensual = this.plan[0].mensualMX ? this.plan[0].mensualMX : localStorage.getItem('precioMensual');
      this.precioMensualAlaMedida = this.plan[1] ? parseInt(this.plan[1].mensualMX) * parseInt(this.plan[1]['beneficiarios'].length) : 0;
      this.precioAnual = this.plan[0].anualMx ? this.plan[0].anualMx : localStorage.getItem('precioAnual');
      this.precioGastoAdmon = this.plan[0].precioGastoAdmonMX ? this.plan[0].precioGastoAdmonMX : 5;
    } else {
      this.currency = 'USD';
      this.precioMensual = this.plan[0].mensual ? this.plan[0].mensual : localStorage.getItem('precioMensual');
      this.precioMensualAlaMedida = this.plan[1] ? parseInt(this.plan[1].mensual) * parseInt(this.plan[1]['beneficiarios'].length) : 0;
      this.precioAnual = this.plan[0].anual ? this.plan[0].anual : localStorage.getItem('precioAnual');
      this.precioGastoAdmon = this.plan[0].precioGastoAdmon ? this.plan[0].precioGastoAdmon : 5;
    }

  }

  changeStep(stepper) {
    stepper.next();
  }

  openModal(opcion): void {
    /*
    console.log(chk);

    if (chk) {
      this.checkedAviso == true;
    } else {
      this.checkedAviso == false;
    }*/

    if(opcion == 'a'){
      this.stringSource = "/assets/pdf/MLC_TCs_Plan_Red_III.pdf";
    }else{
      this.stringSource = "/assets/pdf/MLC_Aviso%20de%20Privacidad_Portal%20MLC%20(Etapa_2)_%20Red_I.pdf";
    }
    /*
    setTimeout(function(){
      this.stringSource = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
    }, 3000); // <<< added delay*/
    this.displayModalPdf = true;

    this.ref.detectChanges();

    // this.modalService.open(content, {
    //   size: "xl",
    //   centered: false,
    //   scrollable: true,
    //   backdrop: 'static',
    //   keyboard: false,
    //   animation: true,
    // });
  }

}
