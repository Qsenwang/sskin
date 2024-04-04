import { Component,Input} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, NgIf} from "@angular/common";

@Component({
  selector: 'form-field-errors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-field-errors.component.html',
  styleUrl: './form-field-errors.component.scss'
})
export class FormFieldErrorsComponent {
  @Input() control!: FormControl |any;
  @Input() customMessages: { [key: string]: string } = {};

  errors(): string[] {
    if (!this.control.errors) {
      return [];
    }

    return Object.keys(this.control.errors).map(key => {
      return this.customMessages[key] || "Error";
    });
  }
}
