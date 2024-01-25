import {Component, Inject, OnInit} from '@angular/core';
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
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {AppointmentDetailDto, staffDailyTaskDto, treatItemDto} from "@shared/sskinModel/booking.model"
import {BookingService} from "../booking.service";
import {CommonModule, JsonPipe} from "@angular/common";
import {MatOption, MatSelect} from "@angular/material/select";
import {Subscription} from "rxjs";
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
    MatOption
  ],
  providers:[BookingService],
  templateUrl: './appointment-dialog.component.html',
  styleUrl: './appointment-dialog.component.scss'
})
export class AppointmentDialogComponent implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {employeeId: string, appointmentId:string},
    private fb: FormBuilder,
    private bookingService:BookingService
  ) {}

  appointmentFrmGroup : FormGroup | any;

  private _subscriptions : Subscription = new Subscription()

  ngOnInit(){
    this.appointmentFrmGroup = this.buildEmptyAppointForm(this.data.appointmentId);
    this.fetchAppointmentDetail(this.data.appointmentId);
    // this.bookingService.getAppointmentDetailById(this.data.appointmentId)
  }

  private buildEmptyAppointForm(appointmentId:string) : FormGroup {
   return this.fb.group(
      {
        name: this.fb.control(''),
        phone: this.fb.control(''),
        treatmentItem: this.fb.control(''),
        startTime: this.fb.control(''),
        endTime: this.fb.control(''),
        type: this.fb.control(''),
        price: this.fb.control(''),
        paymentMethod: this.fb.control(''),
        employeeId: this.fb.control(''),
        employeeBonus: this.fb.control('')
      })
  }

  fetchAppointmentDetail(appointmentId:string){
    if (!!appointmentId) {
      return this.bookingService.getAppointmentDetailById(appointmentId).subscribe({
        next: (data) =>  {this.updateAppointmentFrmGroup(data)},
        error: (error) => {console.error(error)}
      })
    }
    return null;
  }


  private updateAppointmentFrmGroup(data: AppointmentDetailDto) {
    this.appointmentFrmGroup.get('appointmentId').setValue(data.appointmentId)
    this.appointmentFrmGroup.get('customerName').setValue(data.customerName)
    this.appointmentFrmGroup.get('phone').setValue(data.phone)
    this.appointmentFrmGroup.get('treatItem').setValue(data.treatItem)
    this.appointmentFrmGroup.get('startTime').setValue(data.startTime)
    this.appointmentFrmGroup.get('endTime').setValue(data.endTime)
    this.appointmentFrmGroup.get('type').setValue(data.type)
    this.appointmentFrmGroup.get('price').setValue(data.price)
    this.appointmentFrmGroup.get('paymentMethod').setValue(data.paymentMethod)
    this.appointmentFrmGroup.get('staffBonus').setValue(data.staffBonus)
    this.appointmentFrmGroup.get('overLap').setValue(data.overLap)
    this.appointmentFrmGroup.get('layer').setValue(data.layer)
  }



  updateAppointment() {
    this.bookingService.updateTask(this.appointmentFrmGroup?.value)
  }

  treatmentItems = [
    {id:"1", name:"t1"},
    {id:"2", name:"t2"},
    {id:"3", name:"t3"}]
}
