import { Component } from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {left} from "@popperjs/core";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AppointmentDialogComponent} from "./appointment-dialog/appointment-dialog.component";
import {Appointment, employeeTask} from "@shared/sskinModel/booking.model"
import {FormBuilder, FormGroup} from "@angular/forms";
import {BookingService} from "./booking.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

interface TimeSlot {
  time: string;
}
interface gridCell {
  emptyContent: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule,MatDialogModule],
  providers:[BookingService],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent {

  timeSlots: TimeSlot[] = this.generateTimeSlots();
  gridMatrix:gridCell[] = this.generateGrid();
  staffTasks:employeeTask[];
  constructor(public dialog: MatDialog, private bookingService:BookingService) {
    this.staffTasks = this.bookingService.getAllEmployeeTasks()
  }
  //test data

  ngOnInit() {

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
        disableClose:true,
        data:{
          mode: "new",
          employeeId : employeeId,
          appointment : null
        }
      })
    appointmentEditDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  editAppointment(employeeId: string, appointment: Appointment){
      const appointmentEditDialog = this.dialog.open(AppointmentDialogComponent,
        {
          width:"900px",
          height:"600px",
          panelClass:"customAppointment",
          disableClose:true,
          data:{
            mode:"edit",
            employeeId : employeeId,
            appointment : appointment,
          }
        })
    appointmentEditDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  calculateHeight(appointments: Appointment[]):any {
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
  calculateAppointmentStyle(appointment: Appointment): any {

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
