import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {ApiService} from '../shared/services/api.service';
import {AuthService} from '../shared/auth/auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})

export class PageComponent {

  nombre = '';
  curp= '';
  fechaNacimineto: any;
  sexo= '';
  estadoOrigen= '';
  PaisTrabajo= '';
  estadoTrabajo= '';
  mail= '';
  telefono= '';
  ladapais = '';
  personaFisicaId = '';
  passFormSubmitted = false;

  frmPass = new FormGroup({
    newPassword: new FormControl('', [Validators.required]),
    newPasswordConfirm: new FormControl('', [Validators.required])
  });

  constructor(
    private api: ApiService,
    private auth: AuthService,
    public router: Router,
    public jwtHelper: JwtHelperService,
    private spinner: NgxSpinnerService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
  )
  {
    this.spinner.show();
    this.auth
    .resigninUser(localStorage.getItem("mail").toString(), localStorage.getItem("identityp").toString())
    .pipe(first())
    .subscribe(
      (data) => {
      this.getUserById();
      });
  }

  get f() {
    return this.frmPass.controls;
  }

  getUserById() {
      let tk = localStorage.getItem("tokenApp").toString();
      console.log(tk);
      console.log(this.jwtHelper.decodeToken(localStorage.getItem("tokenApp").toString()));
      let idUser= this.jwtHelper.decodeToken(localStorage.getItem("tokenApp").toString())["user"]['idPersona'];
      this.api
      .getUserById(idUser, this.auth.currentTokenValue)
      .pipe(first())
      .subscribe(
        (data: any) => {
          let arrTemp = [];
          let persona = data;
          console.log("getUserById", data);
          this.nombre = persona["personaFisica"]['nombre'] + ' ' + persona["personaFisica"]['primerApellido'] + ' ' + persona["personaFisica"]['segundoApellido'];
          this.fechaNacimineto = moment(persona["personaFisica"]["fechaNacimiento"]).add(1, 'days');
          this.mail= persona['usuario']['usuario'];
          this.sexo = persona["personaFisica"]['sexo'];
          this.estadoOrigen = persona["personaFisica"]['estadoOrigen'];
          this.PaisTrabajo = persona["personaFisica"]['pais'];
          this.estadoTrabajo = persona["personaFisica"]['estado'];
          this.curp = persona["personaFisica"]['curp'];
          this.personaFisicaId = persona["personaFisica"]['personaFisicaId'];
          this.spinner.hide();
          localStorage.setItem("curp", this.curp);
          localStorage.setItem("nombre", this.nombre);
          arrTemp = data.contactos.filter(
            e => e.tipoContactoId == 48);

          this.telefono = arrTemp[0].contacto;

          console.log("arrTemp", arrTemp);

        },
        (error) => {
          console.log("Error: ", error);
        }
      );


      this.api
      .getPropuestaCurpOMembresia(localStorage.getItem("curp"), this.auth.currentTokenValue)
      .pipe(first())
      .subscribe(
        (data: any) => {
          console.log("getPropuestaCurpOMembresia", data);
          localStorage.setItem("membresia", data.nummembresia);
          this.ladapais = data.ladapais
        },
        (error) => {
          console.log("Error: ", error);
        }
      );

      this.api
      .getPagosPropuesta(localStorage.getItem("curp"), this.auth.currentTokenValue)
      .pipe(first())
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log("Error: ", error);
        }
      );

      this.api
      .getResumenPropuesta(localStorage.getItem("curp"), this.auth.currentTokenValue)
      .pipe(first())
      .subscribe(
        (data) => {
          console.log("getResumenPropuesta", data);
        },
        (error) => {
          console.log("Error: ", error);
        }
      );

      this.api
      .getPropuesta(localStorage.getItem("curp"), this.auth.currentTokenValue)
      .pipe(first())
      .subscribe(
        (data) => {
          console.log("getPropuesta", data);
        },
        (error) => {
          console.log("Error: ", error);
        }
      );

  }

  openModalContra(content, visible) {
    this.modalService.open(content, {
      size: "lg",
      centered: true,
      scrollable: true,
      animation: true,
      backdrop: true,
    });
    }



    updatePassword(){
      this.passFormSubmitted = true;
      if (this.frmPass.invalid) {
        return;
      }
      this.api.putPassword(
      this.auth.encrypt("sItTnW"+this.personaFisicaId+"FC2g"),
      this.auth.encrypt(this.frmPass.value.newPassword),
      this.auth.encrypt(this.frmPass.value.newPasswordConfirm)).subscribe((data: any) => {
        console.log(data);
        localStorage.setItem("identityp", this.auth.encrypt(this.frmPass.value.newPassword));

        Swal.fire({

          title: "",
          text: data.mss,
        });
        this.frmPass.patchValue(
          {
            'newPass': '',
            'newPassConfirm': ''
          });
        this.passFormSubmitted = false;
        this.modalService.dismissAll();
      },
      (error) => {
        console.log(error);
      }
      );
    }

}
