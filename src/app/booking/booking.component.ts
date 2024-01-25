import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AppointmentDialogComponent} from "./appointment-dialog/appointment-dialog.component";
import {AppointmentBaseDto, AppointmentDetailDto, staffDailyTaskDto} from "@shared/sskinModel/booking.model"
import {BookingService} from "./booking.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {Observable, Subscription} from "rxjs";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ApiService} from "@shared/api/api.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatNativeDateModule} from "@angular/material/core";

interface TimeSlot {
  time: string;
}
interface gridCell {
  emptyContent: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers:[BookingService, MatDatepickerModule, MatNativeDateModule ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {

  timeSlots = this.generateTimeSlots();
  gridMatrix= this.generateGrid()

  selectedDateControl = new FormControl(new Date());
  staffTasks: Observable<staffDailyTaskDto[]> | any;
  _subscriptions : Subscription = new Subscription()
  constructor(public dialog: MatDialog, private bookingService:BookingService) {}

  ngOnInit(){
    this._subscriptions.add(
      this.selectedDateControl.valueChanges.subscribe((newDate) => {
          if(newDate !== null){
            this.bookingService.getAllEmployeeTasks(newDate.toISOString())
              .subscribe({
                next: (data) => {this.staffTasks = data},
                error: (error)=> {console.error(error)}
              })
          }
      })
    )
  }

  generateTimeSlots(): TimeSlot[] {
    const timeSlots: TimeSlot[] = [];
    for (let i = 10; i < 20; i++) {
      for (let j = 0; j < 60; j += 60) {
        const hours = i.toString().padStart(2, '0');
        const minutes = j.toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        timeSlots.push({ time });
      }
    }
    console.warn("var init")
    return timeSlots;
  }
  generateGrid() : gridCell[] {
    const matrix : gridCell[] = [];
    for (let i = 10; i < 19; i++) {
      for (let j = 0; j < 60; j += 30) {
        const blank: string = "";
        matrix.push({emptyContent: blank});
      }
    }
    return matrix;
  }

  addAppointment(employeeId:string) {

    const appointmentEditDialog = this.dialog.open(AppointmentDialogComponent,
      {
        width:"900px",
        height:"600px",
        panelClass:"customAppointment",
        // disableClose:true,
        data:{
          employeeId : employeeId,
          appointmentId : null
        }
      })
    appointmentEditDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  editAppointment(employeeId: string, appointmentId: string){
      const appointmentEditDialog = this.dialog.open(AppointmentDialogComponent,
        {
          width:"900px",
          height:"600px",
          panelClass:"customAppointment",
          // disableClose:true,
          data:{
            employeeId : employeeId,
            appointmentId : appointmentId,
          }
        })
    appointmentEditDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  calculateHeight(appointments: AppointmentBaseDto[]):any {
    let maxLayer:number   = 0;
    appointments.forEach((a) =>{
        if(a.layer > maxLayer){
          maxLayer = a.layer;
        }
    })
    const finalHeight = (maxLayer+1)*50;
    return {
      height:`${finalHeight}px`,
    }
  }
  calculateAppointmentStyle(appointment: AppointmentBaseDto): any {

    //employee name 120px, timeSlot 30min->75px
    const startTime = appointment.startTime.split(':').map(Number);
    const endTime = appointment.endTime.split(':').map(Number);

    const startHour = startTime[0];
    const startMin= startTime[1];
    const endHour = endTime[0];
    const endMin= endTime[1];
    const leftPos = 120 + (startHour-10)*150 + (startMin/30)*75;
    // const width = (endHour-startHour)*150 + (endMin-startMin)/30*75;
    const width = (endHour*60 + endMin - (startHour*60 + startMin))/60*150;
    const topPos = appointment.layer*50;
    return {
      left: `${leftPos}px`,
      top:`${topPos}px`,
      width: `${width}px`
    };
  }


}
