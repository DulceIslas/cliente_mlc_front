import { JwtHelperService } from '@auth0/angular-jwt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'app/shared/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/shared/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loginFormSubmitted = false;
  isLoginFailed = false;
  returnUrl: any;
  submittedRecovery = false;

  frmRecover = new FormGroup({
    curp: new FormControl('', [
      Validators.required,
          Validators.pattern("^([A-Z&]|[a-z&]{1})([AEIOUX]|[aeiou]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([0-9]{2})$"),
          Validators.minLength(18),
          Validators.maxLength(18),
    ]),
  });

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(true)
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    private api: ApiService,
    public jwtHelper: JwtHelperService,
    ) {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    localStorage.removeItem('completarContratacion');
   }

   get lf() {
    return this.loginForm.controls;
  }

  get f() {
    return this.frmRecover.controls;
  }

  ngOnInit(): void {
  }

  completarContratacion() {
    localStorage.setItem('completarContratacion', 'true');
    this.router.navigate(["./pages/beneficios-base"]);
  }

  onSubmit() {
    this.loginFormSubmitted = true;
    this.isLoginFailed = false;
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show(undefined,
      {
        type: 'ball-triangle-path',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fullScreen: true
      });

    this.authService
    .signinUser(this.loginForm.value.username, this.loginForm.value.password)
    .pipe(first())
    .subscribe(
      (data) => {
        if (!data.error) {
          let resp = this.jwtHelper.decodeToken(localStorage.getItem("tokenApp").toString())
          console.log(resp);
          // let rol = resp['roles'].find(x=>x.id == 44);
          if (resp['roles']) {
            let rol = resp['roles'].find(x=>x.id == 44);
            if (rol) {
              this.router.navigate(['../../../page/']);
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Tu rol no tiene los privilegios para ingresar.",
              });
              this.spinner.hide();
            }
          } else {
            this.router.navigate(['../../../page/']);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.mensaje,
          });
          this.spinner.hide();
        }
      },
      (error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          // text: error['error'].message,
          text: "Usuario y/o la contraseña incorrectos",
        });
        this.isLoginFailed = true;
        this.loginFormSubmitted = false;
        this.ref.detectChanges();
        console.log("Error");
      }
    );
  }

  openModalRecover(content, visible) {
    this.modalService.open(content, {
      size: "lg",
      centered: true,
      scrollable: true,
      animation: true,
      backdrop: true,
    });
    }

    enviarCorreo(){
      this.submittedRecovery = true;
      if (this.frmRecover.invalid) {
        return;
      }
      this.api.postSendEmail(this.authService.encrypt(this.frmRecover.value.curp)).subscribe((data: any) => {
        console.log(data);

        Swal.fire({

          title: "",
          text: data.mss,
        });
        this.frmRecover.patchValue(
          {
            'curp': ''
          });
        this.submittedRecovery = false;
        this.modalService.dismissAll();
      },
      (error) => {
        console.log(error);
      }
      );
    }

}
