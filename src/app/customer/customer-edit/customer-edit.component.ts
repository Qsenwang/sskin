import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {NzFormDirective, NzFormItemComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";

@Component({
  selector: 'app-customer-edit',
  standalone: true,
    imports: [
        FormsModule,
        NgForOf,
        NzCheckboxComponent,
        NzColDirective,
        NzDatePickerComponent,
        NzFormDirective,
        NzFormItemComponent,
        NzInputDirective,
        NzOptionComponent,
        NzRowDirective,
        NzSelectComponent,
        ReactiveFormsModule
    ],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.scss'
})
export class CustomerEditComponent {

}
