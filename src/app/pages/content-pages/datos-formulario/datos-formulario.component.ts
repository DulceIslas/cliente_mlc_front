import { element } from 'protractor';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, filter } from 'rxjs/operators';
import { ApiService } from '../../../shared/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { setTheme } from 'ngx-bootstrap/utils';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

interface Country {
  name: string,
  code: string,
  value: string
}

@Component({
  selector: 'app-datos-formulario',
  templateUrl: './datos-formulario.component.html',
  styleUrls: ['./datos-formulario.component.scss']
})
export class DatosFormularioComponent implements OnInit {

  miembroFamilia = '';
  precioAnual = 0;
  precioMensual = 0;
  precioMensualAlaMedida = 0;
  arrBeneficios = [];
  arrBeneficiosSeleccionados = [];
  arrTabla = [];
  tipoPago = 0;
  paises = [];
  estados = [];
  estadosEU = [];
  sexos = [
    {
      sexo: 'Masculino',
      sexoid: 46
    },
    {
      sexo: 'Femenino',
      sexoid: 45
    }
  ];
  maxDate = new Date();
  maxDateParejaPadres = new Date();
  minDateParejaPadres = new Date();
  fechaCurp: any;
  submitted = false;
  submittedP = false;
  submitted2 = false;
  frm: FormGroup;
  frmP: FormGroup;
  frm2: FormGroup;
  tipobeneficiarioid = 0;
  beneficiarioId = 0;
  arrBeneficiarios = [];
  arrResumenAlaMedida = [];
  formlarioCompleto = false;
  countCompleto = 0;
  index = 1;
  arrResumen = [];
  personaId = 0;
  plan =[];
  costoInicial = 0;
  costoSegundo = 0;
  selectedCountry: Country;
  selectedCountryPareja: Country;
  selectedCountryPadresHijos: Country;
  sexo = 'Sexo'
  frecuenciaPagoId = 0;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  frecuencaPago = '';
  propuestaid = 0;
  mostrarMsj = false;
  edad = 0;
  descripcionPlan = '';
  selectedValue = 0;
  currency = 'USD';
  precioGastoAdmon = 5;
  frmDatosProyecto: FormGroup;
  frmNombre: FormGroup;
  decodedToken = this.jwtHelper.decodeToken(this.api.currentTokenValue);

  config = {
    animated: true
  };
  countries: { name: string; code: string; value: string, imgSrc: String }[];


  constructor(
    private modalService: NgbModal,
    private api: ApiService,
    public router: Router,
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public jwtHelper: JwtHelperService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {

    setTheme('bs4');
    this.maxDate.setDate(this.maxDate.getDate());
    this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.spinner.show();
        this.getPais();
        this.getEstadosMexico(142);
        this.getData();
        this.getResumenPropuesta();
        this.getPropuesta();



        this.fechaCurp = this.curp2date(localStorage.getItem('curp').toUpperCase());

        // localStorage.setItem("fechaNacimiento", fechaCurp.toString());
        // var fechaActual = new Date();
        // let yearsDiff = fechaActual.getFullYear() - fechaCurp.getFullYear();
        // let monthDiif = fechaActual.getMonth() - fechaCurp.getMonth();

        // if (monthDiif < 0 || (monthDiif === 0 && fechaActual.getDate() < fechaCurp.getDate())) {
        //   yearsDiff--;
        // }

        // localStorage.setItem("edad", yearsDiff.toString());
        // this.edad = yearsDiff;



        // this.edad = parseInt(localStorage.getItem('edad'));
      });

    this.countries = [
      {name: '+1', code: 'ca', value: '40', imgSrc: "../../../../assets/img/flags/ca.svg"},
      {name: '+1', code: 'us', value: '70', imgSrc: "../../../../assets/img/flags/us.svg"},
      {name: '+52', code: 'mx', value: '142', imgSrc: "../../../../assets/img/flags/mx.svg"},
  ];

  }

  ngOnInit(): void {

    this.frm = this.formBuilder.group({
      nombre: ["", Validators.required],
      apaterno: ["", Validators.required],
      amaterno: ["", Validators.required],
      lada: ["0", Validators.required],
      telefono: ["",  [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ],],
      // correo: ["", [Validators.required, Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)]],
      correo: ["", [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i)]],
      fnacimiento: ["", Validators.required],
      sexo: ["", Validators.required],
      estado: ["0", Validators.required],
      estadoEU: ["0", Validators.required],
      pais: ["0", Validators.required],
    });

    this.frmP = this.formBuilder.group({
      nombreP: ["", Validators.required],
      apaternoP: ["", Validators.required],
      amaternoP: ["", Validators.required],
      ladaP: ["0", Validators.required],
      telefonoP: ["",  [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ],],
      // correoP: ["", [Validators.required, Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)]],
      correoP: ["", [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i)]],
      fnacimientoP: ["", Validators.required],
      sexoP: ["0", Validators.required],
      estadoP: ["0", Validators.required],
    });

    this.frm2 = this.formBuilder.group({
      nombre2: ["", Validators.required],
      apaterno2: ["", Validators.required],
      amaterno2: ["", Validators.required],
      lada2: ["0", Validators.required],
      telefono2: ["",  [
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ],],
      // correo2: ["", [Validators.required,Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)]],
      correo2: ["", [Validators.required,Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i)]],
      fnacimiento2: ["", Validators.required],
      sexo2: ["0", Validators.required],
    });


  }

  get f() {
    return this.frm.controls;
  }

  get f2() {
    return this.frm2.controls;
  }

  get fP() {
    return this.frmP.controls;
  }

  checkToken() {
    // if (helper.isTokenExpired(this.api.currentTokenValue)) {
    //   this.api.loginapp().pipe(first()).subscribe((data: any) => { });
    // }
  }

  getData() {

    this.arrBeneficiarios = [];
    this.api.getDataBeneficiariosById(localStorage.getItem('propuestaId'), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
      console.log(data);

      // data.beneficiario = [...new Map(data.beneficiario.map(item =>
      //   [item['tipoBeneficiarioId'], item])).values()];

        data.beneficiario.forEach((element, index) => {

        element.fechaNacimiento ? element.fechaNacimiento = element.fechaNacimiento.replace(/-/g, '\/').replace(/T.+/, '') : '';

        if (element.tipoBeneficiarioId == 15) {
          if (element.apellidoMaterno && element.apellidoPaterno && element.fechaNacimiento
            && element.nombre && element.sexoId && element.telefono && element.correo
            && element.estadoOrigenId && element.estadoTrabajoId && element.paisTrabajoId) {
            element.completo = true;
            this.countCompleto++;
          }
        } else if (element.tipoBeneficiarioId == 16) {
          if (element.apellidoMaterno && element.apellidoPaterno && element.fechaNacimiento
            && element.nombre && element.sexoId && element.estadoOrigenId) {
            element.completo = true;
            this.countCompleto++;
          }

        } else if (element.tipoBeneficiarioId == 17 || element.tipoBeneficiarioId == 18) {
          if (element.apellidoMaterno && element.apellidoPaterno && element.fechaNacimiento
            && element.nombre && element.sexoId) {
            element.completo = true;
            this.countCompleto++;
          }

        } else if (element.tipoBeneficiarioId == 19) {
          if (element.apellidoMaterno && element.apellidoPaterno && element.fechaNacimiento
            && element.nombre && element.sexoId) {
            element.completo = true;
            this.countCompleto++;
          }
        }
        this.countCompleto == data.beneficiario.length ? this.formlarioCompleto = true : this.formlarioCompleto = false;

      });

      this.arrBeneficiarios = data.beneficiario;

      this.arrBeneficiarios.sort((a,b) => a.beneficiarioId - b.beneficiarioId);

      console.log("arrBeneficiarios", this.arrBeneficiarios);

      this.spinner.hide();
      this.ref.detectChanges();
    });
  }

  getResumenPropuesta() {
    // this.arrResumen =[];
    // this.arrBeneficios = [];
    // let arr = [];
    // this.api.getResumenPropuesta(localStorage.getItem('curp'), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
    //   console.log(data);
    //   this.arrResumen = data.beneficiarios;
    //   this.arrResumen.forEach(element => {
    //     element['beneficioSimpleDTO'].forEach(item => {
    //       if (item.activo) {
    //         arr.push(
    //           item.titulobeneficio
    //         );
    //       }
    //     });
    //   });

    //   this.arrBeneficios = [...new Set(arr)];
    //   this.ref.detectChanges();
    // });
    this.arrResumen = [];
    this.spinner.show();
    this.api.getResumenPropuesta(localStorage.getItem('curp'), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
      console.log(data);
      console.log(data['plan'][0]['beneficiarios'][0]['beneficioSimpleDTO']);
      const exists = data['plan'][0]['beneficiarios'][0]['beneficioSimpleDTO'].find(b => b.beneficioId == 3);
      console.log(exists);

      exists.activo ? this.mostrarMsj = false : this.mostrarMsj = true;


      if (data['plan'][0].tarjetaMX) {
        this.precioMensual = data['plan'][0].mensualMX ? data['plan'][0].mensualMX : localStorage.getItem('precioMensual');
        this.precioMensualAlaMedida = data['plan'][1] ? parseInt(data['plan'][1].mensualMX) * parseInt(data['plan'][1]['beneficiarios'].length) : 0;
        this.precioAnual = data['plan'][0].anualMX ? data['plan'][0].anualMX : localStorage.getItem('precioAnual');
        this.precioGastoAdmon = data['plan'][0]['precioGastoAdmonMX'] ? data['plan'][0]['precioGastoAdmonMX'] : 5;
      } else {
        this.precioMensual = data['plan'][0].mensual ? data['plan'][0].mensual : localStorage.getItem('precioMensual');
        this.precioMensualAlaMedida = data['plan'][1] ? parseInt(data['plan'][1].mensual) * parseInt(data['plan'][1]['beneficiarios'].length) : 0;
        this.precioAnual = data['plan'][0].anual ? data['plan'][0].anual : localStorage.getItem('precioAnual');
        this.precioGastoAdmon = data['plan'][0]['precioGastoAdmon'] ? data['plan'][0]['precioGastoAdmon'] : 5;
      }
      this.frecuencaPago = data['plan'][0]['frecuenciaPago'];
      this.arrResumen = data['plan'][0]['beneficiarios'];
      this.arrResumenAlaMedida = data['plan'][1] ? data['plan'][1]['beneficiarios'] : [];
      this.arrResumenAlaMedida.length > 0 ? this.descripcionPlan = data['plan'][0]['descripcionPlan'] + ' / ' + data['plan'][1]['descripcionPlan'] :
      this.descripcionPlan = data['plan'][0]['descripcionPlan'];
      this.currency = data['plan'][0]['moneda'] ? data['plan'][0]['moneda'] : 'USD';
      this.spinner.hide();
      this.ref.detectChanges();
    });
  }

  getPropuesta() {
    this.api.getPropuesta(localStorage.getItem('curp'), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
      console.log(data);
      this.plan = data.plan;
      this.propuestaid = data['propuestaid'];
      this.plan.forEach(element => {
        this.costoInicial += element['costo'];
        this.costoSegundo += element['costo'];
      });
      this.costoInicial += 5;
      this.frecuenciaPagoId = this.plan['clFrecuenciaPagoId'];
    });
  }

  getPais() {

      this.api.getPais(this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
        this.paises = data;
        this.paises = this.paises.filter(item => item.paisid == 70 || item.paisid == 40);
      });

  }

  getEstadosMexico(idPais) {
    this.estados = [];

      this.api.getEstado(idPais, this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
        this.estados = data;
      });

  }

  getEstadosEU(idPais) {
    this.estadosEU = [];

      this.api.getEstado(idPais, this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
        this.estadosEU = data;
      });

  }

  addUserTitular() {
    this.submitted = true;
    let arrSend = [];
    if (this.frm.invalid || this.frm.value.sexo == 0 ||
      this.frm.value.pais == 0 ||
      this.frm.value.estado == 0) {
      return;
    }
    this.frm.getRawValue();
    this.spinner.show();
    if (this.personaId == 0) {
      arrSend.push({
        "tipoBeneficiarioId": this.tipobeneficiarioid,
        "nombre": this.frm.controls.nombre.value,
        "apellidoPaterno": this.frm.controls.apaterno.value,
        "apellidoMaterno": this.frm.controls.amaterno.value,
        "telefono": this.frm.controls.telefono.value,
        "email": this.frm.controls.correo.value,
        "fechaNacimiento": new Date(this.frm.controls.fnacimiento.value.getMonth() + 1 + '/' + this.frm.controls.fnacimiento.value.getDate()+ '/' + this.frm.controls.fnacimiento.value.getFullYear()),
        "sexo": this.frm.controls.sexo.value,
        "paisOrigenId": 142,
        "estadoOrigenId": this.frm.controls.estado.value,
        "propuestaId": localStorage.getItem('propuestaId'),
        "paisResidenciaId": this.frm.controls.pais.value,
        "estadoResidenciaId": this.frm.controls.estadoEU.value,
        "paisId": this.frm.controls.lada.value.value,
        "beneficiarioId": this.beneficiarioId
      });
      console.log(JSON.stringify(arrSend[0]));
      this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.api.addUserTitularPareja(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
          console.log(data);
          if (data.personaFisica) {
            this.modalService.dismissAll();
            this.reloadCurrentRoute();
          }
        });
      });
    } else {
      arrSend.push({
        "tipoBeneficiarioId": this.tipobeneficiarioid,
        "nombre": this.frm.controls.nombre.value,
        "apellidoPaterno": this.frm.controls.apaterno.value,
        "apellidoMaterno": this.frm.controls.amaterno.value,
        "telefono": this.frm.controls.telefono.value,
        "email": this.frm.controls.correo.value,
        "fechaNacimiento": new Date(this.frm.controls.fnacimiento.value.getMonth() + 1 + '/' + this.frm.controls.fnacimiento.value.getDate()+ '/' + this.frm.controls.fnacimiento.value.getFullYear()),
        "sexo": this.frm.controls.sexo.value,
        "paisOrigenId": 142,
        "estadoOrigenId": this.frm.controls.estado.value,
        "propuestaId": localStorage.getItem('propuestaId'),
        "paisResidenciaId": this.frm.controls.pais.value,
        "estadoResidenciaId": this.frm.controls.estadoEU.value,
        "paisId": this.frm.controls.lada.value.value,
        "personaId": this.personaId,
        "beneficiarioId": this.beneficiarioId
      });
      console.log(JSON.stringify(arrSend[0]));
      this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.api.updateUserTitularPareja(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
          console.log(data);
          if (data.personaFisica) {
            this.modalService.dismissAll();
            this.reloadCurrentRoute();
          }
        });
      });
    }


  }

  addUserPareja() {
    this.submittedP = true;
    let arrSend = [];
    let arrTemp = [];
    let telefonia: any;

    if (this.arrResumenAlaMedida) {
      arrTemp = this.arrResumenAlaMedida.find(element => element.tipobeneficiarioid == this.tipobeneficiarioid);
      if(!arrTemp) {
        this.frmP.get('correoP').removeValidators(Validators.required);
        this.frmP.get('telefonoP').removeValidators(Validators.required);
        // this.frmP.get('ladaP').removeValidators(Validators.required);
      } else {
        this.frmP.get('correoP').addValidators(Validators.required);
        this.frmP.get('telefonoP').addValidators(Validators.required);
        // this.frmP.get('ladaP').addValidators(Validators.required);
      }
      this.frmP.controls['correoP'].updateValueAndValidity();
      this.frmP.controls['telefonoP'].updateValueAndValidity();
      // this.frmP.controls['ladaP'].updateValueAndValidity();
    }


    if (this.frmP.invalid || this.frmP.value.sexoP == 0) {
      return;
    }

    this.frmP.getRawValue();
    this.spinner.show();
    if (this.personaId == 0) {
      arrSend.push({
        "tipoBeneficiarioId": this.tipobeneficiarioid,
        "nombre": this.frmP.controls.nombreP.value,
        "apellidoPaterno": this.frmP.controls.apaternoP.value,
        "apellidoMaterno": this.frmP.controls.amaternoP.value,
        "telefono": this.frmP.controls.telefonoP.value,
        "email": this.frmP.controls.correoP.value,
        "fechaNacimiento": new Date(this.frmP.controls.fnacimientoP.value.getMonth() + 1 + '/' + this.frmP.controls.fnacimientoP.value.getDate()+ '/' + this.frmP.controls.fnacimientoP.value.getFullYear()),
        "sexo": this.frmP.controls.sexoP.value,
        "paisOrigenId": 142,
        "estadoOrigenId": this.frmP.controls.estadoP.value,
        "propuestaId": localStorage.getItem('propuestaId'),
        "paisId": this.frmP.controls.ladaP.value.value,
        "beneficiarioId": this.beneficiarioId
      });
      console.log(JSON.stringify(arrSend[0]));
        this.api.loginapp().pipe(first()).subscribe((data: any) => {
          this.api.addUserTitularPareja(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
            if (data.personaFisica) {
              this.modalService.dismissAll();
              this.reloadCurrentRoute();
            }
          });
        });
      } else {
        arrSend.push({
          "tipoBeneficiarioId": this.tipobeneficiarioid,
          "nombre": this.frmP.controls.nombreP.value,
          "apellidoPaterno": this.frmP.controls.apaternoP.value,
          "apellidoMaterno": this.frmP.controls.amaternoP.value,
          "telefono": this.frmP.controls.telefonoP.value,
          "email": this.frmP.controls.correoP.value,
          "fechaNacimiento": new Date(this.frmP.controls.fnacimientoP.value.getMonth() + 1 + '/' + this.frmP.controls.fnacimientoP.value.getDate()+ '/' + this.frmP.controls.fnacimientoP.value.getFullYear()),
          "sexo": this.frmP.controls.sexoP.value,
          "paisOrigenId": 142,
          "estadoOrigenId": this.frmP.controls.estadoP.value,
          "propuestaId": localStorage.getItem('propuestaId'),
          "paisId": this.frmP.controls.ladaP.value.value,
          "personaId": this.personaId,
          "beneficiarioId": this.beneficiarioId
        });
        console.log(JSON.stringify(arrSend[0]));
          this.api.loginapp().pipe(first()).subscribe((data: any) => {
            this.api.updateUserTitularPareja(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
              if (data.personaFisica) {
                this.modalService.dismissAll();
                this.reloadCurrentRoute();
              }
            });
          });
      }

  }

  addUserPadres() {
    this.submitted2 = true;
    let arrSend = [];
    let arrTemp = [];

    if (this.arrResumenAlaMedida) {
      arrTemp = this.arrResumenAlaMedida.find(element => element.tipobeneficiarioid == this.tipobeneficiarioid);
      if(!arrTemp) {
        this.frm2.get('correo2').removeValidators(Validators.required);
        this.frm2.get('telefono2').removeValidators(Validators.required);
        this.frm2.get('lada2').removeValidators(Validators.required);
      } else {
        this.frm2.get('correo2').addValidators(Validators.required);
        this.frm2.get('telefono2').addValidators(Validators.required);
        this.frm2.get('lada2').addValidators(Validators.required);
      }
      this.frm2.controls['correo2'].updateValueAndValidity();
      this.frm2.controls['telefono2'].updateValueAndValidity();
      this.frm2.controls['lada2'].updateValueAndValidity();
    }

    if (this.frm2.invalid || this.frm2.value.sexo2 == 0) {
      return;
    }
    this.frm2.getRawValue();
    this.spinner.show();
    if (this.personaId == 0) {
      arrSend.push({
        "tipoBeneficiarioId": this.tipobeneficiarioid,
        "nombre": this.frm2.controls.nombre2.value,
        "apellidoPaterno": this.frm2.controls.apaterno2.value,
        "apellidoMaterno": this.frm2.controls.amaterno2.value,
        "telefono": this.frm2.controls.telefono2.value,
        "email": this.frm2.controls.correo2.value,
        "fechaNacimiento": new Date(this.frm2.controls.fnacimiento2.value.getMonth() + 1 + '/' + this.frm2.controls.fnacimiento2.value.getDate()+ '/' + this.frm2.controls.fnacimiento2.value.getFullYear()),
        "sexo": this.frm2.controls.sexo2.value,
        "propuestaId": localStorage.getItem('propuestaId'),
        "paisId": this.frm2.controls.lada2.value ? this.frm2.controls.lada2.value.value : '',
        "beneficiarioId": this.beneficiarioId
      });
      console.log(JSON.stringify(arrSend[0]));
      this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.api.addUserBeneficiario(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
          if (data.personaFisica) {
            this.modalService.dismissAll();
            this.reloadCurrentRoute();
          }
        });
      });
    } else {

      arrSend.push({
        "tipoBeneficiarioId": this.tipobeneficiarioid,
        "nombre": this.frm2.controls.nombre2.value,
        "apellidoPaterno": this.frm2.controls.apaterno2.value,
        "apellidoMaterno": this.frm2.controls.amaterno2.value,
        "telefono": this.frm2.controls.telefono2.value,
        "email": this.frm2.controls.correo2.value,
        "fechaNacimiento": new Date(this.frm2.controls.fnacimiento2.value.getMonth() + 1 + '/' + this.frm2.controls.fnacimiento2.value.getDate()+ '/' + this.frm2.controls.fnacimiento2.value.getFullYear()),
        "sexo": this.frm2.controls.sexo2.value,
        "propuestaId": localStorage.getItem('propuestaId'),
        "paisId": this.frm2.controls.lada2.value ? this.frm2.controls.lada2.value.value : '',
        "personaId": this.personaId,
        "beneficiarioId": this.beneficiarioId
      });
      console.log(JSON.stringify(arrSend[0]));
      this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.api.updateUserBeneficiario(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
          if (data.personaFisica) {
            this.modalService.dismissAll();
            this.reloadCurrentRoute();
          }
        });
      });

    }

  }

  openModal(content, item) {
    this.personaId = 0;
    this.maxDateParejaPadres = new Date();
    this.minDateParejaPadres = new Date();
    console.log(item.beneficiarioId);
    this.miembroFamilia = item.tipoBeneficiario;
    this.beneficiarioId = item.beneficiarioId;
    this.tipobeneficiarioid = item.tipoBeneficiarioId;
    // item.personaId ? item.personaId : 0;
    this.personaId = item.personaId ? item.personaId : 0;
    let arrTemp = [];
    arrTemp = this.arrResumenAlaMedida.find(element => element.tipobeneficiarioid == this.tipobeneficiarioid);
    let ladaId = item.paisId ? item.paisId : localStorage.getItem("paisId") ? localStorage.getItem("paisId").toString() : 142;
    if (item.tipoBeneficiarioId == 15) {
      this.getEstadosEU(item.paisTrabajoId);
      this.ref.detectChanges();
      let sexo = 0;
      if (localStorage.getItem('sexo') == 'H' || localStorage.getItem('sexo') == 'h') {
        sexo = 46;
      } else {
        sexo = 45;
      }

      this.frm.patchValue(
        {
          'nombre': item.nombre ? item.nombre : '',
          'apaterno': item.apellidoPaterno ? item.apellidoPaterno : '',
          'amaterno': item.apellidoMaterno ? item.apellidoMaterno : '',
          'fnacimiento': item.fechaNacimiento ? new Date(item.fechaNacimiento.replace(/-/g, '\/').replace(/T.+/, '')) : new Date(localStorage.getItem('fechaNacimiento')),
          'sexo': item.sexoId ? item.sexoId : sexo,
          'telefono': item.telefono ? item.telefono : localStorage.getItem("telefono").toString(),
          'correo': item.correo ? item.correo : '' ,
          'estado': item.estadoOrigenId ? item.estadoOrigenId : '0',
          'estadoEU': item.estadoTrabajoId ? item.estadoTrabajoId : '0',
          'pais': item.paisTrabajoId ? item.paisTrabajoId : '0',
          'lada': ladaId,
        });

        this.selectedCountry = this.countries.find(pais => pais.value == ladaId);
        this.frm.controls['lada'].setValue(this.selectedCountry);
        if(arrTemp) {
          this.selectedCountry = this.countries.find(pais => pais.value == '142');
          this.frm.controls['lada'].setValue(this.selectedCountry);
          this.frm.get('lada').disable();
          // this.frm.get('telefono').disable();
          // this.frm.get('lada').patchValue(142);
        }
        this.ref.detectChanges();


    } else if (item.tipoBeneficiarioId == 16) {
      this.frmP.patchValue(
        {
          'nombreP': item.nombre ? item.nombre : '',
          'apaternoP': item.apellidoPaterno ? item.apellidoPaterno : '',
          'amaternoP': item.apellidoMaterno ? item.apellidoMaterno : '',
          'fnacimientoP': item.fechaNacimiento ? new Date(item.fechaNacimiento.replace(/-/g, '\/').replace(/T.+/, '')) : '',
          'sexoP': item.sexoId ? item.sexoId : '0',
          'telefonoP': item.telefono,
          'correoP': item.correo,
          'estadoP': item.estadoOrigenId ? item.estadoOrigenId : '0',
          'ladaP': ladaId,
        });

        this.selectedCountryPareja = this.countries.find(pais => pais.value == ladaId);
        this.frmP.controls['ladaP'].setValue(this.selectedCountryPareja);

        this.maxDateParejaPadres.setFullYear(this.maxDate.getFullYear() - 15);


        if(arrTemp) {
          this.selectedCountryPareja = this.countries.find(pais => pais.value == '142');
          this.frmP.controls['ladaP'].setValue(this.selectedCountryPareja);
          this.frmP.get('ladaP').disable();
        }

    } else if (item.tipoBeneficiarioId > 16) {
      this.frm2.patchValue(
        {
          'nombre2': item.nombre ? item.nombre : '',
          'apaterno2': item.apellidoPaterno ? item.apellidoPaterno : '',
          'amaterno2': item.apellidoMaterno ? item.apellidoMaterno : '',
          'fnacimiento2': item.fechaNacimiento ? new Date(item.fechaNacimiento.replace(/-/g, '\/').replace(/T.+/, '')) : '',
          'sexo2': item.sexoId ? item.sexoId : '0',
          'telefono2': item.telefono,
          'correo2': item.correo,
          'lada2': ladaId,
        });

        this.selectedCountryPadresHijos = this.countries.find(pais => pais.value == ladaId);
        this.frm2.controls['lada2'].setValue(this.selectedCountryPadresHijos);

        if (item.tipoBeneficiarioId == 17 || item.tipoBeneficiarioId == 18) {
          this.minDateParejaPadres.setFullYear(this.fechaCurp.getFullYear() - 150);
          this.maxDateParejaPadres.setFullYear(this.fechaCurp.getFullYear() - 14);
        } else {
          this.minDateParejaPadres.setFullYear(this.fechaCurp.getFullYear() + 14);
        }

        if(arrTemp) {
          this.selectedCountryPadresHijos = this.countries.find(pais => pais.value == '142');
        this.frm2.controls['lada2'].setValue(this.selectedCountryPadresHijos);
          this.frm2.get('lada2').disable();
        }
    }


    this.modalService.open(content, {
      size: "sm",
      centered: false,
      scrollable: true,
      backdrop: 'static',
      keyboard: false,
      animation: true,
    });

    this.ref.detectChanges();
    // this.reloadCurrentRoute();
  }

  changeStep(stepper) {

    stepper.next();
   this.index++;

  }

  contuniarAutorizacion() {
    this.api.loginapp().pipe(first()).subscribe((data: any) => {
      this.api.putStatus(this.api.currentTokenValue, this.propuestaid, 4).pipe(first()).subscribe((data: any) => {
        this.router.navigate(["./pages/autorizacion"]);
      });
    });
  }

  backStep(stepper) {
    stepper.previous();
    this.index--;
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], { relativeTo: this.route });
    // this.router.navigate([currentUrl]);
  }

  onChangeLadaTitular(ladaId) {
    this.selectedCountry = this.countries.find(pais => pais.value == ladaId.value.value);
    this.frm.controls['lada'].setValue(this.selectedCountry);
  }

  onChangeLadaPareja(ladaId) {
    this.selectedCountryPareja = this.countries.find(pais => pais.value == ladaId.value.value);
    this.frmP.controls['ladaP'].setValue(this.selectedCountryPareja);
  }

  onChangeLadaPaadresHijos(ladaId) {
    this.selectedCountryPadresHijos = this.countries.find(pais => pais.value == ladaId.value.value);
    this.frm2.controls['lada2'].setValue(this.selectedCountryPadresHijos);
  }

  curp2date(curp) {
    var miCurp = curp.toUpperCase();
    var m = miCurp.match(/^\w{4}(\w{2})(\w{2})(\w{2})/);
    var anyo = parseInt(m[1], 10) + 1900;
    if (anyo < 1950) anyo += 100;
    var mes = parseInt(m[2], 10) - 1;
    var dia = parseInt(m[3], 10);
    var fechaNacimiento = new Date(anyo, mes, dia);
    localStorage.setItem("fechaNacimiento", fechaNacimiento.toString());
    this.edad = this.calcularEdad(fechaNacimiento);
    localStorage.setItem("edad", this.edad.toString());
    return (new Date(anyo, mes, dia));

  }

  calcularEdad(fecha) {
    var hoy = new Date();
    var cumpleanos = new Date(fecha);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    return edad;
  }

  onlyNumbers(event) {
    const seperator  = '^([0-9])';
    const maskSeperator =  new RegExp(seperator , 'g');
    let result =maskSeperator.test(event.key);   return result;
  }

  onlyLetters(event) {
    const seperator  = "^[a-zA-Z' 'ñÑáéíóúÁÉÍÓÚ]*$";
    const maskSeperator =  new RegExp(seperator , 'g');
    let result =maskSeperator.test(event.key);   return result;
  }


  modifyValue(key, valor) {
        this.frmDatosProyecto.controls[key].patchValue(valor);
      }

      inputValidatorNumeros(event: any) {
        const pattern = /^[0-9]*$/;
        var validNum = new RegExp(pattern);
        var matchArray = event.target.value.match(validNum);
        if (matchArray == null) {
          event.target.value = event.target.value.replace(/[^0-9*$]/g, '');
          this.modifyValue(event.target.name, event.target.value);
          console.log(event.target.value);
        }
      }

      modifyValueN(key, valor, frm) {
        frm.controls[key].patchValue(valor);
      }


      inputValidatorLetrasN(event: any, frm) {
        const pattern = /^[a-zA-ZÀ-ÿ\s]*$/;
        if (!pattern.test(event.target.value)) {
          event.target.value = event.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
          this.modifyValueN(event.target.name, event.target.value, frm);
          console.log(event.target.value);
        }
        else {
          const pr = /^[\s]*$/
          if (pr.test(event.target.value)) {
            event.target.value = event.target.value.replace(/[^a-zA-ZÀ-ÿ]/g, '');
            this.modifyValueN(event.target.name, event.target.value, frm);
            console.log(event.target.value);
          }
        }
     }

}



