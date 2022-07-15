import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from 'app/shared/auth/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { first } from 'rxjs/operators';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {

  loginFormSubmitted = false;
  isLoginFailed = false;
  returnUrl: any;


  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(true)
  });


  constructor(private router: Router, private authService: AuthService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
    ) {

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    // if (this.authService.currentUserValue) {
    //   this.router.navigate(["/"]);
    // }

  }

  get lf() {
    return this.loginForm.controls;
  }

  // On submit button click
  onSubmit() {
    this.loginFormSubmitted = true;
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
        console.log(data);
        if (!data.error) {
          this.router.navigate([this.returnUrl]);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.mensaje,
          });
          this.spinner.hide();
        }
      },
      (error) => {}
    );
  }

}
