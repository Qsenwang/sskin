import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective, NzInputModule} from "ng-zorro-antd/input";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {ActivatedRoute} from "@angular/router";
import {CustomerService} from "../customer.service";
import {CustomerBundleDto, PackageDetailListDto, PaymentDto} from "@shared/sskinModel/sskinDto.model";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzModalModule, NzModalService} from "ng-zorro-antd/modal";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {NzAutocompleteModule} from "ng-zorro-antd/auto-complete";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {CustomerCreateComponent} from "../customer-create/customer-create.component";
import {BundlePackageEditComponent} from "./bundle-package-edit-component/bundle-package-edit-component";
import {FormFieldErrorsComponent} from "@shared/form-field-errors/form-field-errors.component";

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
    NzInputModule,
    JsonPipe,
    NzDividerComponent,
    NzDrawerModule,
    FormFieldErrorsComponent
  ],

  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.scss'
})
export class CustomerEditComponent implements OnInit {
  customerBasicEditForm: FormGroup | any;
  enableEdit = false;
  customerId: string | any;
  bundlePackageList: CustomerBundleDto[] | any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {
    this.customerBasicEditForm = this.fb.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      contactPhone: [null, [Validators.required, Validators.pattern('^\\+?\\d{10,}$')]],
      customerNote: [null],
      active: [null]
    });
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('customerId');
    if (!!this.customerId) {
      this.loadCustomerInfo(this.customerId);
    }
  }

  loadCustomerInfo(customerId: string): void {
    this.customerService.getCustomer(customerId).subscribe({
      next: (customer) => {
        this.customerBasicEditForm.patchValue({
          id: customer.id,
          name: customer.name,
          contactPhone: customer.contactPhone,
          customerNote: customer.customerNote,
          active: customer.active
        });
        if (!!customer.bundlePackages) {
          this.bundlePackageList = customer.bundlePackages;
        }
        this.customerBasicEditForm.readonly = true;
        this.enableEdit = false;
      },
      error: () => this.message.error('加载客户信息失败')
    });
  }

  toggleEdit() {
    this.enableEdit = !this.enableEdit;
    this.enableEdit ? this.customerBasicEditForm.enable() : this.customerBasicEditForm.readonly();
  }

  handleFocus(event: any) {
    if (!this.enableEdit) {
      event.target.blur();
    }
  }

  updateCustomer() {
    // 这里是你的API端点
    if (this.customerBasicEditForm.valid) {
      this.customerService.updateCustomer(this.customerId, this.customerBasicEditForm.value).subscribe({
        next: (response) => {
          // 处理成功的响应
          this.enableEdit = false;
          this.message.success('保存成功'); // 显示成功消息
          this.loadCustomerInfo(this.customerId);
        },
        error: (error) => {
          // 处理错误
          this.message.error('Error updating customer', error);
        }
      });
    }
  }

  cancelUpdate() {
    this.enableEdit = false;
    this.loadCustomerInfo(this.customerId);
  }

  openBundleEditForm(bundleId: string | null) {

    const modalRef  = this.modalService.create({
      nzTitle: '套餐内容修改',
      nzContent: BundlePackageEditComponent,
      nzWidth: 1000,
      nzFooter:null,
      nzData: {
        customerId: this.customerId,
        bundleId: bundleId
      },
    });
    const instance = modalRef.getContentComponent();
    instance.saveSuccess.subscribe((success) => {
      if (success) {
        this.enableEdit = false;
        this.message.success('保存成功'); // 显示成功消息
        this.loadCustomerInfo(this.customerId);
      }
    });
  }

  removeBundle(bundleId: string) {

    this.modalService.confirm({
      nzTitle: '<i> 注意 </i>',
      nzContent: '<b>确定要删除此员工吗？</b>',
      nzOnOk: () => this.doRemoveBundlePackage(bundleId)
    });
  }

  doRemoveBundlePackage(bundleId: string){
    this.customerService.removeBundlePackage(bundleId).subscribe({
      next: ()=>{
        this.message.success('删除成功');
        this.loadCustomerInfo(this.customerId);
      },
      error:(error)=>{
        this.message.error('删除失败', error);
      }
    })
  }
}
