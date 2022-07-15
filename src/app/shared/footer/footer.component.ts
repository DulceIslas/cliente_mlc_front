import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class FooterComponent{
    //Variables
    currentDate : Date = new Date();
}
