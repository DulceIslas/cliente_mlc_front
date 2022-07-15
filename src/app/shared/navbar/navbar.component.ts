import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from './../services/api.service';
import { AuthService } from 'app/shared/auth/auth.service';
import { Component, Output, EventEmitter, OnDestroy, OnInit, AfterViewInit, ChangeDetectorRef, Inject, Renderer2, ViewChild, ElementRef, ViewChildren, QueryList, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '../services/layout.service';
import { Subscription } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { DOCUMENT } from '@angular/common';
import { CustomizerService } from '../services/customizer.service';
import { FormControl } from '@angular/forms';
import { LISTITEMS } from '../data/template-search';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { first } from 'rxjs/operators';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  currentLang = "en";
  selectedLanguageText = "English";
  selectedLanguageFlag = "./assets/img/flags/us.png";
  toggleClass = "ft-maximize";
  placement = "bottom-right";
  logoUrl = 'assets/img/logo.png';
  menuPosition = 'Side';
  isSmallScreen = false;
  protected innerWidth: any;
  searchOpenClass = "";
  transparentBGClass = "";
  hideSidebar: boolean = true;
  public isCollapsed = true;
  layoutSub: Subscription;
  configSub: Subscription;

  nombre = '';
  membresia = '';

  @ViewChild('search') searchElement: ElementRef;
  @ViewChildren('searchResults') searchResults: QueryList<any>;

  @Output()
  toggleHideSidebar = new EventEmitter<Object>();

  @Output()
  seachTextEmpty = new EventEmitter<boolean>();

  listItems = [];
  control = new FormControl();

  public config: any = {};
  items: MenuItem[];
  constructor(public translate: TranslateService,
    private layoutService: LayoutService,
    private router: Router,
    private configService: ConfigService, private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private api: ApiService,
    public jwtHelper: JwtHelperService,
    ) {



      this.membresia = localStorage.getItem('membresia');
      this.nombre = localStorage.getItem('nombre');
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|es|pt|de/) ? browserLang : "en");
    this.config = this.configService.templateConf;
    this.innerWidth = window.innerWidth;

    this.auth
    .resigninUser(localStorage.getItem("mail").toString(), localStorage.getItem("identityp").toString())
    .pipe(first())
    .subscribe(
      (data) => {
        this.getUserById(data);
      });


    this.layoutSub = layoutService.toggleSidebar$.subscribe(
      isShow => {
        this.hideSidebar = !isShow;
      });

  }

  getUserById(dataT) {
    let tk = localStorage.getItem("tokenApp").toString();
    console.log(tk);
    console.log(this.jwtHelper.decodeToken(localStorage.getItem("tokenApp").toString()));
    let idUser= this.jwtHelper.decodeToken(localStorage.getItem("tokenApp").toString())["user"]['idPersona'];
    localStorage.setItem('curp', this.jwtHelper.decodeToken(localStorage.getItem("tokenApp").toString())["user"]['curp']);
    this.api
    .getUserById(idUser, this.auth.currentTokenValue)
    .pipe(first())
    .subscribe(
      (data: any) => {
        let arrTemp = [];
        let persona = data;
        console.log("getUserById", data);
        this.nombre = persona["personaFisica"]['nombre'] + ' ' + persona["personaFisica"]['primerApellido'] + ' ' + persona["personaFisica"]['segundoApellido'];
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
        this.membresia = data.nummembresia
      },
      (error) => {
        console.log(error);
      }
    );

}

  ngOnInit() {
    this.listItems = LISTITEMS;

    if (this.innerWidth < 1200) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }

    this.items = [
      {
        label: 'Perfil',
        icon: 'far fa-user font-pink',
        routerLink: '../../page'
      },
      {
        label: 'Mi Plan',
        icon: 'far fa-list-alt font-pink',
        routerLink: '../../page/plan'
      },
      {
        label: 'Pago',
        icon: 'fas fa-money-bill font-pink',
        routerLink: '../../page/pago'
      },
      {
        label: 'Beneficios',
        icon: 'far fa-star font-pink',
        routerLink: '../../page/beneficios'
      },
      {
        label: 'Contacto',
        icon: 'far fa-envelope font-pink',
        routerLink: '../../page/contacto'
      },
      {
        label: 'Cerrar sesión',
        icon: 'fas fa-sign-out-alt font-pink',
        routerLink: '../../page',
        command: () => this.cerrarSesion()
      },
    ];
  }

  ngAfterViewInit() {

    this.configSub = this.configService.templateConf$.subscribe((templateConf) => {
      if (templateConf) {
        this.config = templateConf;
      }
      this.loadLayout();
      this.cdr.markForCheck();

    })
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
    if (this.configSub) {
      this.configSub.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = event.target.innerWidth;
    if (this.innerWidth < 1200) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }
  }

  loadLayout() {

    if (this.config.layout.menuPosition && this.config.layout.menuPosition.toString().trim() != "") {
      this.menuPosition = this.config.layout.menuPosition;
    }

    if (this.config.layout.variant === "Light") {
      this.logoUrl = 'assets/img/logo-dark.png';
    }
    else {
      this.logoUrl = 'assets/img/logo.png';
    }

    if (this.config.layout.variant === "Transparent") {
      this.transparentBGClass = this.config.layout.sidebar.backgroundColor;
    }
    else {
      this.transparentBGClass = "";
    }

  }

  onSearchKey(event: any) {
    if (this.searchResults && this.searchResults.length > 0) {
      this.searchResults.first.host.nativeElement.classList.add('first-active-item');
    }

    if (event.target.value === "") {
      this.seachTextEmpty.emit(true);
    }
    else {
      this.seachTextEmpty.emit(false);
    }
  }

  removeActiveClass() {
    if (this.searchResults && this.searchResults.length > 0) {
      this.searchResults.first.host.nativeElement.classList.remove('first-active-item');
    }
  }

  onEscEvent() {
    this.control.setValue("");
    this.searchOpenClass = '';
    this.seachTextEmpty.emit(true);
  }

  onEnter() {
    if (this.searchResults && this.searchResults.length > 0) {
      let url = this.searchResults.first.url;
      if (url && url != '') {
        this.control.setValue("");
        this.searchOpenClass = '';
        this.router.navigate([url]);
        this.seachTextEmpty.emit(true);
      }
    }
  }

  redirectTo(value) {
    this.router.navigate([value]);
    this.seachTextEmpty.emit(true);
  }


  ChangeLanguage(language: string) {
    this.translate.use(language);

    if (language === 'en') {
      this.selectedLanguageText = "English";
      this.selectedLanguageFlag = "./assets/img/flags/us.png";
    }
    else if (language === 'es') {
      this.selectedLanguageText = "Spanish";
      this.selectedLanguageFlag = "./assets/img/flags/es.png";
    }
    else if (language === 'pt') {
      this.selectedLanguageText = "Portuguese";
      this.selectedLanguageFlag = "./assets/img/flags/pt.png";
    }
    else if (language === 'de') {
      this.selectedLanguageText = "German";
      this.selectedLanguageFlag = "./assets/img/flags/de.png";
    }
  }

  ToggleClass() {
    if (this.toggleClass === "ft-maximize") {
      this.toggleClass = "ft-minimize";
    } else {
      this.toggleClass = "ft-maximize";
    }
  }

  toggleSearchOpenClass(display) {
    this.control.setValue("");
    if (display) {
      this.searchOpenClass = 'open';
      setTimeout(() => {
        this.searchElement.nativeElement.focus();
      }, 0);
    }
    else {
      this.searchOpenClass = '';
    }
    this.seachTextEmpty.emit(true);



  }



  toggleNotificationSidebar() {
    this.layoutService.toggleNotificationSidebar(true);
  }

  toggleSidebar() {
    this.layoutService.toggleSidebarSmallScreen(this.hideSidebar);
  }

  cerrarSesion() {
    console.log("Entra");
    this.auth.logout();
  }
}
