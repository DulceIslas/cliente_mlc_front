import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { AuthService } from '../../shared/auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {

  arrBeneficios = [];
  arrBeneficiosBase = [];
  arrBeneficiosAlaMedida = [];
  arrBeneficiarios = [];
  arrBeneficiariosBase = [];
  arrBeneficiariosAlaMedida = [];

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
          this.getResumenPropuesta();
        });
  }

  ngOnInit(): void {
  }


  getResumenPropuesta() {
    let arrTemp = [];
    let arrTempMedida = [];
    this.arrBeneficiariosAlaMedida = [];
    this.api
      .getResumenPropuesta(localStorage.getItem("curp"), this.auth.currentTokenValue)
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data);
          this.arrBeneficiarios = data;
          this.arrBeneficiariosBase = data['plan'][0];
          arrTempMedida = data['plan'][1];
          this.arrBeneficiariosAlaMedida = data['plan'][1];
          this.arrBeneficiosBase = data['plan'][0]['beneficiarios'][0];
          this.arrBeneficiosAlaMedida = data['plan'][1]['beneficiarios'][0];

          for (let bbase of this.arrBeneficiariosBase['beneficiarios']) {
            if (this.arrBeneficiariosBase['beneficiarios'].length > this.arrBeneficiariosAlaMedida['beneficiarios'].length) {

              let encontrado = this.arrBeneficiariosAlaMedida['beneficiarios'].find(item => item.tipobeneficiarioid == bbase.tipobeneficiarioid);
              console.log("encontrado", encontrado);
              if (!encontrado) {
                this.arrBeneficiariosAlaMedida['beneficiarios'].push({
                  beneficiarioid: bbase.beneficiarioid,
                  tipobeneficiarioid: bbase.tipobeneficiarioid,
                  beneficioSimpleDTO: [{
                    activo: false,
                    beneficioId: this.arrBeneficiosAlaMedida['beneficioSimpleDTO'][0].beneficioId
                  }]
                });
              }
              // for (let medida of this.arrBeneficiariosAlaMedida['beneficiarios']) {

              //   if (bbase.tipobeneficiarioid != medida.tipobeneficiarioid) {
              //     this.arrBeneficiariosAlaMedida['beneficiarios'].push({
              //       beneficiarioid: bbase.tipobeneficiarioid,
              //       beneficioSimpleDTO: [{
              //         activo: false,
              //         beneficioId: this.arrBeneficiosAlaMedida['beneficioSimpleDTO'][0].beneficioId
              //       }]
              //     });
              //     break;
              //   }
              // }
              this.arrBeneficiariosAlaMedida['beneficiarios'].sort((a,b) => a.tipobeneficiarioid - b.tipobeneficiarioid);
            }

          }

          console.log("arrBeneficiariosBase", this.arrBeneficiariosBase);
          console.log("arrBeneficiariosMedida", this.arrBeneficiariosAlaMedida);
          console.log("arrBeneficiosBase", this.arrBeneficiosBase);
          console.log("arrBeneficiosMedida", this.arrBeneficiosAlaMedida);

          data['plan'].forEach(element => {
            arrTemp.push(element.beneficiarios);
          });

          console.log(arrTemp);

          this.spinner.hide();
        },
        (error) => { }
      );

    this.api
      .getPropuesta(localStorage.getItem("curp"), this.auth.currentTokenValue)
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log(data);

          this.spinner.hide();
        },
        (error) => { }
      );
  }

}
