import {Component, Inject} from '@angular/core';
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
import {Appointment, employeeTask, TreatMentItem} from "@shared/sskinModel/booking.model"
import {BookingService} from "../booking.service";
import {CommonModule, JsonPipe} from "@angular/common";
import {MatOption, MatSelect} from "@angular/material/select";
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
export class AppointmentDialogComponent {

  appointmentFrm : FormGroup = this.initFrm()
  treatmentItems: string [] =["t1", "t2","t3"]
  selectedItem : any;
  constructor(
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {mode: string, employeeId: string, appointment:Appointment},
    private fb: FormBuilder,
    private bookingService:BookingService
  ) {
    console.warn(this.appointmentFrm)
  }
  private initFrm() : FormGroup{
    if (this.data.mode==="new") {
      return this.fb.group(
        {
          name: this.fb.control(undefined),
          phone: this.fb.control(undefined),
          serviceName: this.fb.control(undefined),
          startTime: this.fb.control(undefined),
          endTime: this.fb.control(undefined),
          type: this.fb.control(undefined),
          price: this.fb.control(undefined),
          paymentMethod: this.fb.control(undefined),
          employeeId: this.fb.control(undefined),
          employeeBonus: this.fb.control(undefined)
        })
    }
    else if(this.data.mode==="edit"){
      return this.fb.group(
        {
          employeeId: this.fb.control(this.data.employeeId),
          name: this.fb.control(this.data.appointment?.name),
          phone: this.fb.control(this.data.appointment?.phone),
          serviceName: this.fb.control(this.data.appointment?.serviceName),
          startTime: this.fb.control(this.data.appointment?.startTime),
          endTime: this.fb.control(this.data.appointment?.endTime),
          type: this.fb.control(this.data.appointment?.type),
          price: this.fb.control(this.data.appointment?.price),
          paymentMethod: this.fb.control(this.data.appointment?.paymentMethod),
          employeeBonus: this.fb.control(this.data.appointment?.employeeBonus)
        })
    }
  return this.appointmentFrm;
  }

  ngOnInit(){
  }
  updateAppointment() {
    this.bookingService.updateTask(this.appointmentFrm)
  }
}
