import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  CustomerBundleDto, CustomerDetailDto,
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
    NzDescriptionsItemComponent
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
  readOnlyMode = false;

  constructor(
    @Inject(NZ_MODAL_DATA) public data: any,
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.appointmentFrmGroup = this.buildEmptyAppointForm();
    this.appointmentFrmGroup.markAllAsTouched()
    this.getAllTreatmentItems();
    this.getAllStaff();
    this.getAllCustomer();
    if (!!this.data.appointmentId) {
      this.fetchAppointmentDetail(this.data.appointmentId)
    } else {
      this.enableEdit = true;
    }
    this.appointmentFrmGroup.get('customerId').valueChanges?.subscribe(
      (customerId: string) => {
        if (customerId) {
          this.bookingService.getCustomerBundles(customerId).subscribe(
            {
              next: (data) => {
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
                  }
                )
              },
              error: (error) => {
                console.error(error)
              }
            }
          )
        }
        this.updatePhoneField(customerId);

      })
  }


  private updatePhoneField(customerId: string) {
    const selectedCustomer = this.customerList.find(customer => customer.id === customerId);
    if (selectedCustomer) {
      this.appointmentFrmGroup.get('phone').setValue(selectedCustomer.contactPhone);
    }
  }

  private buildEmptyAppointForm(): FormGroup {
    return this.fb.group(
      {
        appointmentId: [null],
        customerId: [null, Validators.required],
        phone: [null, [Validators.required, Validators.pattern('^\\+?\\s*(\\d\\s*){10,}$')]],
        treatmentItemId: [null, Validators.required],
        startTime: [null, Validators.required],
        endTime: [null, Validators.required],
        staffId: [null, Validators.required],
        type: [null],
        charge: [null],
        staffBonus: [null],
        appointmentNote: [null],
        paymentId: [null],
        complete: [false, Validators.required],
        active:[true],
      })
  }

  fetchAppointmentDetail(appointmentId: string) {
    if (!!appointmentId) {
      return this.bookingService.getAppointmentDetailById(appointmentId).subscribe({
        next: (data: any) => {
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
    this.appointmentFrmGroup.get('startTime').setValue(new Date(data.startTime.replace('Z', '')))
    this.appointmentFrmGroup.get('endTime').setValue(new Date(data.endTime.replace('Z', '')))
    this.appointmentFrmGroup.get('staffId').setValue(staff.id);
    this.appointmentFrmGroup.get('type').setValue(data.type)
    this.appointmentFrmGroup.get('charge').setValue(data.charge)
    this.appointmentFrmGroup.get('staffBonus').setValue(data.staffBonus)
    this.appointmentFrmGroup.get('appointmentNote').setValue(data.appointmentNote)
    this.appointmentFrmGroup.get('paymentId').setValue(data.paymentMethod)
    this.appointmentFrmGroup.get('complete').setValue(data.complete)
    if (data.complete) {
      this.appointmentFrmGroup.disable()
      this.readOnlyMode = true;
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
      if(values.startTime) {
        // 将 Date 对象转换为您需要的格式，这里不使用时区转换
        values.startTime = moment(values.startTime).format('YYYY-MM-DDTHH:mm:ss');
      }
      if(values.endTime) {
        // 同样处理 endTime
        values.endTime = moment(values.endTime).format('YYYY-MM-DDTHH:mm:ss');
      }

      console.warn( this.appointmentFrmGroup.value)


      if(this.data.appointmentId){
        this.bookingService.updateAppointment(this.data.appointmentId, values).subscribe({
          next: (data) => {
            // 处理成功的响应
            this.enableEdit = false;
            this.message.success('保存成功'); // 显示成功消息
            this.fetchAppointmentDetail(data);
            this.handleSaveSuccess();
          },
          error: (error) => {
            // 处理错误
            this.message.error('Error updating customer', error);
          }
        });
      } else {
        this.bookingService.newAppointment(values).subscribe({
          next: (data) => {
            // 处理成功的响应
            this.enableEdit = false;
            this.message.success('保存成功'); // 显示成功消息
            this.fetchAppointmentDetail(data);
            this.handleSaveSuccess();
          },
          error: (error) => {
            // 处理错误
            this.message.error('Error updating customer', error);
          }
        });
      }

    }
  }

  private toISOStringWithoutMillis(date: Date): string {
    const isoString = date.toISOString();
    const isoStringWithoutMillisAndZ = isoString.replace(/\.\d{3}Z$/, '');
    return isoStringWithoutMillisAndZ;
  }
  cancelUpdate() {
    this.enableEdit = false;
    this.fetchAppointmentDetail(this.data.appointmentId);
  }

  close(){
    this.modalRef.destroy()
  }
  appointmentExist() {
    return !!this.data.customerId && this.data.customerId !== null;
  }

  cancelAppointment() {
    this.modalService.confirm({
      nzTitle: '<i> 注意 </i>',
      nzContent: '<b>确定要删除此员工吗？</b>',
      nzOnOk: () => this.removeAppointment(this.data.appointmentId)
    });
  }

  removeAppointment(appointmentId: string) {
    this.bookingService.removeAppointment(this.data.appointmentId)
  }

  openPaymentBoard() {
    this.showPaymentBoard = true;
  }

  normalPay() {
    this.selectedPaymentMethod = "normal"

  }

  bundlePay() {
    this.selectedPaymentMethod = "bundle"
  }

  selectePaymentBundle(bundle: CustomerBundleDto) {
    this.selectedBundle = bundle;
  }

  hasSelectedPaymentBunle() {
    return !!this.selectedBundle && this.selectedBundle !== null;
  }


  //readonly mode
  hasNormalPayment(){
    return this.appointmentFrmGroup.get('paymentId')?.value !== null;
  }

test(){
    console.warn(this.appointmentFrmGroup.get('endTime').value)
}

  handleSaveSuccess(): void {
    this.saveSuccess.emit(true);
  }

}
