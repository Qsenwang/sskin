import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective, NzInputGroupComponent, NzInputModule} from "ng-zorro-antd/input";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {ActivatedRoute} from "@angular/router";
import {CustomerService} from "../customer.service";
import {CustomerBundleDto, CustomerDetailDto} from "@shared/sskinModel/sskinDto.model";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzModalModule, NzModalService} from "ng-zorro-antd/modal";
import {NzTableComponent, NzTableModule} from "ng-zorro-antd/table";
import {NzDescriptionsComponent, NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {NzAutocompleteModule, NzAutocompleteTriggerDirective} from "ng-zorro-antd/auto-complete";
import {NzIconDirective} from "ng-zorro-antd/icon";

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
    ReactiveFormsModule,
    NzFormLabelComponent,
    NzButtonComponent,
    NzTableModule,
    NzModalModule,
    NgIf,
    NzDescriptionsModule,
    NzBadgeComponent,
    NzInputModule,
    NzAutocompleteModule,
    NzIconDirective,
    JsonPipe
  ],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.scss'
})
export class CustomerEditComponent implements OnInit {
  customerEditForm: FormGroup |any;
  enableEdit = false; // 控制是否可以编辑
  customerId: string | any;
  selectedBundle : CustomerBundleDto | any;
  bundlePackageList: CustomerBundleDto[] | any;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private message: NzMessageService
  ) {
    this.customerEditForm = this.fb.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      contactPhone: [null, [Validators.required, Validators.pattern('^\\+?\\d{10,}$')]],
      customerNote: [null],
      active:[null]
    });
  }

  ngOnInit(): void {

    this.customerId = this.route.snapshot.paramMap.get('customerId');
    if(!!this.customerId){
      this.loadCustomerInfo(this.customerId);
    }

  }

  loadCustomerInfo(customerId: string): void {
    this.customerService.getCustomerById(customerId).subscribe({
      next: (customer) => {

        this.customerEditForm.patchValue({
          id: customer.id,
          name: customer.name,
          contactPhone: customer.contactPhone,
          customerNote: customer.customerNote,
          active:customer.active});
        if(!!customer.bundlePackages){
          this.bundlePackageList = customer.bundlePackages;
        }
        this.customerEditForm.disable();
      },
      error: () => this.message.error('加载客户信息失败')
    });
  }
  toggleEdit() {
    this.enableEdit = !this.enableEdit;
    this.enableEdit ? this.customerEditForm.enable() : this.customerEditForm.disable();
  }

  updateCustomer() {
    // 这里是你的API端点
    if (this.customerEditForm.valid) {
      this.customerService.updateCustomer(this.customerId,this.customerEditForm.value).subscribe({
        next: (response) => {
          // 处理成功的响应
          this.message.success('保存成功'); // 显示成功消息
          this.enableEdit = false; // 保存成功后禁用表单编辑
          this.customerEditForm.disable();
        },
        error: (error) => {
          // 处理错误
          this.message.error('Error updating customer', error);
        }
      });
    }
  }
}
