import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { ApiService } from 'app/shared/services/api.service';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from '@angular/router';
import Swal from "sweetalert2";

@Component({
  selector: 'app-autorizacion',
  templateUrl: './autorizacion.component.html',
  styleUrls: ['./autorizacion.component.scss']
})
export class AutorizacionComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  curp = '';
  paymentHandler:any = null;
  paymentIntent = [];
  clavePlan = '';
  costo = 0;
  total = 0;
  totalAnual = 0;
  descripcionPlan = '';
  plan = [];
  arrPlan = [];
  autorizacion = ''
  displayModalResponsive = false;
  fechaInicioVigencia = '';
  fechaFinVigencia = '';
  estatusPropuesta = 0;
  tituloMensaje = '';
  descripcionMensaje = '';
  showMsg = false;
  msg = '';
  frecuenciaPago = '';
  currency = 'USD';
  gastoAdmonUid = '';

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  stripeTest: FormGroup;
  numTransaccion: any;
  membresia: any;
  gastos: any;
  fechaContratacion: any;
  periodoPago: any;

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private api: ApiService,
    private ref: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public router: Router,
    private route: ActivatedRoute,
    ) {
      this.curp = localStorage.getItem('curp');
      this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.getPropuesta();
      });
    }

  ngOnInit(): void {
    this.invokeStripe();
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
  }


  getPropuesta() {
    this.api.getPropuesta(localStorage.getItem('curp'), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
      this.plan = data;
      this.arrPlan = this.plan['plan'];
      this.estatusPropuesta = data['clestatuspropuestaid'];
      this.frecuenciaPago = this.plan['plan'][0]['frecuenciaPago'];
      console.log(this.arrPlan);

      if (this.plan['plan'][0]['tarjetaMX']) {
        this.total = this.plan['plan'][0]['precioGastoAdmonMX'];
        this.totalAnual = parseInt(this.plan['plan'][0]['precioGastoAdmonMX']) + parseInt(this.plan['plan'][0]['mensualMX']);
        this.gastos = this.plan['plan'][0]['precioGastoAdmonMX'];
      } else {
        this.total = this.plan['plan'][0]['precioGastoAdmon'];
        this.totalAnual = parseInt(this.plan['plan'][0]['precioGastoAdmon']) + parseInt(this.plan['plan'][0]['mensual']);
        this.gastos = this.plan['plan'][0]['precioGastoAdmon'];
      }

      this.gastoAdmonUid = this.plan['plan'][0]['gastoAdmonUid'];
      this.currency = this.plan['plan'][0]['moneda'] ? this.plan['plan'][0]['moneda'] : 'USD';

      // this.displayModalResponsive=true;

      this.arrPlan.forEach(element => {
        this.total += element.total;
      });

      this.ref.detectChanges();
    },
      error => console.log('oops', error)
    );
  }

  createToken(): void {
    this.paymentIntent = [];
    const name = this.stripeTest.get('name').value;
    this.spinner.show();
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          result.token['paymentIntent'] = {
            "gastoAdmonUid": this.gastoAdmonUid,
            "monto": this.total,
            "moneda": this.currency,
            "transaccion": "",
            "estatustransaccion": ""
          };

          result.token['propuestaid'] = this.plan['propuestaid'];
          result.token['curp'] = this.plan['curp'];

          // Use the token

          console.log(JSON.stringify(result.token));


          this.api.loginapp().pipe(first()).subscribe((data: any) => {
            this.api.postIntentarPagar(JSON.stringify(result.token), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
              console.log(data);
              this.showMsg = false;
              this.spinner.hide();
              if (data.estatustransaccion == "Activo") {
                this.displayModalResponsive=true;
                this.numTransaccion = data.transaccion;
                this.membresia = data.membresia;
                this.fechaInicioVigencia = data.fechaInicioVigencia;
                this.fechaFinVigencia = data.fechaFinVigencia;
                this.fechaContratacion = data.fechaContratacion;
                this.periodoPago = data.periodoPago;
                this.tituloMensaje = data.tituloMensaje;
                this.descripcionMensaje = data.descripcionMensaje;
              } else {
                Swal.fire({
                  icon: "error",
                  title: "No se pudo procesar tu pago.",
                  text: data.traza,
                });
              }
              this.ref.detectChanges();
            },
            error => {
              console.log('Error Pago:', error);
              this.spinner.hide();
              Swal.fire({
                icon: "error",
                title: "No se pudo procesar tu pago.",
                text: error['error']['message'],
              });
            }
            );
          },
          error => console.log('oops', error)
          );

        } else if (result.error) {
          // Error creating the token
          this.spinner.hide();
          console.log(result.error.message);
        }
      });
  }

  redirect () {
    this.router.navigate(["./pages/home"]);
  }

  makePayment(amount) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51JZMBDLm93TetmkamLaX6DbO9PrSOY7zTlNJB2hLfXQLCwBWZMcH9LuCW0ZG6ZYURPVWWzGxyeD9JO9Q5zAruFmf00QuPJRxUr',
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log(stripeToken)
        alert('Stripe token generated!');
      }
    });

    paymentHandler.open({
      name: 'Positronx',
      description: '3 widgets',
      amount: amount * 100
    });
  }

  invokeStripe() {
    if(!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement("script");
      script.id = "stripe-script";
      script.type = "text/javascript";
      script.src = "https://checkout.stripe.com/checkout.js";
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51JZMBDLm93TetmkamLaX6DbO9PrSOY7zTlNJB2hLfXQLCwBWZMcH9LuCW0ZG6ZYURPVWWzGxyeD9JO9Q5zAruFmf00QuPJRxUr',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken)
            alert('Payment has been successfull!');
          }
        });
      }

      window.document.body.appendChild(script);
    }
  }

  verificar() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], { relativeTo: this.route });
  }

}
