import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepperIntl, StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { ApiService } from '../../../shared/services/api.service'
import { ImgSrcDirective } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import curpV from 'curp';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { NgNavigatorShareService } from 'ng-navigator-share';

export enum PageNames {
  Curp,
  Repatriacion,
  Funerario,
  Vida,
  Educacion,
  Envio
}
interface Country {
  name: string,
  code: string,
  value: string
}

@Component({
  selector: 'app-beneficios-base',
  templateUrl: './beneficios-base.component.html',
  styleUrls: ['./beneficios-base.component.scss']
})
export class BeneficiosBaseComponent {

  s1Submitted = false;
  s2Submitted = false;
  displayModalResponsive: boolean;
  displayModalResponsivePropuesta: boolean = false;
  displayModalPdf: boolean = false;
  PageNames = PageNames;
  itemsSteps: MenuItem[];
  index = 0;
  stepIndex = PageNames.Curp;
  familia: any[];
  arrPropuesta = [];
  familiaFunerario: any[];
  familiaEducacion: any[];
  familiaEnvio: any[];
  countHijo = 3;
  indexHijo = 6;
  firstFormGroup: any;
  firstFormGroupCURP: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  checkedMenor: boolean = false;
  checkedMayor: boolean = false;
  beneficiarios = [];
  beneficios = [];
  arrBeneficios = [];
  arrSeleccionados = [15];
  envioDineroSelected = false;
  decodedToken = this.jwtHelper.decodeToken(this.api.currentTokenValue);
  completarContratacion = false;
  edad = 0;
  precioMensual = 0;
  precioMensualAlaMedida = 0;
  arrPlan = [];
  arrPlanAlaMedida = [];
  countRepatriacion = 1;
  serviciobeneficiarioid: any;
  tipoplanId = 0;
  descripcionPlan = '';
  precioAnual = 0;
  continuarContratacion = 0;
  hijo1Seleccionado = false;
  hijo2Seleccionado = false;
  hijo3Seleccionado = false;
  selectedCountry: Country;
  countries: { name: string; code: string; value: string, imgSrc: String }[];
  hijosSeleccionados = 0;
  frmDatosProyecto: FormGroup;
  private ngNavigatorShareService: NgNavigatorShareService;
  stepperOrientation: Observable<StepperOrientation>;
  sexo: any;

  public page = 2;

  public pageLabel!: string;
  stringSource: any;
  checkedAviso = false;

  constructor(
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private _matStepperIntl: MatStepperIntl,
    private ref: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private api: ApiService,
    public router: Router,
    public jwtHelper: JwtHelperService,
    private spinner: NgxSpinnerService,
    ngNavigatorShareService: NgNavigatorShareService
  ) {
    // pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    this.beneficiarios.push(15);
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({ matches }) => matches ? 'horizontal' : 'vertical'));
    this.api.loginapp().pipe(first()).subscribe((data: any) => { });
    if (localStorage.getItem('completarContratacion')) {
      this.completarContratacion = true;
      this.index = 1;
    }
    this.ngNavigatorShareService = ngNavigatorShareService;

    localStorage.removeItem('beneficiarios');
    localStorage.removeItem('beneficios');

    this.countries = [
      { name: '+1', code: 'ca', value: '40', imgSrc: "../../../../assets/img/flags/ca.svg" },
      { name: '+1', code: 'us', value: '70', imgSrc: "../../../../assets/img/flags/us.svg" },
      { name: '+52', code: 'mx', value: '142', imgSrc: "../../../../assets/img/flags/mx.svg" },
    ];

  }

  ngOnInit() {

    // let decodedToken = this.jwtHelper.decodeToken(this.api.currentTokenValue);
    // if (decodedToken.exp < new Date().getTime() / 1000) {
    //   console.log("EXPIRED");
    // } else {
    //   console.log("ACTIVE");
    // }



    this.firstFormGroup = this._formBuilder.group({
      curp: ['',
        [
          Validators.required,
          Validators.pattern("^([A-Z&]|[a-z&]{1})([AEIOUX]|[aeiou]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([0-9]{2})$"),
          Validators.minLength(18),
          Validators.maxLength(18),
        ],
      ],
      lada: ["0", Validators.required],
      telefono: ["", [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ],],
      chk: ['', Validators.required]
    });

    this.firstFormGroupCURP = this._formBuilder.group({
      curp: ['',
        [
          Validators.required,
          Validators.pattern("^([A-Z&]|[a-z&]{1})([AEIOUX]|[aeiou]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([0-9]{2})$"),
          Validators.minLength(18),
          Validators.maxLength(18),
        ],
      ],
      chk: ['', Validators.required]
    });

    this.itemsSteps = [
      { label: '' },
      { label: '' },
      { label: '' }
    ];

    this.arrPropuesta = [
      {
        "propuestaid": 3,
        "curp": "BEGO731126HDFLMS02",
        "estatuspropuesta": "Cuestionario",
        "clestatuspropuestaid": 1,
        "flag": 1,
        "beneficios": [
          {
            "beneficioid": 1,
            "titulobeneficio": "Repatriación a México",
            "subtitulobeneficio": "(Por fallecimiento en EU)",
            "descripcionbeneficio": "¿Quién de tu familia  podría requerir este beneficio?\r\nSeleciona a las personas que quieres incluir en el plan. Puedes incluir personas que viven en México.",

            "servicios": []
          },
          {
            "beneficioid": 2,
            "titulobeneficio": "Servicio Funerario",
            "subtitulobeneficio": "(Residentes de México)",
            "descripcionbeneficio": "¿Quién de tu familia podría requerir este beneficio?\r\nSeleciona a las personas que quieres incluir en el plan. Puedes incluir personas que viven en México.",

            "servicios": []
          },
          {
            "beneficioid": 4,
            "titulobeneficio": "Educación financiera",
            "subtitulobeneficio": "(Administración del dinero)",
            "descripcionbeneficio": "Este beneficio está incluido para todos los miembros.",

            "servicios": []
          },
          {
            "beneficioid": 5,
            "titulobeneficio": "Envío de dinero",
            "subtitulobeneficio": "(Cuenta digital en México)",
            "descripcionbeneficio": "¿Quién de tu familia recibe el dinero que envías de EUA?\r\nSeleciona a una persona para otorgarle este beneficio. Debe vivir en México.",

            "servicios": []
          },
          {
            "beneficioid": 3,
            "titulobeneficio": "Seguro de vida",
            "subtitulobeneficio": "(MX $50,000)",
            "descripcionbeneficio": "Incluido para el titula.\r\nEste beneficio está sujeto a elegibilidad.",
            "fechaalta": "2021-08-31T22:43:47.000+00:00",
            "fechamodificacion": "2021-08-31T22:43:47.000+00:00",

            "servicios": []
          }
        ],
        "cuestionario": [
          {
            "propuestaid": 3,
            "beneficiarioid": 4,
            "serviciobeneficiarioid": 6,
            "preguntaid": 1,
            "descripcionpregunta": "<p class\"\"> 1. ¿Estás embarazada?</p>",
            "respuestaid": 3,
            "respuesta": "si"
          },
          {
            "propuestaid": 3,
            "beneficiarioid": 4,
            "serviciobeneficiarioid": 6,
            "preguntaid": 2,
            "descripcionpregunta": "<p class=\"\">\n2. ¿Estás enfermo(a), estás buscando o recibiendo algún tratamiento médico, terapia o medicación? </p>",
            "respuestaid": 4,
            "respuesta": "no"
          }
        ]
      }
    ]

    this.arrBeneficios = this.arrPropuesta[0].beneficios.sort((a, b) => (a.beneficioid > b.beneficioid) ? 1 : ((b.beneficioid > a.beneficioid) ? -1 : 0))
    // console.log(this.arrBeneficios);

  }

  get s1() {
    return this.firstFormGroup.controls;
  }

  get s2() {
    return this.firstFormGroupCURP.controls;
  }

  getPropuesta(curp, token, stepper) {
    this.spinner.show();
    this.api.getPropuesta(curp, token).pipe(first()).subscribe((data: any) => {
      this.arrPropuesta = data
      console.log(data);

      // si la propuesta tiene un estatus activo, mando mensaje y direcciono a login

      if (data.clestatuspropuestaid == 6) {
        // this.displayModalResponsivePropuesta=true;

        Swal.fire({
          icon: "error",
          title: "Ya cuenta con un plan activo.",
          text: "Ingrese con su usuario y contraseña.",
          willClose: () => {
            this.router.navigate(["./pages/home"]);
          }
        });

      }

      if (data.propuestaid == 0) {
        // Nueva CURP
        if (this.continuarContratacion == 1) {
          this.spinner.hide();
          Swal.fire({
            icon: "error",
            title: "Lo sentimos",
            text: "No existe un proceso de contratación previo para esta CURP.",
            willClose: () => {
              this.router.navigate(["./pages/home"]);
            }
          });
        }

        // this.arrPropuesta['plan']['beneficios'].forEach((element, index) => {
        this.arrPropuesta['plan'].forEach((element1, index) => {
          element1['beneficios'].forEach((element, index2) => {
            if (element.beneficioid != 3) {
              element['beneficiosbeneficiarios'] = [];
              element['beneficiosbeneficiarios'].push(
                {
                  "imagenactivo": "Padre",
                  "imageninactivo": "Padre-Apagado",
                  "imagendefault": "Padre-Apagado",
                  "esseleccionado": false,
                  "tipobeneficiario": "Padre",
                  "tipobeneficiarioid": "17",
                  "activo": false
                },
                {
                  "imagenactivo": "Madre",
                  "imageninactivo": "Madre-Apagado",
                  "imagendefault": "Madre-Apagado",
                  "esseleccionado": false,
                  "tipobeneficiario": "Madre",
                  "tipobeneficiarioid": "18",
                  "activo": false
                },
                {
                  "imagenactivo": "Titular",
                  "imageninactivo": "Titular-Apagado",
                  "imagendefault": element.beneficioid == 5 ? "Titular-Apagado" : "Titular",
                  "esseleccionado": true,
                  "tipobeneficiario": "Titular",
                  "tipobeneficiarioid": "15",
                  "activo": false
                },
                {
                  "imagenactivo": "Pareja",
                  "imageninactivo": "Pareja-Apagado",
                  "imagendefault": "Pareja-Apagado",
                  "esseleccionado": false,
                  "tipobeneficiario": "Pareja",
                  "tipobeneficiarioid": "16",
                  "activo": false
                },
                {
                  "imagenactivo": "Hijo",
                  "imageninactivo": "Hijo-Apagado",
                  "imagendefault": "Hijo-Apagado",
                  "esseleccionado": false,
                  "tipobeneficiario": "Hijo",
                  "tipobeneficiarioid": "19",
                },
                {
                  "imagenactivo": "Hijo-2",
                  "imageninactivo": "Hijo-Apagado-2",
                  "imagendefault": "Hijo-Apagado-2",
                  "esseleccionado": false,
                  "tipobeneficiario": "Hijo",
                  "tipobeneficiarioid": "19",
                  "activo": false
                },
                {
                  "imagenactivo": "Hijo-3",
                  "imageninactivo": "Hijo-Apagado-3",
                  "imagendefault": "Hijo-Apagado-3",
                  "esseleccionado": false,
                  "tipobeneficiario": "Hijo",
                  "tipobeneficiarioid": "19",
                  "activo": false
                },
              );
            } else if (element.beneficioid == 3) {
              element['beneficiosbeneficiarios'] = [];
              this.arrPropuesta['plan'][index]['beneficios'][index2]['beneficiosbeneficiarios'].push(
                {
                  "imagenactivo": "Titular",
                  "imageninactivo": "Titular-Apagado",
                  "imagendefault": "Titular",
                  "esseleccionado": true,
                  "tipobeneficiario": "Titular",
                  "tipobeneficiarioid": "15",
                  "activo": false
                }
              );
            } else if (element.beneficioid == 5) {
              element['beneficiosbeneficiarios'] = [];
              this.arrPropuesta['plan'][index]['beneficios'][index2]['beneficiosbeneficiarios'].push(
                {
                  "imagenactivo": "Titular",
                  "imageninactivo": "Titular-Apagado",
                  "imagendefault": "Titular-Apagado",
                  "esseleccionado": false,
                  "tipobeneficiario": "Titular",
                  "tipobeneficiarioid": "15",
                  "activo": true
                }
              );
            }
            // Ordenar la propuesta inicial
            this.arrPropuesta['plan'][index]['beneficios'][index2]['beneficiosbeneficiarios']
              .sort((a, b) => (a.tipobeneficiarioid > b.tipobeneficiarioid) ? 1 : ((b.tipobeneficiarioid > a.tipobeneficiarioid) ? -1 : 0));
          });


        });

      } else {
        // Ya cuenta con un Plan registrado
        // this.arrPropuesta['plan']['beneficios'].forEach((element, index) => {

        this.arrPropuesta['plan'].forEach((element1, index) => {
          element1['beneficios'].forEach((element, index2) => {
            if (element.beneficioid == 1) {
              element.beneficiosbeneficiarios.forEach(bb => {
                bb.activo = false;
                if (bb.tipobeneficiarioid == 15) {
                  localStorage.setItem('servicioBeneficiarioId', bb.serviciobeneficiarioid);
                  this.serviciobeneficiarioid = bb.serviciobeneficiarioid
                }
              });
            }
            if (element.beneficiosbeneficiarios.length == 4 && element.beneficioid != 3) {
              // this.arrPropuesta['plan'][index]['beneficios'][index2]['beneficiosbeneficiarios'].push(
              //   {
              //     "imagenactivo": "Hijo",
              //     "imageninactivo": "Hijo-Apagado",
              //     "imagendefault": "Hijo-Apagado",
              //     "esseleccionado": false,
              //     "tipobeneficiario": "Hijo",
              //     "tipobeneficiarioid": "19",
              //     "activo": false
              //   },
              //   {
              //     "imagenactivo": "Hijo-2",
              //     "imageninactivo": "Hijo-Apagado-2",
              //     "imagendefault": "Hijo-Apagado-2",
              //     "esseleccionado": false,
              //     "tipobeneficiario": "Hijo",
              //     "tipobeneficiarioid": "19",
              //     "activo": false
              //   },
              //   {
              //     "imagenactivo": "Hijo-3",
              //     "imageninactivo": "Hijo-Apagado-3",
              //     "imagendefault": "Hijo-Apagado-3",
              //     "esseleccionado": false,
              //     "tipobeneficiario": "Hijo",
              //     "tipobeneficiarioid": "19",
              //     "activo": false
              //   },
              // );
            } else if (element.beneficiosbeneficiarios.length == 5 && element.beneficioid != 3) {
              // this.arrPropuesta['plan'][index]['beneficios'][index2]['beneficiosbeneficiarios'].push({
              //   "imagenactivo": "Hijo-2",
              //   "imageninactivo": "Hijo-Apagado-2",
              //   "imagendefault": "Hijo-Apagado-2",
              //   "esseleccionado": false,
              //   "tipobeneficiario": "Hijo",
              //   "tipobeneficiarioid": "19",
              //   "activo": false
              // },
              //   {
              //     "imagenactivo": "Hijo-3",
              //     "imageninactivo": "Hijo-Apagado-3",
              //     "imagendefault": "Hijo-Apagado-3",
              //     "esseleccionado": false,
              //     "tipobeneficiario": "Hijo",
              //     "tipobeneficiarioid": "19",
              //     "activo": false
              //   },
              // );
            } else if (element.beneficiosbeneficiarios.length == 6 && element.beneficioid != 3) {
              // this.arrPropuesta['plan'][index]['beneficios'][index2]['beneficiosbeneficiarios'].push({
              //   "imagenactivo": "Hijo-3",
              //   "imageninactivo": "Hijo-Apagado-3",
              //   "imagendefault": "Hijo-Apagado-3",
              //   "esseleccionado": false,
              //   "tipobeneficiario": "Hijo",
              //   "tipobeneficiarioid": "19",
              //   "activo": false
              // });
            }
            // Ordenar la propuesta inicial
            this.arrPropuesta['plan'][index]['beneficios'][index2]['beneficiosbeneficiarios']
              .sort((a, b) => (a.tipobeneficiarioid > b.tipobeneficiarioid) ? 1 : ((b.tipobeneficiarioid > a.tipobeneficiarioid) ? -1 : 0));
            // Autoselección del Titular en todos los beneficios
            if (element.beneficioid == 5) {
              let index1 = this.arrPropuesta['plan'][0]['beneficios'].findIndex(x => x.beneficioid == 2);
              console.log(element);
              let arrTemp = this.arrPropuesta['plan'][0]['beneficios'][index1]['beneficiosbeneficiarios'];
              console.log(arrTemp);
              element['beneficiosbeneficiarios'].forEach(bb => {
                let i = arrTemp.findIndex(x => x.imagenactivo == bb.imagenactivo);
                if (i != -1) {
                  bb.activo = arrTemp[i].esseleccionado;
                } else {
                  bb.activo = false;
                }

                // if (bb.tipobeneficiarioid == arrTemp.tipobeneficiarioid) {
                //   bb.activo = arrTemp.esseleccionado;
                // }

                // if (bb.tipobeneficiarioid == 15) {
                //   bb.esseleccionado = true;
                //   bb.imagendefault = bb.imagenactivo
                // } else {
                //   bb.esseleccionado = false;
                //   bb.imagendefault = bb.imageninactivo
                // }

              });
              console.log(this.arrPropuesta);
              localStorage.setItem('telefono', this.arrPropuesta['telefono'] ? this.arrPropuesta['telefono'] : '');
            }

            if (element.beneficioid == 3) {
              if (this.edad >= 50) {
                element['beneficiosbeneficiarios'].forEach(bb => {
                  bb.esseleccionado = false;
                  bb.imagendefault = bb.imageninactivo
                });
              }
            }
          });


        });

        // Termina Ya cuenta con un Plan registrado
      }
      // Guardo en storage los parámetros
      localStorage.setItem("flag", this.arrPropuesta['flag']);
      localStorage.setItem("propuestaId", this.arrPropuesta['propuestaid']);
      localStorage.setItem("curp", this.arrPropuesta['curp']);
      localStorage.setItem("cuestionario", JSON.stringify(this.arrPropuesta['cuestionario']));

      // Ordenar los beneficios
      this.arrPropuesta['plan'][0]['beneficios'].sort((a, b) => (a.beneficioid > b.beneficioid) ? 1 : ((b.beneficioid > a.beneficioid) ? -1 : 0));
      let arrTempBeneficios = [];

      if (this.arrPropuesta['plan'][1]) {
        this.arrBeneficios = arrTempBeneficios.concat(this.arrPropuesta['plan'][0]['beneficios'], this.arrPropuesta['plan'][1]['beneficios']);
      } else {
        this.arrBeneficios = this.arrPropuesta['plan'][0]['beneficios'];
      }

      console.log(this.arrBeneficios);
      this.getPlan(this.api.currentTokenValue);

      // Si continúa su proceso activo
      if (data.flag == 1) {
        this.beneficiariosSeleccionados();

        if (data.clestatuspropuestaid == 1 && this.edad < 50) {
          this.router.navigate(["./pages/formulario-eligibilidad"]);
        } else if (data.clestatuspropuestaid == 2 && this.edad < 50) {
          this.router.navigate(["./pages/propuesta"]);
        } else if (data.clestatuspropuestaid == 3) {
          this.router.navigate(["./pages/datos-formulario"]);
        } else if (data.clestatuspropuestaid == 4 || data.clestatuspropuestaid == 5) {
          this.router.navigate(["./pages/autorizacion"]);
        } else if (this.edad >= 50) {
          this.router.navigate(["./pages/propuesta"]);
        }

      }

      // Avanzar step
      stepper.next();
      this.index++;
      this.ref.detectChanges();
      this.spinner.hide();

    },
      (error) => {
        console.log(error);
      }
    );
  }

  getPlan(token) {
    this.api.getPlan(token).pipe(first()).subscribe((data: any) => {
      console.log(data);
      console.log(this.edad);
      let arrTemp = [];
      let edadPlan = 0;
      let arrPanAlaMedida = [];

      if (this.edad == 0) {
        var fechaCurp = this.curp2date(localStorage.getItem('curp').toUpperCase());
        localStorage.setItem("fechaNacimiento", fechaCurp.toString());
        var fechaActual = new Date();
        let yearsDiff = fechaActual.getFullYear() - fechaCurp.getFullYear();
        let monthDiif = fechaActual.getMonth() - fechaCurp.getMonth();

        if (monthDiif < 0 || (monthDiif === 0 && fechaActual.getDate() < fechaCurp.getDate())) {
          yearsDiff--;
        }

        localStorage.setItem("edad", yearsDiff.toString());
        this.edad = yearsDiff;
      }


      this.edad > 60 ? edadPlan = 60 : edadPlan = this.edad;

      this.arrPlan = data.filter(
        e => edadPlan >= e.edadMinima && edadPlan <= e.edadMaxima);
      console.log("Plan:", this.arrPlan);

      this.arrPlanAlaMedida = data.filter(
        e => e.tipoBeneficioId == 67);
      console.log("Plan A la medida:", this.arrPlanAlaMedida);


      if (this.arrPropuesta['plan']) {
        if (this.arrPropuesta['plan']['costo'] && this.arrPropuesta['plan']['tipoplanId']) {
          this.precioMensual = this.arrPropuesta['plan']['costo']
          this.tipoplanId = this.arrPropuesta['plan']['tipoplanId'];
        } else {
          this.precioMensual = this.arrPlan[0].precioMensual;
          this.precioAnual = this.arrPlan[0].precioAnual;
          this.tipoplanId = this.arrPlan[0].tipoplanId;
        }
      } else {
        this.precioMensual = this.arrPlan[0].precioMensual;
        this.precioAnual = this.arrPlan[0].precioAnual;
        this.tipoplanId = this.arrPlan[0].tipoplanId;
      }

      // if (this.arrPropuesta['plan']['tipoPlanId']) {
      //   this.precioMensual = this.arrPropuesta['plan']['costo']
      //   this.tipoplanId = this.arrPropuesta['plan']['tipoPlanId'];
      // } else {
      //   this.precioMensual = this.arrPlan[0].precioMensual;
      //   this.precioAnual = this.arrPlan[0].precioAnual;
      //   this.tipoplanId = this.arrPlan[0].tipoplanId;
      // }

      localStorage.setItem('precioAnual', this.precioAnual.toString());
      localStorage.setItem('precioMensual', this.precioMensual.toString());
      localStorage.setItem('tipoplanAlaMedidaId', this.arrPlanAlaMedida[0].tipoplanId);
      this.ref.detectChanges();

    });

    this.ref.detectChanges();
  }

  beneficiariosSeleccionados() {
    let arrB = []

    console.log("arrBeneficios: ", this.arrBeneficios);
    this.arrBeneficios.forEach(element => {
      arrB = []
      element['beneficiosbeneficiarios'].forEach(bb => {
        if (bb.esseleccionado) {
          arrB.push(
            bb.tipobeneficiarioid
          );
          this.beneficiarios.push(
            parseInt(bb.tipobeneficiarioid)
          );
        }
      });
      this.beneficios.push({
        "beneficioId": element.beneficioid,
        "beneficiarios": arrB

      });
    });

    console.log("beneficios: ", this.beneficios);
    this.beneficiarios = Array.from(new Set(this.beneficiarios));
    localStorage.setItem("beneficiarios", JSON.stringify(this.beneficiarios));
    localStorage.setItem("beneficios", JSON.stringify(this.beneficios));
  }

  showResponsiveDialog() {
    console.log('Modal');
    this.displayModalResponsive = true
  }

  changeStepInicial(stepper) {
    stepper.next();
    this.index++;
  }

  changeStepCurp(stepper, beneficio) {
    this.s1Submitted = true;
    if (this.firstFormGroup.invalid) {
      return;
    }
    this.continuarContratacion = 0;
    this.api.loginapp().pipe(first()).subscribe((data: any) => {
      this.getPropuesta(this.s1.curp.value, this.api.currentTokenValue, stepper);
      localStorage.setItem('telefono', this.s1.telefono.value);
      localStorage.setItem('paisId', this.s1.lada.value.value);
      // this.getPlan(this.api.currentTokenValue);
    });
  }

  changeStepCurpContinuar(stepper, beneficio) {
    this.s2Submitted = true;

    if (curpV.validar(this.s2.curp.value.toUpperCase())) {
      this.s2.curp.clearValidators();
      this.s2.curp.updateValueAndValidity();
    }

    if (this.firstFormGroupCURP.invalid) {
      return;
    }
    this.continuarContratacion = 1;
    this.api.loginapp().pipe(first()).subscribe((data: any) => {
      this.getPropuesta(this.s2.curp.value, this.api.currentTokenValue, stepper);
      this.validaCurpContinuar();
      // this.getPlan(this.api.currentTokenValue);
    });
  }

  backStep(stepper) {

    if (this.edad >= 50 && this.index == 5) {
      stepper.previous();
      stepper.previous();
      this.index--;
      this.index--;
    } else {
      stepper.previous();
      this.index--;
    }

  }

  changeStep(stepper, beneficio) {
    let arrB = [];
    let arrSend = [];
    let arrSendPropuesta = [];
    let arrSendPropuestaAlaMedida = [];
    let countHijos = 0;
    // console.log(this.arrBeneficios);
    let arr = this.arrBeneficios.filter(function (e) {
      return e.beneficioid == beneficio;
    });
    arr[0].beneficiosbeneficiarios.forEach(element => {

      if (beneficio == 5) {
        if (element.esseleccionado) {
          arrB.push(
            element.tipobeneficiarioid
          )
        }
      } else if (element.esseleccionado) {
        arrB.push(
          element.tipobeneficiarioid
        )
      } else if (element.tipobeneficiarioid == 15 && beneficio != 16) {
        arrB.push(
          element.tipobeneficiarioid
        )
      }


      // Si el beneficiario es hijo se toma el máximo para insertarlo en el arreglo
      if (element.tipobeneficiarioid == 19) {
        if (element.esseleccionado) {
          countHijos++;
          if (countHijos > this.hijosSeleccionados)
            this.hijosSeleccionados = countHijos;
          }
      }


      // Solo se agregan beneficiarios que no son hijos
      if (element.esseleccionado && element.tipobeneficiarioid != 19) {
        this.beneficiarios.push(parseInt(element.tipobeneficiarioid))
      }
    });

    console.log(arr);

    if (arr.length > 0) {
      this.beneficios = this.beneficios.filter(function (e) {
        return e.beneficioId != beneficio;
      });
      console.log(this.beneficios);
    }

    if (arrB.length > 0) {
      this.beneficios.push({
        "beneficioId": beneficio,
        "beneficiarios": arrB
      });
    }

    console.log(this.beneficios);

    if (this.index == this.arrBeneficios.length + 1) {
      this.spinner.show();
      this.beneficiarios = Array.from(new Set(this.beneficiarios));

    for(let i = 0; i < this.hijosSeleccionados; i++) {
      this.beneficiarios.push(parseInt('19'));
    }



      localStorage.setItem("beneficiarios", JSON.stringify(this.beneficiarios));
      localStorage.setItem("beneficios", JSON.stringify(this.beneficios));
      localStorage.setItem('tipoplanId', this.tipoplanId.toString());
      localStorage.setItem('precioAnual', this.precioAnual.toString());
      localStorage.setItem('precioMensual', this.precioMensual.toString());
      localStorage.setItem('descripcionPlan', this.descripcionPlan);
      localStorage.setItem('precioMensualAlaMedida', this.precioMensualAlaMedida.toString());

      if (this.edad >= 56) {
        // Guardo beneficios pmayor de 60 y direcciono a la propuesta

        if (parseInt(localStorage.getItem('propuestaId')) == 0) {
          arrSend.push({
            "curp": localStorage.getItem('curp'),
            "beneficiarios": JSON.parse(localStorage.getItem('beneficiarios')),
            "beneficios": JSON.parse(localStorage.getItem('beneficios')),
            "telefono": localStorage.getItem("telefono"),
            "paisId": localStorage.getItem("paisId"),

          })
        } else {
          arrSend.push({
            "propuestaId": localStorage.getItem('propuestaId'),
            "servicioBeneficiarioId": this.serviciobeneficiarioid,
            "curp": localStorage.getItem('curp'),
            "beneficiarios": JSON.parse(localStorage.getItem('beneficiarios')),
            "beneficios": JSON.parse(localStorage.getItem('beneficios')),
            "telefono": localStorage.getItem("telefono"),
            "paisId": localStorage.getItem("paisId"),



          })
        }

        console.log(JSON.stringify(arrSend[0]));

        this.api.loginapp().pipe(first()).subscribe((data: any) => {
          this.api.postCuestionario(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
            console.log(data);

            if (data.propuesta) {

              localStorage.setItem('tipoplanId', this.tipoplanId.toString());
              localStorage.setItem('precioAnual', this.precioAnual.toString());
              localStorage.setItem('precioMensual', this.precioMensual.toString());
              localStorage.setItem('propuestaId', data.propuesta['propuestaId']);
              localStorage.setItem('descripcionPlan', this.descripcionPlan);

              arrSendPropuesta.push({

                "propuestaId": data.propuesta['propuestaId'],
                "frecuenciaPagoId": 65, // Mensual
                "tipoPlanId": localStorage.getItem('tipoplanId'),
                "formaPagoId": 20, // Tarjeta
                "monto": localStorage.getItem('precioMensual'),
                "tipoBeneficioId": 66, // Base
                "tarjetaMX": false
              });

              arrSendPropuestaAlaMedida.push({
                "propuestaId": data.propuesta['propuestaId'],
                "frecuenciaPagoId": 65, // Mensual
                "tipoPlanId": localStorage.getItem('tipoplanAlaMedidaId'),
                "formaPagoId": 20, // Tarjeta
                "monto": localStorage.getItem('precioMensualAlaMedida'),
                "tipoBeneficioId": 67, // A la medida
                "tarjetaMX": false
              });

              console.log("Base", JSON.stringify(arrSendPropuesta[0]));
              console.log("Medida", JSON.stringify(arrSendPropuestaAlaMedida[0]));

              this.api.postAceptarPropuesta(JSON.stringify(arrSendPropuesta[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
                console.log(data);
                if (data.servicioContratadoId) {
                  this.api.postAceptarPropuesta(JSON.stringify(arrSendPropuestaAlaMedida[0]), this.api.currentTokenValue).pipe(first()).subscribe((data2: any) => {
                    console.log(data2);
                    if (data2.servicioContratadoId) {
                      this.spinner.hide();
                      this.router.navigate(["./pages/propuesta"]);
                    }
                  },
                  (error) => {
                    console.log(error);
                  }
                  );
                }
              },
              (error) => {
                console.log(error);
               }
              );

            }
          },
            (error) => {
              console.log(error);
             }
          );
        });

      } else {
        // console.log(this.tipoplanId);
        this.spinner.hide();
        this.router.navigate(["./pages/formulario-eligibilidad"]);
      }
    }
    // console.log(this.beneficios);
    if (this.edad >= 50 && this.index == 3) {
      stepper.next();
      stepper.next();
      this.index++;
      this.index++;
    } else {
      stepper.next();
      this.index++;
    }
  }

  checkOrdenHijos(indexBeneficios, i, beneficio, tipobeneficiarioid, imagenactivo, tipobeneficioid) {
    let imgActivo = this.arrBeneficios[indexBeneficios]['beneficiosbeneficiarios'][i].imagenactivo;
    let seleccionado = this.arrBeneficios[indexBeneficios]['beneficiosbeneficiarios'][i].esseleccionado;

    if (!seleccionado) {
      if (imgActivo == 'Hijo') {
        this.hijo1Seleccionado = !seleccionado;
        this.changeImg(indexBeneficios, i, beneficio, tipobeneficiarioid, imagenactivo);
        if (tipobeneficioid == 67) {
          this.precioMensualAlaMedida += 3;
        }
      } else if (imgActivo == 'Hijo-2') {
        if (this.hijo1Seleccionado == true) {
          this.hijo2Seleccionado = !seleccionado;
          this.changeImg(indexBeneficios, i, beneficio, tipobeneficiarioid, imagenactivo);
          if (tipobeneficioid == 67) {
            this.precioMensualAlaMedida += 3;
          }
        }
        else {
          this.openSnackBarHijoSaltado('Primero debes seleccionar al hijo 1');
          return;
        }
      } else if (imgActivo == 'Hijo-3') {
        if (this.hijo1Seleccionado == true && this.hijo2Seleccionado == true) {
          this.hijo3Seleccionado = !seleccionado;
          this.changeImg(indexBeneficios, i, beneficio, tipobeneficiarioid, imagenactivo);
          if (tipobeneficioid == 67) {
            this.precioMensualAlaMedida += 3;
          }
        }
        else {
          this.openSnackBarHijoSaltado('Debes seleccionar a los hijos 1 y 2');
          return;
        }
      }
    } else {
      if (imgActivo == 'Hijo-3') {
        this.hijo3Seleccionado = !seleccionado;
        this.changeImg(indexBeneficios, i, beneficio, tipobeneficiarioid, imagenactivo);
        if (tipobeneficioid == 67) {
          this.precioMensualAlaMedida -= 3;
        }
      } else if (imgActivo == 'Hijo-2') {
        if (this.hijo3Seleccionado == false) {
          this.hijo2Seleccionado = !seleccionado;
          this.changeImg(indexBeneficios, i, beneficio, tipobeneficiarioid, imagenactivo);
          if (tipobeneficioid == 67) {
            this.precioMensualAlaMedida -= 3;
          }
        } else {
          this.openSnackBarHijoSaltado('Primero debes desselecciona al hijo 3');
          return;
        }
      } else if (imgActivo == 'Hijo') {
        if (this.hijo3Seleccionado == false && this.hijo2Seleccionado == false) {
          this.hijo1Seleccionado = !seleccionado;
          this.changeImg(indexBeneficios, i, beneficio, tipobeneficiarioid, imagenactivo);
          if (tipobeneficioid == 67) {
            this.precioMensualAlaMedida -= 3;
          }
        }
        else {
          this.openSnackBarHijoSaltado('Debes desselecciona a los hijos 2 y 3');
          return;
        }
      }
    }
  }

  changeImg(indexBeneficios, i, beneficio, tipobeneficiarioid, imagenactivo) {
    let plan = [];
    this.arrSeleccionados.push(parseInt(tipobeneficiarioid));

    let seleccionado = this.arrBeneficios[indexBeneficios]['beneficiosbeneficiarios'][i].esseleccionado;
    let arr = this.arrBeneficios[indexBeneficios]['beneficiosbeneficiarios'][i];


    // // Cambio la imagen
    !seleccionado ? arr.imagendefault = arr.imagenactivo : arr.imagendefault = arr.imageninactivo;

    // // Cambio la bandera de selección
    !arr.esseleccionado ? arr.esseleccionado = true : arr.esseleccionado = false;


    // Preselecciono envío de dinero
    this.arrBeneficios[4]['beneficiosbeneficiarios'][i].esseleccionado = true;

    if (arr.esseleccionado) {
      this.filtrarPlanSeleccionado(beneficio);
    } else {
      this.filtrarPlanNoSeleccionado(beneficio);
    }


    if (beneficio == 5 || beneficio == 4) {
      // BeNeficio Envío de dinero
      if (tipobeneficiarioid == 19) {
        this.openSnackBarHijo();
      }
      this.envioDineroSelected = true;
      this.arrBeneficios.forEach(element => {
        element['beneficiosbeneficiarios'].forEach(bb => {
          if (element.beneficioid == 5) {
            if ((bb.imagenactivo != imagenactivo) && bb.esseleccionado) {
              bb.esseleccionado = false;
              bb.activo = true;
              bb.imagendefault = bb.imageninactivo;
            } else if (bb.imagenactivo == imagenactivo) {
              bb.esseleccionado = true;
              bb.activo = true;
              bb.imagendefault = bb.imagenactivo;
            }
          } else if (element.beneficioid == 16) {
            if ((bb.imagenactivo != imagenactivo) && bb.esseleccionado) {
              bb.esseleccionado = false;
              bb.activo = true;
              bb.imagendefault = bb.imageninactivo;
            } else if (bb.imagenactivo == imagenactivo) {
              bb.esseleccionado = false;
              bb.activo = true;
              bb.imagendefault = bb.imageninactivo;
            }
            // bb.esseleccionado = false;
            // bb.activo = true;
            // bb.imagendefault = bb.imageninactivo;
          }
        });

      });
      this.ref.detectChanges();
    } else {

      this.arrBeneficios.forEach(element => {
        if (element.beneficioid > beneficio && element.beneficioid != 3) {
          element['beneficiosbeneficiarios'].forEach(bb => {
            if (bb.imagenactivo == imagenactivo && bb.tipobeneficiarioid != 15
              && element.beneficioid != 2 && element.beneficioid != 4 && element.beneficioid != 5
              && element.beneficioid != 16) {

              if (!seleccionado) {
                bb.esseleccionado = false;
                bb.activo = true;
                // bb.imagendefault = bb.imageninactivo;
                bb.imagendefault = bb.imagenactivo;
                this.ref.detectChanges();
              } else {
                bb.esseleccionado = false;
                bb.activo = false;
                bb.imagendefault = bb.imageninactivo;
                this.ref.detectChanges();
              }
              // bb.esseleccionado = false;
              // bb.activo = true;
              // bb.esseleccionado ? bb.imagendefault = bb.imagenactivo : bb.imagendefault = bb.imageninactivo;
              // this.ref.detectChanges();
              // console.log(this.arrBeneficios);
            } else if (bb.imagenactivo == imagenactivo && element.beneficioid == 2) {
              if (!seleccionado) {
                bb.esseleccionado = true;
                bb.activo = true;
                bb.imagendefault = bb.imagenactivo;
                this.ref.detectChanges();
              } else {
                bb.esseleccionado = false;
                bb.activo = false;
                bb.imagendefault = bb.imageninactivo;
                this.ref.detectChanges();
              }

            } else if (bb.imagenactivo == imagenactivo && element.beneficioid == 4) {
              // Educación Financiera
              if (!seleccionado) {
                bb.esseleccionado = false;
                bb.activo = true;
                bb.imagendefault = bb.imageninactivo;
                this.ref.detectChanges();
              } else {
                bb.esseleccionado = false;
                bb.activo = false;
                bb.imagendefault = bb.imageninactivo;
                this.ref.detectChanges();
              }

            } else if (bb.imagenactivo == imagenactivo && element.beneficioid == 5) {
              // Cuenta Digital
              if (!seleccionado) {
                bb.esseleccionado = false;
                bb.activo = true;
                bb.imagendefault = bb.imageninactivo;
                this.ref.detectChanges();
              } else {
                bb.esseleccionado = false;
                bb.activo = false;
                bb.imagendefault = bb.imageninactivo;
                this.ref.detectChanges();
              }
            } else if (bb.imagenactivo == imagenactivo && element.beneficioid == 16) {
              // LLamadas ilimitadas
              if (!seleccionado) {
                bb.esseleccionado = false;
                bb.activo = true;
                bb.imagendefault = bb.imageninactivo;
                this.ref.detectChanges();
              } else {
                bb.esseleccionado = false;
                bb.activo = false;
                bb.imagendefault = bb.imageninactivo;
                this.ref.detectChanges();
              }
            }
          });
        }
      });
      this.ref.detectChanges();
      console.log(this.arrBeneficios);
    }
  }

  changeImgAlaMedida(indexBeneficios, i, beneficio, tipobeneficiarioid, imagenactivo) {
    let plan = [];
    this.arrSeleccionados.push(parseInt(tipobeneficiarioid));

    let seleccionado = this.arrBeneficios[indexBeneficios]['beneficiosbeneficiarios'][i].esseleccionado;
    let arr = this.arrBeneficios[indexBeneficios]['beneficiosbeneficiarios'][i];


    // // Cambio la imagen
    !seleccionado ? arr.imagendefault = arr.imagenactivo : arr.imagendefault = arr.imageninactivo;

    // // Cambio la bandera de selección
    !arr.esseleccionado ? arr.esseleccionado = true : arr.esseleccionado = false;

    if (arr.esseleccionado) {
      this.precioMensualAlaMedida += 3;
    } else {
      this.precioMensualAlaMedida -= 3;
    }

    this.arrBeneficios.forEach(element => {
      if (element.beneficioid > beneficio && element.beneficioid != 3 && element.beneficioid != 5) {
        element['beneficiosbeneficiarios'].forEach(bb => {
          if (bb.imagenactivo == imagenactivo && bb.tipobeneficiarioid != 15) {
            bb.esseleccionado = arr.esseleccionado;
            bb.esseleccionado ? bb.imagendefault = bb.imagenactivo : bb.imagendefault = bb.imageninactivo;
          }
        });
      }
    });
    this.ref.detectChanges();


  }

  filtrarPlanSeleccionado(beneficio) {
    if (beneficio == 1) {
      this.countRepatriacion++;
      if (this.edad < 56) {
        // Menores de 56
        // "Plan de Acceso para Titular menor de 56 años" Id: 1
        //"Plan de Acceso para Titular menor de 56 años (pareja y/o hijos) más de una persona requiere Repatriación" Id: 3
        //"Plan de Acceso para Titular menor de 56 años (con padres, pareja y/o hijos) más de una persona requiere Repatriación" Id: 5
        // Obtengo beneficio 1
        let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 1);
        // Busco si la pareja o hijos están seleccionados
        let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
        // Busco si los padres están seleccionados
        let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

        if (arrParejaHijo.length > 0 && arrPadres.length == 0) {
          this.seleccionarPlan(3);
        } else if (arrParejaHijo.length == 0 && arrPadres.length > 0) {
          this.seleccionarPlan(5);
        } else if (arrParejaHijo.length > 0 && arrPadres.length > 0) {
          this.seleccionarPlan(5);
        } else {
          this.seleccionarPlan(1);
        }
      } else {
        // Mayor de 56
        // "Plan de Acceso para Titular mayor de 56 años" Id: 2
        // "Plan de Acceso para Titular mayor de 56 años (con pareja y/o hijos) más de una persona requiere Repatriación" Id: 4
        // Obtengo beneficio 1
        let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 1);
        // Busco si la pareja o hijos están seleccionados
        let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
        // Busco si los padres están seleccionados

        if (arrParejaHijo.length > 0) {
          // Pareja e hijos seleccionados sin padres
          this.seleccionarPlan(4);
        } else {
          // Sólo titular
          this.seleccionarPlan(2);
        }
      }
      // Servicios funerarios
    } else if (beneficio == 2) {
      if (this.countRepatriacion == 1) {
        // Sólo titular en repatriación
        if (this.edad < 56) {
          // Menor de 56
          // "Plan de Acceso para Titular menor de 56 años (con padres, pareja y/o hijos en México) sólo el titular requiere Repatriación" Id: 8
          // "Plan de Acceso para Titular  menor de 56 años (con pareja y/o hijos en México) sólo titular requiere Repatriación" Id: 6
          // Obtengo beneficio 2
          let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
          // Busco si la pareja o hijos están seleccionados
          let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
          // Busco si los padres están seleccionados
          let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

          if (arrParejaHijo.length > 0 && arrPadres.length == 0) {
            this.seleccionarPlan(6);
          } else if (arrParejaHijo.length == 0 && arrPadres.length > 0) {
            this.seleccionarPlan(8);
          } else if (arrParejaHijo.length > 0 && arrPadres.length > 0) {
            this.seleccionarPlan(8);
          } else {
            this.seleccionarPlan(1);
          }
        } else {
          // Mayor de 56
          // "Plan de Acceso para Titular mayor de 56 años" Id: 2
          // "Plan de Acceso para Titular mayor de 56 años (con pareja y/o hijos en México) sólo titular requiere Repatriación" Id: 7
          // Obtengo beneficio 2
          let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
          // Busco si la pareja o hijos están seleccionados
          let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
          // Busco si los padres están seleccionados
          let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

          if (arrParejaHijo.length > 0) {
            // Pareja e hijos seleccionados sin padres
            let index = this.arrPlan.findIndex(x => x.tipoplanId == 7);
            this.seleccionarPlan(7);
          } else {
            // Sólo titular
            this.seleccionarPlan(2);
          }
        }
      } else {
        // Más de un miembro en repatriación.
        // "Plan de Acceso para Titular menor de 56 años" Id: 1
        //"Plan de Acceso para Titular menor de 56 años (pareja y/o hijos) más de una persona requiere Repatriación" Id: 3
        //"Plan de Acceso para Titular menor de 56 años (con padres, pareja y/o hijos) más de una persona requiere Repatriación" Id: 5
        if (this.edad < 56) {
          // Menor de 56
          // Obtengo beneficio 2
          let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
          // Busco si la pareja o hijos están seleccionados
          let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
          // Busco si los padres están seleccionados
          let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

          if (arrParejaHijo.length > 0 && arrPadres.length == 0) {
            this.seleccionarPlan(3);
          } else if (arrParejaHijo.length == 0 && arrPadres.length > 0) {
            this.seleccionarPlan(5);
          } else if (arrParejaHijo.length > 0 && arrPadres.length > 0) {
            this.seleccionarPlan(5);
          } else {
            this.seleccionarPlan(1);
          }
        } else {
          // Mayor de 56.
          // "Plan de Acceso para Titular mayor de 56 años" Id: 2
          // "Plan de Acceso para Titular mayor de 56 años (con pareja y/o hijos) más de una persona requiere Repatriación" Id: 4
          // Obtengo beneficio 2
          let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
          // Busco si la pareja o hijos están seleccionados
          let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
          // Busco si los padres están seleccionados
          let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

          if (arrParejaHijo.length > 0) {
            // Pareja e hijos seleccionados sin padres
            this.seleccionarPlan(4);
          } else {
            // Sólo titular
            this.seleccionarPlan(2);
          }
        }
      }
    }
  }

  filtrarPlanNoSeleccionado(beneficio) {
    // Repatriación
    if (beneficio == 1) {
      this.countRepatriacion--;
      if (this.edad < 56) {
        // Menores de 56
        // "Plan de Acceso para Titular menor de 56 años" Id: 1
        // "Plan de Acceso para Titular menor de 56 años (pareja y/o hijos) más de una persona requiere Repatriación" Id: 3
        // "Plan de Acceso para Titular menor de 56 años (con padres, pareja y/o hijos) más de una persona requiere Repatriación" Id: 5
        let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 1);

        let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));

        let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

        if (arrParejaHijo.length > 0 && arrPadres.length == 0) {
          // Pareja y/o hijos
          this.seleccionarPlan(3);
        } else if (arrParejaHijo.length == 0 && arrPadres.length > 0) {
          // Padres
          this.seleccionarPlan(5);
        } else if (arrParejaHijo.length > 0 && arrPadres.length > 0) {
          // Parej, Hijos y/o padres
          this.seleccionarPlan(5);
        } else {
          // Titular
          this.seleccionarPlan(1);
        }
      } else {
        // Mayor de 56
        // "Plan de Acceso para Titular mayor de 56 años" Id: 2
        // "Plan de Acceso para Titular mayor de 56 años (con pareja y/o hijos) más de una persona requiere Repatriación" Id: 4
        // Obtengo beneficio 1
        let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 1);
        // Busco si la pareja o hijos están seleccionados
        let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
        // Busco si los padres están seleccionados

        if (arrParejaHijo.length > 0) {
          // Pareja e hijos seleccionados sin padres
          this.seleccionarPlan(4);
        } else {
          // Sólo titular
          this.seleccionarPlan(2);
        }
      }
      // Servicios funerarios
    } else if (beneficio == 2) {
      if (this.countRepatriacion == 1) {
        // Sólo titular en repatriación
        if (this.edad < 56) {
          // Menor de 56
          // "Plan de Acceso para Titular menor de 56 años (con padres, pareja y/o hijos en México) sólo el titular requiere Repatriación" Id: 8
          // "Plan de Acceso para Titular  menor de 56 años (con pareja y/o hijos en México) sólo titular requiere Repatriación" Id: 6
          // Obtengo beneficio 2
          let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
          // Busco si la pareja o hijos están seleccionados
          let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
          // Busco si los padres están seleccionados
          let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

          if (arrParejaHijo.length > 0 && arrPadres.length == 0) {
            this.seleccionarPlan(6);
          } else if (arrParejaHijo.length == 0 && arrPadres.length > 0) {
            this.seleccionarPlan(8);
          } else if (arrParejaHijo.length > 0 && arrPadres.length > 0) {
            this.seleccionarPlan(8);
          } else {
            this.seleccionarPlan(1);
          }
        } else {
          // Mayor de 56
          // "Plan de Acceso para Titular mayor de 56 años" Id: 2
          // "Plan de Acceso para Titular mayor de 56 años (con pareja y/o hijos en México) sólo titular requiere Repatriación" Id: 7
          // Obtengo beneficio 2
          let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
          // Busco si la pareja o hijos están seleccionados
          let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
          // Busco si los padres están seleccionados
          let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

          if (arrParejaHijo.length > 0) {
            // Pareja e hijos seleccionados sin padres
            this.seleccionarPlan(7);
          } else {
            // Sólo titular
            this.seleccionarPlan(2);
          }
        }
      } else {
        // Más de un miembro en repatriación.
        // "Plan de Acceso para Titular menor de 56 años" Id: 1
        //"Plan de Acceso para Titular menor de 56 años (pareja y/o hijos) más de una persona requiere Repatriación" Id: 3
        //"Plan de Acceso para Titular menor de 56 años (con padres, pareja y/o hijos) más de una persona requiere Repatriación" Id: 5
        if (this.edad < 56) {
          // Menor de 56
          // Obtengo beneficio 2
          let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
          // Busco si la pareja o hijos están seleccionados
          let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
          // Busco si los padres están seleccionados
          let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

          if (arrParejaHijo.length > 0 && arrPadres.length == 0) {
            this.seleccionarPlan(3);
          } else if (arrParejaHijo.length == 0 && arrPadres.length > 0) {
            this.seleccionarPlan(5);
          } else if (arrParejaHijo.length > 0 && arrPadres.length > 0) {
            this.seleccionarPlan(5);
          } else {
            this.seleccionarPlan(1);
          }
        } else {
          // Mayor de 56.
          // "Plan de Acceso para Titular mayor de 56 años" Id: 2
          // "Plan de Acceso para Titular mayor de 56 años (con pareja y/o hijos) más de una persona requiere Repatriación" Id: 4
          // Obtengo beneficio 2
          let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
          // Busco si la pareja o hijos están seleccionados
          let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
          // Busco si los padres están seleccionados
          let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

          if (arrParejaHijo.length > 0) {
            // Pareja e hijos seleccionados sin padres
            this.seleccionarPlan(4);
          } else {
            // Sólo titular
            this.seleccionarPlan(2);
          }
        }
      }
    }
  }

  seleccionarPlan(tipoPlanId) {
    let index = this.arrPlan.findIndex(x => x.tipoplanId == tipoPlanId);
    this.precioMensual = this.arrPlan[index].precioMensual;
    this.precioAnual = this.arrPlan[index].precioAnual;
    this.tipoplanId = this.arrPlan[index].tipoplanId;
    this.descripcionPlan = this.arrPlan[index].descripcionPlan;
    this.ref.detectChanges();
  }

  checkSeleccionados(tipobeneficiarioid) {
    console.log(tipobeneficiarioid);
    if (this.arrSeleccionados.indexOf(tipobeneficiarioid) == -1) {
      return false;
    } else {
      return true;
    }
  }

  agregarHijos(beneficio) {
    this.countHijo++;
    this.indexHijo++;
    this.hijo1Seleccionado = true;
    this.hijo2Seleccionado = true;
    this.hijo3Seleccionado = true;

    this.arrBeneficios.forEach(element => {
      if ((element.beneficioid == beneficio) && element.beneficioid != 3 && element.beneficioid != 5) {
        element['beneficiosbeneficiarios'].forEach(bb => {
          if (bb.tipobeneficiarioid == 19) {
            bb.esseleccionado = true;
            bb.imagendefault = bb.imagenactivo;
          }
        });
        element['beneficiosbeneficiarios'].push(
          {
            "imagenactivo": "Hijo-1",
            "imageninactivo": "Hijo-Apagado-1",
            "imagendefault": "Hijo-1",
            "esseleccionado": true,
            "tipobeneficiario": "Hijo",
            "tipobeneficiarioid": "19",
            "agregado": true
          });
      } else if (element.beneficioid > beneficio && element.beneficioid != 3 && element.beneficioid != 5) {
        element['beneficiosbeneficiarios'].forEach(bb => {
          if (bb.tipobeneficiarioid == 19) {
            bb.esseleccionado = true;
            bb.imagendefault = bb.imagenactivo;
          }
        });
        element['beneficiosbeneficiarios'].push(
          {
            "imagenactivo": "Hijo-1",
            "imageninactivo": "Hijo-Apagado-1",
            "imagendefault": "Hijo-1",
            "esseleccionado": true,
            "tipobeneficiario": "Hijo",
            "tipobeneficiarioid": "19",
            "agregado": true
          });
      }
      this.ref.detectChanges();
    });
    this.filtrarPlanSeleccionado(beneficio);

  }

  plus(beneficio) {
    this.agregarHijos(beneficio);
  }
  minus(beneficio) {
    if (this.countHijo != 0) {
      this.countHijo--;
      this.arrBeneficios.forEach(element => {
        if ((element.beneficioid == beneficio) && element.beneficioid != 3 && element.beneficioid != 5) {
          element['beneficiosbeneficiarios'].forEach((bb, i) => {
            if (bb.tipobeneficiarioid == 19 && bb.agregado) {
              element['beneficiosbeneficiarios'].splice(i, 1);
            }
          });
        } else if ((element.beneficioid > beneficio) && element.beneficioid != 3 && element.beneficioid != 5) {
          element['beneficiosbeneficiarios'].forEach((bb, i) => {
            if (bb.tipobeneficiarioid == 19 && bb.agregado) {
              element['beneficiosbeneficiarios'].splice(i, 1);
            }
          });
        }
      });
    }

    if (this.countHijo == 3) {
      this.filtrarPlanNoSeleccionado(beneficio);
    }
  }



  inputCurp(chkMayor, chkMenor) {
    this.checkedMenor = false;
    this.checkedMayor = false;
    chkMayor.checked = false;
    chkMenor.checked = false;
  }

  curpValida(curp) {
    var re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
      validado = curp.match(re);

    if (!validado)  //Coincide con el formato general?
      return false;

    //Validar que coincida el dígito verificador
    function digitoVerificador(curp17) {
      //Fuente https://consultas.curp.gob.mx/CurpSP/
      var diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
        lngSuma = 0.0,
        lngDigito = 0.0;
      for (var i = 0; i < 17; i++)
        lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
      lngDigito = 10 - lngSuma % 10;
      if (lngDigito == 10) return 0;
      return lngDigito;
    }

    if (validado[2] != digitoVerificador(validado[1]))
      return false;

    return true; //Validado
  }

  // curp2date(curp) {
  //   console.log(curp);
  //   var m = curp.match(/^\w{4}(\w{2})(\w{2})(\w{2})/);
  //   //miFecha = new Date(año,mes,dia)
  //   var anyo = parseInt(m[1], 10) + 1900;
  //   // if (anyo < 1950) anyo += 100;
  //   var mes = parseInt(m[2], 10) - 1;
  //   var dia = parseInt(m[3], 10);
  //   return (new Date(anyo, mes, dia));
  // }

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

  validaCurp(edad, e: MatSlideToggleChange, chk) {
    this.s1Submitted = true;

    if (curpV.validar(this.s1.curp.value.toUpperCase())) {
      this.s1.curp.clearValidators();
      this.s1.curp.updateValueAndValidity();
    }

    if (this.s1.curp.invalid && !curpV.validar(this.s1.curp.value.toUpperCase())) {
      e.source.checked = false;
      this.checkedMenor = false;
      return;
    }

    let fecha = this.s1.curp.value.slice(4, 10);
    let anio = this.s1.curp.value.slice(4, 6);
    let mes = this.s1.curp.value.slice(6, 8);
    let dia = this.s1.curp.value.slice(8, 10);

    var fechaCurp = this.curp2date(this.s1.curp.value.toUpperCase());

    // localStorage.setItem("fechaNacimiento", fechaCurp.toString());

    var fechaActual = new Date();

    let yearsDiff = fechaActual.getFullYear() - fechaCurp.getFullYear();
    let monthDiif = fechaActual.getMonth() - fechaCurp.getMonth();

    if (monthDiif < 0 || (monthDiif === 0 && fechaActual.getDate() < fechaCurp.getDate())) {
      yearsDiff--;
    }

    // localStorage.setItem("edad", yearsDiff.toString());
    // this.edad = yearsDiff;

    this.sexo = this.s1.curp.value.slice(10, 11);
    localStorage.setItem("sexo", this.sexo);

    if (edad == 'Menor' && yearsDiff >= 56) {
      e.source.checked = false;
      this.checkedMenor = false;
      this.checkedMayor = false;
      chk.checked = false;
      this.openSnackBar();
    } else if (edad == 'Menor') {
      chk.checked = false;
      this.checkedMenor = true;
      this.checkedMayor = false;
    } else if (edad == 'Mayor' && yearsDiff < 56) {
      e.source.checked = false;
      this.checkedMenor = false;
      this.checkedMayor = false;
      chk.checked = false;
      this.openSnackBar();
    } else if (edad == 'Mayor') {
      chk.checked = false;
      this.checkedMenor = false;
      this.checkedMayor = true;
    }

  }

  validaCurpContinuar() {
    this.s2Submitted = true;
    console.log("CURP");
    if (curpV.validar(this.s2.curp.value.toUpperCase())) {
      this.s2.curp.clearValidators();
      this.s2.curp.updateValueAndValidity();
    }

    if (this.s2.curp.invalid && !curpV.validar(this.s2.curp.value.toUpperCase())) {
      return;
    }

    let fecha = this.s2.curp.value.slice(4, 10);
    let anio = this.s2.curp.value.slice(4, 6);
    let mes = this.s2.curp.value.slice(6, 8);
    let dia = this.s2.curp.value.slice(8, 10);

    var fechaCurp = this.curp2date(this.s2.curp.value.toUpperCase());

    // localStorage.setItem("fechaNacimiento", fechaCurp.toString());

    var fechaActual = new Date();

    let yearsDiff = fechaActual.getFullYear() - fechaCurp.getFullYear();
    let monthDiif = fechaActual.getMonth() - fechaCurp.getMonth();

    if (monthDiif < 0 || (monthDiif === 0 && fechaActual.getDate() < fechaCurp.getDate())) {
      yearsDiff--;
    }

    // localStorage.setItem("edad", yearsDiff.toString());
    // this.edad = yearsDiff;


    this.sexo = this.s2.curp.value.slice(10, 11);
    localStorage.setItem("sexo", this.sexo);

  }

  tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    console.log(expiry);
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  openSnackBar() {
    this._snackBar.open('La opción seleccionada no corresponde a tu edad.', 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2 * 1000
    });
  }

  openSnackBarHijo() {
    this._snackBar.open('El beneficiario debe ser mayor de 18 años.', 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2 * 1000
    });
  }

  openSnackBarHijoSaltado(msj) {
    this._snackBar.open(msj, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2 * 1000
    });
  }

  redirect() {
    this.router.navigate(["./pages/home"]);
  }

  onChangeLada(ladaId) {
    this.selectedCountry = this.countries.find(pais => pais.value === ladaId.value.value);
    this.firstFormGroup.controls['lada'].setValue(this.selectedCountry);
  }

  openModal(opcion:string): void {

    //console.log(chk);
    /*
    if (chk) {
      this.checkedAviso == true;
    } else {
      this.checkedAviso == false;
    }*/

    if(opcion == 'a'){
      this.stringSource = "./assets/pdf/MLC_TCs_Red_V.pdf";
    }else{
      this.stringSource = "./assets/pdf/MLC_Aviso%20de%20Privacidad_Portal%20MLC%20(Etapa_1)_%20Red_I.pdf";
    }

    /*setTimeout(function(){
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

      async shareApi() {

        // if (!this.ngNavigatorShareService.canShare()) {
        //   Swal.fire({
        //     icon: "error",
        //     title: "Lo sentimos.",
        //     text: "Este servicio sólo está disponible para dispositivos móviles.",
        //   });
        //   return;
        // }

        try{
          const sharedResponse = await this.ngNavigatorShareService.share({
            title:'`México Lindo Contigo',
            text: 'Somos la central digital de soluciones para proteger el sustento y la salud de tu familia en México.',
            url: 'https://app.mexicolindocontigo.com'
          });
          console.log(sharedResponse);
        } catch(error) {
          console.log('You app is not shared, reason: ', error);
          Swal.fire({
                icon: "error",
                title: "Lo sentimos.",
                text: "Este servicio sólo está disponible para dispositivos móviles.",
              });
        }

      }

      share() {

        // const navigator = window.navigator as any;

        // if (navigator.share) {
        //   navigator
        //     .share({
        //       title:'`México Lindo Contigo',
        //       text: 'Somos la central digital de soluciones para proteger el sustento y la salud de tu familia en México.',
        //       url: 'https://app.mexicolindocontigo.com'
        //     })
        //     .then(() => console.log('Successful share'))
        //     .catch(error => console.log('Error sharing', error));
        // } else {
        //   Swal.fire({
        //     icon: "error",
        //     title: "Lo sentimos",
        //     text: "Este servicio sólo está disponible para dispositivos móviles",
        //   });
        // }

        if (!this.ngNavigatorShareService.canShare()) {
          Swal.fire({
            icon: "error",
            title: "Lo sentimos.",
            text: "Este servicio sólo está disponible para dispositivos móviles.",
          });
          return;
        }

        this.ngNavigatorShareService.share({
          title:'`México Lindo Contigo',
          text: 'Somos la central digital de soluciones para proteger el sustento y la salud de tu familia en México.',
          url: 'https://app.mexicolindocontigo.com'
        }).then( (response) => {
          console.log(response);
        })
        .catch( (error) => {
          console.log(error);
        });
      }
}
