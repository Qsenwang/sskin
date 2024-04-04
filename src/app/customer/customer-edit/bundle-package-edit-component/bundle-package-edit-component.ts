import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomerService} from "../../customer.service";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzFormDirective, NzFormModule} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {NzSelectComponent, NzSelectModule} from "ng-zorro-antd/select";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {CommonModule, NgForOf} from "@angular/common";
import {TreatmentItemDto} from "@shared/sskinModel/sskinDto.model";
import {NzButtonComponent, NzButtonModule} from "ng-zorro-antd/button";
import {FormFieldErrorsComponent} from "@shared/form-field-errors/form-field-errors.component";

@Component({
  selector: 'app-bundle-package-edit-component',
  standalone: true,
  imports: [
    NzFormModule,
    ReactiveFormsModule,
    NzInputDirective,
    NzDatePickerComponent,
    NzSelectModule,
    NzDividerComponent,
    CommonModule,
    NzButtonModule,
    FormFieldErrorsComponent
  ],
  templateUrl: './bundle-package-edit-component.html',
  styleUrl: './bundle-package-edit-component.scss'
})
export class BundlePackageEditComponent implements OnInit {
  @Output() saveSuccess = new EventEmitter<boolean>(); //

  bundlePackageEditForm: FormGroup | any;
  allItems: TreatmentItemDto[] = [];

  constructor(private fb: FormBuilder,
              private customerService: CustomerService,
              private modalRef: NzModalRef,
              private message: NzMessageService,
              @Inject(NZ_MODAL_DATA) public data: any) {
    this.bundlePackageEditForm = this.fb.group({
      id: [null],
      bundlePackageName: [null, Validators.required],
      purchaseDate: [null, Validators.required],
      bundleValue: [null, [Validators.required, Validators.pattern('^[1-9]\\d*(?:\\.\\d{1,2})?$')]],
      bundleNote: [null],
      customerId: [data.customerId, Validators.required],
      paymentId: [null],
      packageDetailList: this.fb.array([]),
      active: [true],
      paymentDetail: this.fb.group({
        id: [null],
        cash: [null],
        card: [null],
        transfer: [null],
        membershipCard: [null],
        insurance: [null],
        rmb: [null]
      })
    });
  }

  ngOnInit() {
    this.customerService.getAllTreatmentItems().subscribe({
      next: (data) => {
        this.allItems = data;
      },
      error: () => this.message.error('加载信息失败')
    });
    if (!!this.data.bundleId){
      this.loadCustomerBundlePackage(this.data.bundleId);
    }
  }
  loadCustomerBundlePackage(bundleId : string){
      this.customerService.getBundleDetail(bundleId).subscribe(
        {
          next: (data) => {
            this.bundlePackageEditForm.patchValue({
              id: data.id,
              bundlePackageName: data.bundlePackageName,
              purchaseDate: data.purchaseDate,
              bundleValue: data.bundleValue,
              bundleNote: data.bundleNote,
              customerId: data.customerId,
              paymentId: data.paymentId,
              active: data.active,
              paymentDetail: data.paymentDetail,
            });
            if (!!data.packageDetailList) {
              data.packageDetailList.forEach(detail => {
                this.addPackageDetail(detail);
              });
            }

          },
          error: () => this.message.error('加载信息失败')
        });
  }
  close(): void {
    this.modalRef.destroy();
  }

  handleSaveSuccess(): void {
    this.notifyParentAndClose();
  }

  notifyParentAndClose(): void {
    this.saveSuccess.emit(true);
    this.modalRef.destroy();
  }

  get packageDetailList(): FormArray {
    return this.bundlePackageEditForm.get('packageDetailList') as FormArray;
  }

  addPackageDetail(detail?: any): void {
    this.packageDetailList.push(this.createPackageDetailGroup(detail));
  }

  private createPackageDetailGroup(detail?: any): FormGroup {
    return this.fb.group({
      id:[detail?.id || null],
      treatmentItem: [detail?.treatmentItem?.id || '', Validators.required],
      remainCount: [detail?.remainCount || '', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  removePackageDetail(index: number) {
    this.packageDetailList.removeAt(index);
  }

  submitForm() {
    if (this.bundlePackageEditForm.valid) {
      const formValue = { ...this.bundlePackageEditForm.value };
      formValue.packageDetailList = formValue.packageDetailList.map((detail: any) => {
        const fullItem = this.allItems.find(item => item.id === detail.treatmentItem);
        return {
          ...detail,
          treatmentItem: fullItem,
        };
      });

      if (formValue.id !== null) {
        this.customerService.updateBundlePackage(formValue).subscribe(
          {
            next: () => {
              this.message.success('套餐包更新成功');
              this.handleSaveSuccess();
            },
            error: () => this.message.error('更新失败，请重试')
          })
      } else {
          this.customerService.addNewBundlePackage(formValue).subscribe({
            next: (bundleId) => {
              this.message.success('新套餐包添加成功');
              this.handleSaveSuccess();
              this.loadCustomerBundlePackage(bundleId);
            },
            error: () => this.message.error('添加失败，请重试')
          });
      }
    } else {
      this.message.error('表单无效，请重试')
    }
  }

  test() {
    console.warn(this.bundlePackageEditForm)
    console.warn(this.bundlePackageEditForm.value)
  }
}
