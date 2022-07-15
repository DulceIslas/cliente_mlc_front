import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { AuthService } from '../../shared/auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.scss']
})
export class BeneficiosComponent implements OnInit {

  arrBeneficiosBase = [];
  arrBeneficiosAlaMedida = [];
  arrBeneficiariosBase = [];
  arrBeneficiariosAlaMedida = [];
  displayModalResponsive = false;
  imagen = '';
  titulobeneficio = '';
  nombre = '';
  membresia = '';
  anemex = '';
  BeneficioId = 0;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    public router: Router,
    public jwtHelper: JwtHelperService,
    private spinner: NgxSpinnerService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
  ) {
    this.spinner.show();
    this.auth
      .resigninUser(localStorage.getItem("mail").toString(), localStorage.getItem("identityp").toString())
      .pipe(first())
      .subscribe(
        (data) => {
          this.getResumenPropuesta();
          this.getPropuestaCurpOMembresia();
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
          console.log(data);
          let consecu = data.consecutivo == 0 ? '' : + '-' + data.consecutivo;
          this.membresia = data.nummembresia + consecu;
          this.nombre = data.nombre + ' ' + data.primerapellido + ' ' + data.segundoapellido;
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
          this.arrBeneficiariosBase = data.plan[0]['beneficiarios'];
          if (data.plan[1]) {
            this.arrBeneficiariosAlaMedida = data.plan[1]['beneficiarios'];
            this.arrBeneficiosAlaMedida = data['plan'][1]['beneficiarios'][0];
          }

          for (let bbase of this.arrBeneficiariosBase) {
            if (this.arrBeneficiariosBase.length > this.arrBeneficiariosAlaMedida.length) {
              for (let medida of this.arrBeneficiariosAlaMedida) {
                if (bbase.tipobeneficiarioid != medida.tipobeneficiarioid) {
                  this.arrBeneficiariosAlaMedida.push({
                    beneficiarioid: bbase.tipobeneficiarioid,
                    beneficioSimpleDTO: [{
                      activo: false,
                      beneficioId: this.arrBeneficiosAlaMedida['beneficioSimpleDTO'][0].beneficioId,
                      imagen: this.arrBeneficiosAlaMedida['beneficioSimpleDTO'][0].imagen,
                    }]
                  });
                  break;
                }
              }
              this.arrBeneficiariosAlaMedida.sort((a,b) => a.beneficiarioid - b.beneficiarioid);
            }

          }

          console.log(this.arrBeneficiariosBase);
          console.log(this.arrBeneficiariosAlaMedida);

          this.spinner.hide();
        },
        (error) => {
          console.log(error);
         }
      );
  }

  verDetalles(content, item) {
    this.imagen = item.imagen;
    this.titulobeneficio = item.titulobeneficio;
    // this.displayModalResponsive = true;
    this.arrBeneficiosBase =  [];
    this.BeneficioId = item.beneficioId;

    this.api
    .getPropuesta(localStorage.getItem("curp"), this.auth.currentTokenValue)
    .pipe(first())
    .subscribe(
      (data: any) => {
        console.log(data);

        if (item.tipobeneficioId == 67) {
        this.arrBeneficiosBase = data['plan'][1]['beneficios'].filter(e => e.beneficioid == item.beneficioId);
        } else if (item.tipobeneficioId == 66) {
          console.log(data['plan'][0]['beneficios']);
        this.arrBeneficiosBase = data['plan'][0]['beneficios'].filter(e => e.beneficioid == item.beneficioId);
        }
        // console.log("arrBeneficiariosBase: ", this.arrBeneficiariosBase);
        // console.log("arrBeneficiosBase: ", this.arrBeneficiosBase);
        // console.log(this.arrBeneficiosBase[0]['beneficiosbeneficiarios'])
        this.spinner.hide();

      },
      (error) => {
        console.log(error);
      }
    );


    this.arrBeneficiosBase = [];
    // if (item.tipobeneficioId == 67) {
    //   this.arrBeneficiosBase = this.arrBeneficiariosAlaMedida[0]['beneficioSimpleDTO'].filter(
    //     e => e.beneficioId == item.beneficioId);
    // } else if (item.tipobeneficioId == 66) {
    //   this.arrBeneficiosBase = this.arrBeneficiariosBase[0]['beneficioSimpleDTO'].filter(
    //     e => e.beneficioId == item.beneficioId);
    // }

    this.modalService.open(content, {
      size: "xl",
      centered: false,
      scrollable: true,
      keyboard: false,
      animation: true,
    });

    this.ref.detectChanges();
  }

  closeModal() {
    this.modalService.dismissAll();
  }


}
