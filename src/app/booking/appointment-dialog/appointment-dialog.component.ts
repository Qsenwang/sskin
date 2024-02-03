import {Component, Inject, OnInit} from '@angular/core';
import moment from 'moment-timezone';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogModule, MatDialogRef,
    MatDialogTitle
} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {
    AppointmentDetailDto,
    CustomerDto,
    staffDailyTaskDto,
    StaffDto,
    TreatmentItemDto
} from "@shared/sskinModel/booking.model"
import {BookingService} from "../booking.service";
import {CommonModule, JsonPipe} from "@angular/common";
import {MatOption, MatSelect} from "@angular/material/select";
import {map, Observable, of, Subscription} from "rxjs";
import {NzTimePickerModule} from "ng-zorro-antd/time-picker";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzFormDirective, NzFormItemComponent} from "ng-zorro-antd/form";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";

@Component({
    selector: 'app-appointment-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        ReactiveFormsModule,
        JsonPipe,
        MatSelect,
        MatOption,
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
        NzCheckboxComponent
    ],
    providers: [BookingService],
    templateUrl: './appointment-dialog.component.html',
    styleUrl: './appointment-dialog.component.scss'
})
export class AppointmentDialogComponent implements OnInit {

    _subscriptions: Subscription = new Subscription()
    treatmentItems: TreatmentItemDto[] = [];
    staffList: StaffDto[] = [];
    customerList: CustomerDto[] = [];
    constructor(
        public dialogRef: MatDialogRef<AppointmentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { staffId: string, appointmentId: string },
        private fb: FormBuilder,
        private bookingService: BookingService
    ) {
    }

    appointmentFrmGroup: FormGroup | any;


    ngOnInit() {
        this.appointmentFrmGroup = this.buildEmptyAppointForm(this.data.appointmentId);
        this.getAllTreatmentItems();
        this.getAllStaff();
        this.getAllCustomer();
        if (!!this.data.appointmentId) {
            this.fetchAppointmentDetail(this.data.appointmentId)
        }
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
                                firstName: staff.firstName,
                                middleName: staff.middleName,
                                lastName: staff.lastName,
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
                                firstName: customer.firstName,
                                middleName: customer.middleName,
                                lastName: customer.lastName,
                                contactPhone: customer.contactPhone,
                                customerNote: customer.customerNote,
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

    private buildEmptyAppointForm(appointmentId: string): FormGroup {
        return this.fb.group(
            {
                appointmentId: this.fb.control(''),
                customer: this.fb.control(''),
                customerFirstName: this.fb.control(''),
                customerMiddleName: this.fb.control(''),
                customerLastName: this.fb.control(''),
                phone: this.fb.control(''),
                treatmentItem: this.fb.control(''),
                startTime: this.fb.control(null, Validators.required),
                endTime: this.fb.control(null, Validators.required),
                type: this.fb.control(''),
                charge: this.fb.control(''),
                paymentMethod: this.fb.control(''),
                staffBonus: this.fb.control(''),
                staff: this.fb.control('')
            })
    }

    private updateAppointmentFrmGroup(data: any) {
        const staff = this.matchStaff(this.data.staffId)
        const customer = this.matchCustomer(data.customerId)
        const treatmentItem = this.matchTreatmentItem(data.treatmentItemId)
        this.appointmentFrmGroup.get('appointmentId').setValue(data.appointmentId)
        this.appointmentFrmGroup.get('customer').setValue(customer)
        this.appointmentFrmGroup.get('customerFirstName').setValue(customer.firstName)
        this.appointmentFrmGroup.get('customerMiddleName').setValue(customer.middleName)
        this.appointmentFrmGroup.get('customerLastName').setValue(customer.lastName)
        this.appointmentFrmGroup.get('phone').setValue(customer.phone)
        this.appointmentFrmGroup.get('treatmentItem').setValue(treatmentItem)
        this.appointmentFrmGroup.get('startTime').setValue(new Date(data.startTime))
        this.appointmentFrmGroup.get('endTime').setValue(new Date(data.endTime))
        this.appointmentFrmGroup.get('type').setValue(data.type)
        this.appointmentFrmGroup.get('charge').setValue(data.charge)
        this.appointmentFrmGroup.get('paymentMethod').setValue(data.paymentMethod)
        this.appointmentFrmGroup.get('staffBonus').setValue(data.staffBonus)
        this.appointmentFrmGroup.get('staff').setValue(staff);
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

    onSubmit() {
        console.warn(this.appointmentFrmGroup.get(`startTime`).value)
        console.warn(this.appointmentFrmGroup.get(`endTime`).value)
        // this.bookingService.saveAppointment(this.appointmentFrmGroup.value)
    }

    onChange(result: Date) {
        console.log('Changed Time: ', result);
    }

}
