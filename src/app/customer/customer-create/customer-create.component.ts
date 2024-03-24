import {Component, EventEmitter, Output} from '@angular/core';
import {NzFormDirective, NzFormModule} from "ng-zorro-antd/form";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomerService} from "../customer.service";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzModalRef} from "ng-zorro-antd/modal";
import {CustomerDto} from "@shared/sskinModel/sskinDto.model";
import {NgIf} from "@angular/common";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzButtonComponent} from "ng-zorro-antd/button";

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [
    NzFormModule,
    ReactiveFormsModule,
    NzInputDirective,
    NgIf,
    NzSpinComponent,
    NzIconDirective,
    NzButtonComponent
  ],
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.scss'
})
export class CustomerCreateComponent {
  @Output() operationSuccess = new EventEmitter<boolean>(); // 可以发送任何类型的事件对象


  customerCreateFrm: FormGroup;
  isLoading = false;
  resultSuccess = false;
  resultError = false;

  constructor(private fb: FormBuilder, private customerService: CustomerService, private modalRef: NzModalRef) {
    this.customerCreateFrm = this.fb.group({
      name: [null, Validators.required],
      contactPhone: [null, [Validators.required, Validators.pattern('^\\+?\\d{10,}$')]],
      customerNote: [null],
      active: [true]
    });
  }

  onClose(): void {
    this.modalRef.destroy();
  }
  onCreate(): void {
    if (this.customerCreateFrm.valid) {
      this.isLoading = true;
      const customerData: CustomerDto = {
        id:'',
        name: this.customerCreateFrm.value.name,
        contactPhone: this.customerCreateFrm.value.contactPhone,
        customerNote: this.customerCreateFrm.value.customerNote,
        bundlePackages: [],
        active: this.customerCreateFrm.value.active,
      };

      this.customerService.createCustomer(customerData).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.resultSuccess = true;
        },
        error: (error) => {
          this.isLoading = false;
          this.resultError = true;
        },
      });
    }
  }

  handleCreateSuccess(): void {
    this.notifyParentAndClose();
  }

  notifyParentAndClose(): void {
    this.operationSuccess.emit(true);
    this.modalRef.destroy();
  }
}
