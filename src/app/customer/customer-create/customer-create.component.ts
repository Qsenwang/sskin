import {Component, EventEmitter, Output} from '@angular/core';
import {NzFormDirective, NzFormModule} from "ng-zorro-antd/form";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomerService} from "../customer.service";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzModalRef} from "ng-zorro-antd/modal";
import {CustomerBasicInfoDto, CustomerDetailDto} from "@shared/sskinModel/sskinDto.model";
import {NgIf} from "@angular/common";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzMessageModule, NzMessageService} from "ng-zorro-antd/message";

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
  @Output() operationSuccess = new EventEmitter<boolean>(); //


  customerCreateFrm: FormGroup;
  isLoading = false;
  resultSuccess = false;
  resultError = false;

  constructor(private fb: FormBuilder,
              private customerService: CustomerService,
              private modalRef: NzModalRef,
              private message: NzMessageService) {
    this.customerCreateFrm = this.fb.group({
      name: [null, Validators.required],
      contactPhone: [null, [Validators.required, Validators.pattern('^\\+?\\s*(\\d\\s*){10,}$')]],
      customerNote: [null],
      active: [true]
    });
    this.customerCreateFrm.markAllAsTouched()
  }

  onClose(): void {
    this.modalRef.destroy();
  }
  onCreate(): void {
    if (this.customerCreateFrm.valid) {
      this.isLoading = true;
      const customerData: CustomerBasicInfoDto = {
        id:'',
        name: this.customerCreateFrm.value.name,
        contactPhone: this.customerCreateFrm.value.contactPhone,
        customerNote: this.customerCreateFrm.value.customerNote,
        active: this.customerCreateFrm.value.active,
      };

      this.customerService.createNewCustomer(customerData).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.resultSuccess = true;
          this.message.success('保存成功'); // 显示成功消息
        },
        error: (error) => {
          this.isLoading = false;
          this.resultError = true;
          this.message.error('Error updating customer', error);
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
