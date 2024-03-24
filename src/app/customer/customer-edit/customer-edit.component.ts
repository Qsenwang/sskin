import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {ActivatedRoute} from "@angular/router";
import {CustomerService} from "../customer.service";
import {CustomerBundleDto, CustomerDto} from "@shared/sskinModel/sskinDto.model";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzModalModule, NzModalService} from "ng-zorro-antd/modal";
import {NzTableComponent, NzTableModule} from "ng-zorro-antd/table";

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
    NgIf
  ],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.scss'
})
export class CustomerEditComponent implements OnInit {
  customerEditForm!: FormGroup;
  customerId: string | any;
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
      bundlePackages: this.fb.array([]),
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

        if (customer.bundlePackages) {
          customer.bundlePackages.forEach(bundle => this.addBundlePackage(bundle, false));
        }
      },
      error: () => this.message.error('加载客户信息失败')
    });
  }

  get bundlePackagesFormArray(): FormArray {
    return this.customerEditForm.get('bundlePackages') as FormArray;
  }

  addBundlePackage(bundlePackage: any = {}, isEdited: boolean = true): void {
    const bundleFormGroup = this.fb.group({
      bundlePackageName: [bundlePackage.bundlePackageName || '', Validators.required],
      purchaseDate: [bundlePackage.purchaseDate || '', Validators.required],
      bundleValue: [bundlePackage.bundleValue || ''],
      bundleNote: [bundlePackage.bundleNote || ''],
      _isEdited: [isEdited] // 新字段用于跟踪编辑状态
    });

    this.bundlePackagesFormArray.push(bundleFormGroup);
  }


  saveBundlePackage(index: number): void {
    console.log('Bundle package saved:', this.bundlePackagesFormArray.at(index).value);
    // 实际保存逻辑根据需要实现
  }

  cancelEdit(index: number): void {
    this.bundlePackagesFormArray.removeAt(index);
  }

  submitForm(): void {
    if (this.customerEditForm.valid) {
      const customerData: CustomerDto = this.customerEditForm.value;
      this.customerService.updateCustomer(this.customerId, customerData).subscribe({
        next: () => {
          this.message.success('客户信息已更新');
        },
        error: (error) => {
          console.error('更新失败', error);
          this.message.error('更新客户信息失败');
        }
      });
    } else {
      Object.values(this.customerEditForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.message.error('请检查表单填写的数据');
    }
  }
}
