import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  CustomerBundleDto, CustomerDetailDto, PackageDetailDto, PaymentDto,
  StaffDto,
  TreatmentItemDto
} from "@shared/sskinModel/sskinDto.model"
import {BookingService} from "../booking.service";
import {CommonModule, DatePipe, JsonPipe} from "@angular/common";

import {Subscription} from "rxjs";
import {NzTimePickerModule} from "ng-zorro-antd/time-picker";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzMessageService} from "ng-zorro-antd/message";
import {NZ_MODAL_DATA, NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {FormFieldErrorsComponent} from "@shared/form-field-errors/form-field-errors.component";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzRadioGroupComponent, NzRadioModule} from "ng-zorro-antd/radio";

import {NzWaveDirective} from "ng-zorro-antd/core/wave";
import {NzDescriptionsComponent, NzDescriptionsItemComponent} from "ng-zorro-antd/descriptions";
import moment from "moment";
import {NzCardComponent, NzCardModule} from "ng-zorro-antd/card";
import {CustomerService} from "../../customer/customer.service";

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    NzTimePickerModule,
    NzDatePickerComponent,
    NzSelectComponent,
    NzOptionComponent,
    NzInputDirective,
    MatAutocompleteTrigger,
    MatAutocomplete,
    NzInputGroupComponent,
    NzColDirective,
    NzFormDirective,
    NzFormItemComponent,
    NzRowDirective,
    NzCheckboxComponent,
    NzButtonComponent,
    NzFormLabelComponent,
    FormFieldErrorsComponent,
    NzDividerComponent,
    NzRadioModule,
    NzFormControlComponent,
    NzWaveDirective,
    NzDescriptionsComponent,
    NzDescriptionsItemComponent,
    NzCardModule,
  ],
  providers: [BookingService, DatePipe],
  templateUrl: './appointment-dialog.component.html',
  styleUrl: './appointment-dialog.component.scss'
})
export class AppointmentDialogComponent implements OnInit {

  @Output() saveSuccess = new EventEmitter<boolean>();

  treatmentItems: TreatmentItemDto[] = [];
  staffList: StaffDto[] = [];
  customerList: CustomerDetailDto[] = [];
  customerBundleList: CustomerBundleDto[] = [];
  enableEdit = false;
  showPaymentBoard = false;
  paymentMethods = ["normal", "bundle"];
  selectedPaymentMethod: string | null = null;
  selectedBundle: CustomerBundleDto | any;
  appointmentFrmGroup: FormGroup | any;
  paymentDetailFrmGroup: FormGroup | any;
  paymentBundleFrmGroup: FormGroup | any;
  readOnlyMode = false;
  noActivePaymentBundle = false;
  selectePaymentBundle = false;
  appointmentTypeList = ["美容","注射"]
  selectedDate: Date | null = null;
  bundleReadOnly:CustomerBundleDto | any;
  constructor(
    @Inject(NZ_MODAL_DATA) public data: any,
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private customerService: CustomerService,
  ) {
    this.paymentDetailFrmGroup = this.fb.group({
      id: [null],
      cash: [null,  [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      card: [null,  [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      transfer: [null,  [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      membershipCard: [null,  [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      insurance: [null,  [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      rmb: [null,  [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      paymentFor: 'Appointment'
    });
  }

  disabledHours(): number[] {
    return [0,1, 2, 3,4,5,6,7,8];
  }

  ngOnInit() {
    this.appointmentFrmGroup = this.buildEmptyAppointForm();
    this.appointmentFrmGroup.markAllAsTouched()
    this.getAllTreatmentItems();
    this.getAllStaff();
    this.getAllCustomer();

    this.appointmentFrmGroup.get('customerId').valueChanges.subscribe((customerId:any) => {
      const selectedCustomer = this.customerList.find(customer => customer.id === customerId);
      if (selectedCustomer) {
        if(this.appointmentFrmGroup.get('phone').value !== selectedCustomer.contactPhone){
          this.appointmentFrmGroup.get('phone').setValue(selectedCustomer.contactPhone);
        }
      }
    });

    this.appointmentFrmGroup.get('phone').valueChanges.subscribe((phone:any) => {
        const selectedCustomer = this.customerList.find(customer => customer.contactPhone === phone);
        if (selectedCustomer) {
          if( this.appointmentFrmGroup.get('customerId').value !== selectedCustomer.id){
            this.appointmentFrmGroup.get('customerId').setValue(selectedCustomer.id);
          }

        }
      });

    if (!!this.data.appointmentId) {
      this.fetchAppointmentDetail(this.data.appointmentId)
    } else {
      this.enableEdit = true;
    }
  }

  onDateChange(event: Date): void {
    if (this.selectedDate) {
      const newDateTime = new Date(this.selectedDate);
      this.updateStartTime(newDateTime);
      this.updateEndTime(newDateTime);
    }
  }
  updateStartTime(newDateTime:Date){
    const timeValue = this.appointmentFrmGroup.get('startTime').value || new Date();
    const hours = timeValue.getHours();
    const minutes = timeValue.getMinutes();
    newDateTime.setHours(hours, minutes);
    // 更新 startTime 控件的值
    this.appointmentFrmGroup.get('startTime').setValue(newDateTime);
  };

  updateEndTime(newDateTime:Date){
    const timeValue = this.appointmentFrmGroup.get('endTime').value || new Date();
    const hours = timeValue.getHours();
    const minutes = timeValue.getMinutes();
    newDateTime.setHours(hours, minutes);
    // 更新 startTime 控件的值
    this.appointmentFrmGroup.get('endTime').setValue(newDateTime);
  };


  private buildEmptyAppointForm(): FormGroup {
    return this.fb.group(
      {
        appointmentId: [null],
        customerId: [null, Validators.required],
        phone: [null, [Validators.required, Validators.pattern('^\\+?\\s*(\\d\\s*){10,}$')]],
        treatmentItemId: [null, Validators.required],
        date:[null,Validators.required],
        startTime: [null, Validators.required],
        endTime: [null, Validators.required],
        staffId: [null, Validators.required],
        type: [null, Validators.required],
        charge: [null],
        firstTimeAppointment:[false],
        // staffBonus: [null],
        appointmentNote: [null],
        paymentId: [null],
        complete: [false, Validators.required],
        paymentBundle:[null],
        active: [true],
      })
  }

  fetchAppointmentDetail(appointmentId: string) {
    if (!!appointmentId) {
      return this.bookingService.getAppointmentDetailById(appointmentId).subscribe({
        next: (data) => {
          this.updateAppointmentFrmGroup(data)
        },
        error: (error) => {
          console.error(error)
        }
      })
    }
    return null;
  }

  getAllTreatmentItems() {
    return this.bookingService.getAllTreatmentItems().subscribe({
      next: (data) => {
        data.forEach((treatmentItem) => {
            const treatmentItemDto: TreatmentItemDto =
              {
                id: treatmentItem.id,
                name: treatmentItem.name,
                standardPrice: treatmentItem.standardPrice,
                itemNote: treatmentItem.itemNote,
                classType: treatmentItem.classType,
                active: treatmentItem.active
              };
            this.treatmentItems.push(treatmentItemDto);
          }
        )
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  getAllStaff() {
    return this.bookingService.getAllStaff().subscribe({
      next: (data) => {
        data.forEach((staff) => {
            const staffDto =
              {
                id: staff.id,
                name: staff.name,
                onBoardDate: staff.onBoardDate,
                offBoardDate: staff.offBoardDate,
                active: staff.active
              };
            this.staffList.push(staffDto);
          }
        )
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  getAllCustomer() {
    return this.bookingService.getAllCustomer().subscribe({
      next: (data) => {
        data.forEach((customer) => {
            const customerDto =
              {
                id: customer.id,
                name: customer.name,
                contactPhone: customer.contactPhone,
                customerNote: customer.customerNote,
                bundlePackages: customer.bundlePackages,
                active: customer.active
              };
            this.customerList.push(customerDto);
          }
        );
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  private matchTreatmentItem(itemId: string): any {
    if (this.treatmentItems.find((dto) => dto.id === itemId)) {
      return this.treatmentItems.find((dto) => dto.id === itemId)
    } else {
      console.warn("cant find")
    }
  }

  private matchStaff(staffId: string): any {
    if (this.staffList.find((dto) => dto.id === staffId)) {
      return this.staffList.find((dto) => dto.id === staffId)
    } else {
      console.warn("cant find")
    }
  }

  private matchCustomer(customerId: string): any {
    if (this.customerList.find((dto) => dto.id === customerId)) {
      return this.customerList.find((dto) => dto.id === customerId)
    } else {
      console.warn("cant find")
    }
  }

  private updateAppointmentFrmGroup(data: any) {
    const staff = this.matchStaff(this.data.staffId)
    const customer = this.matchCustomer(data.customerId)
    const treatmentItem = this.matchTreatmentItem(data.treatmentItemId)
    this.appointmentFrmGroup.get('appointmentId').setValue(data.appointmentId)
    this.appointmentFrmGroup.get('customerId').setValue(customer.id)
    this.appointmentFrmGroup.get('phone').setValue(customer.contactPhone)
    this.appointmentFrmGroup.get('treatmentItemId').setValue(treatmentItem.id)
    this.appointmentFrmGroup.get('date').setValue(new Date(data.startTime.replace('Z', '')))
    this.appointmentFrmGroup.get('startTime').setValue(new Date(data.startTime.replace('Z', '')))
    this.appointmentFrmGroup.get('endTime').setValue(new Date(data.endTime.replace('Z', '')))
    this.appointmentFrmGroup.get('staffId').setValue(staff.id);
    this.appointmentFrmGroup.get('type').setValue(data.type)
    this.appointmentFrmGroup.get('charge').setValue(data.charge)
    this.appointmentFrmGroup.get('firstTimeAppointment').setValue(data.firstTimeAppointment)
    // this.appointmentFrmGroup.get('staffBonus').setValue(data.staffBonus)
    this.appointmentFrmGroup.get('appointmentNote').setValue(data.appointmentNote)
    this.appointmentFrmGroup.get('paymentId').setValue(data.paymentId)
    this.appointmentFrmGroup.get('complete').setValue(data.complete)
    this.appointmentFrmGroup.get('paymentBundle').setValue(data.paymentBundle)
    if (data.complete) {
      this.appointmentFrmGroup.disable()
      this.readOnlyMode = true;
      this.enableEdit = false;
      if(data.paymentId){
        this.bookingService.getPaymentById(data.appointmentId, data.paymentId).subscribe({
          next:(payment)=>{
            this.updatePaymentOnReadOnlyMode(payment);
          },
          error: (error) =>{
            this.message.error(error);
          }
        });
      }

      if(data.paymentBundle){
        this.bookingService.getBundleById(data.paymentBundle).subscribe({
          next:(bundle)=>{
           this.updatePaymentBundleOnReadOnlyMode(bundle);
          },
          error: (error) =>{
            this.message.error(error);
          }
        })
      }

    }
  }

  toggleEdit() {
    this.enableEdit = !this.enableEdit;
    this.enableEdit ? this.appointmentFrmGroup.enable() : this.appointmentFrmGroup.readonly();
  }

  handleFocus(event: any) {
    if (!this.enableEdit) {
      event.target.blur();
    }
  }

  saveAppointment() {
    if (this.appointmentFrmGroup.valid) {

      const values = this.appointmentFrmGroup.value;
      delete values.date;

      if (values.startTime) {
        values.startTime = moment(values.startTime).format('YYYY-MM-DDTHH:mm:ss');
      }
      if (values.endTime) {
        // 同样处理 endTime
        values.endTime = moment(values.endTime).format('YYYY-MM-DDTHH:mm:ss');
      }

      if (this.data.appointmentId) {
        this.bookingService.updateAppointment(this.data.appointmentId, values).subscribe({
          next: (data) => {
            // 处理成功的响应
            this.enableEdit = false;
            this.handleSaveSuccess();
          },
          error: (error) => {
            // 处理错误
            this.message.error('Error updating customer', error);
          }
        });
      } else {
        this.bookingService.newAppointment(values).subscribe({
          next: (id) => {
            // 处理成功的响应
            this.enableEdit = false;
            this.message.success('保存成功'); // 显示成功消息
            this.handleSaveSuccess();
          },
          error: (error) => {
            this.message.error('Error updating customer', error);
          }
        });
      }

    }
  }

  cancelUpdate() {
    this.enableEdit = false;
    this.fetchAppointmentDetail(this.data.appointmentId);
  }

  close() {
    this.modalRef.destroy()
  }

  appointmentExist() {
    return !!this.data.customerId && this.data.customerId !== null;
  }

  cancelAppointment() {
    this.modalService.confirm({
      nzTitle: '<i> 注意 </i>',
      nzContent: '<b>确定要删除此预约吗？</b>',
      nzOnOk: () => this.removeAppointment(this.data.appointmentId)
    });
  }

  removeAppointment(appointmentId: string) {
    this.bookingService.removeAppointment(appointmentId).subscribe({
      next:()=>{
        this.handleRemoveSuccess();
      },
      error:(error)=>{
        this.message.error('Error updating customer', error);
      }
    })
  }

  openPaymentBoard() {
    this.showPaymentBoard = true;
  }

  normalPay() {
    this.paymentDetailFrmGroup = this.fb.group({
      id: [null],
      cash: [null,  [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      card: [null,  [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      transfer: [null,  [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      membershipCard: [null,  [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      insurance: [null,  [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      rmb: [null,  [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
      paymentFor: 'BundlePackage'
    })
    this.selectedPaymentMethod = "normal"
    this.paymentDetailFrmGroup.markAllAsTouched();
  }

  doNormalPay(){
    this.modalService.confirm({
      nzTitle: '<i> 注意 </i>',
      nzContent: '<b>付款后，该预约将完成， 并且将无法再进行编辑修改。确定要保存吗？</b>',
      nzOnOk: () => this.realPay()
    });
  }

  realPay() {
    this.bookingService.completeAppointAndPayNormally(this.data.appointmentId, this.paymentDetailFrmGroup.value).subscribe({
        next: () => {
          this.enableEdit = false;
          this.message.success('保存成功');
          this.modalRef.destroy();
        },
        error: (error) => {
          this.message.error('预约保存失败', error);
        }
      }
    )
    this.paymentDetailFrmGroup.value
  }

  cancelNormalPay(){
    this.paymentDetailFrmGroup = null;
    this.selectedPaymentMethod = null;
  }

  bundlePay() {
    this.selectedPaymentMethod = "bundle"
    this.paymentDetailFrmGroup = null;
    this.selectePaymentBundle = false;
    this.selectedBundle = null;

    this.paymentBundleFrmGroup = this.fb.group({
      id: null,
      bundlePackageName: null,
      purchaseDate: null,
      bundleValue: null,
      bundleNote: null,
      customerId: null,
      paymentId: null,
      packageDetailList: this.fb.array([]),
      active: true,
      paymentDetail: []
    });


    this.bookingService.getActiveCustomerBundles(this.data.customerId).subscribe(
      {
        next: (data) => {
          this.customerBundleList = [];
          data.forEach((bundle) => {
              const customerBundleDto: CustomerBundleDto =
                {
                  id: bundle.id,
                  bundlePackageName: bundle.bundlePackageName,
                  purchaseDate: bundle.purchaseDate,
                  bundleValue: bundle.bundleValue,
                  bundleNote: bundle.bundleNote,
                  customerId: bundle.customerId,
                  paymentId: bundle.paymentId,
                  packageDetailList: bundle.packageDetailList,
                  active: bundle.active,
                };
              this.customerBundleList.push(customerBundleDto);
              if(this.customerBundleList.length === 0) {
                this.noActivePaymentBundle = true;
              }
            }
          )
        },
        error: (error) => {
          console.error(error)
        }
      }
    )
  }

  get packageDetailList(): FormArray {
    return this.paymentBundleFrmGroup.get('packageDetailList') as FormArray;
  }

  useBundle(bundleId: string){
    this.selectePaymentBundle = true;
    this.selectedBundle = this.customerBundleList.find(bundle => bundle.id === bundleId);
    this.paymentBundleFrmGroup.patchValue({id:bundleId});
    const packageDetailListArray = this.paymentBundleFrmGroup.get('packageDetailList') as FormArray;

    packageDetailListArray.clear();

    if (this.selectedBundle && this.selectedBundle.packageDetailList) {
      this.selectedBundle.packageDetailList.forEach((detail: PackageDetailDto) => {
        packageDetailListArray.push(this.createDetailFormGroup(detail));
      });
    }

  }

  private createDetailFormGroup(detail: PackageDetailDto): FormGroup {
    return this.fb.group({
      id:detail.id,
      treatmentItem: detail.treatmentItem,
      remainCount: detail.remainCount
    });
  }



  decreaseRemaining(index: number): void {
    const packageDetailList = this.paymentBundleFrmGroup.get('packageDetailList') as FormArray;
    const currentCount = packageDetailList.at(index).get('remainCount')?.value;
    if (currentCount > 0) {
      packageDetailList.at(index).get('remainCount')?.setValue(currentCount - 1);
    }
  }

  completeAndPayByBundle () {
    this.modalService.confirm({
      nzTitle: '<i> 注意 </i>',
      nzContent: '<b>结算后，该预约将完成， 并且将无法再进行编辑修改。确定要保存吗？</b>',
      nzOnOk: () => this.doCompleteAndBundlePay()
    });
  }

  doCompleteAndBundlePay() {
    if (this.paymentBundleFrmGroup.get('id')){
      // 表单数据有效，可以提交
      const formData = this.paymentBundleFrmGroup.value;

      // 调用服务层方法，传递表单数据给后端
      this.bookingService.completeAppointAndPayByBundle(this.data.appointmentId, formData).subscribe({
        next: (response) => {
          this.message.success('提交成功！');
          this.modalRef.close();
        },
        error: (error) => {
          this.message.error(error);
        }
      });
    } else {
      this.message.error('表单数据无效，请检查后再次提交！');
    }
  }

  handleSaveSuccess(): void {
    this.message.success("保存成功")
    this.saveSuccess.emit(true);
    this.modalRef.destroy();
  }

  handleRemoveSuccess(): void {
    this.message.success("删除成功")
    this.saveSuccess.emit(true);
    this.modalRef.destroy();
  }

//read only mode thing
  updatePaymentOnReadOnlyMode(payment: PaymentDto) {
    this.paymentDetailFrmGroup = this.fb.group({
      id: payment.id,
      cash: payment.cash,
      card: payment.card,
      transfer: payment.transfer,
      membershipCard: payment.membershipCard,
      insurance: payment.insurance,
      rmb: payment.rmb,
      paymentFor: payment.paymentFor
    })
  }
  updatePaymentBundleOnReadOnlyMode(bundle: CustomerBundleDto) {
    this.bundleReadOnly = bundle;
    // this.paymentBundleFrmGroup = this.createReadOnlyFromGroup();
    // return this.fb.group({
    //   id: bundle.id,
    //   bundlePackageName: bundle.bundlePackageName,
    //   purchaseDate: bundle.purchaseDate,
    //   bundleValue: bundle.bundleValue,
    //   bundleNote: bundle.bundleNote,
    //   customerId: bundle.customerId,
    //   packageDetailList:bundle.packageDetailList,
    //   active: bundle.active,
    // });
  }

}
