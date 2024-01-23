import { Component } from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {left} from "@popperjs/core";

interface TimeSlot {
  time: string;
}
interface gridCell {
  emptyContent: string;
}
interface Employee {
  id: number;
  name: string;
  appointments: Appointment[];
}
interface Appointment {
  startTime: string;
  endTime: string;
  overLap:boolean;
  layer:number;
}
@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent {
  //test data
  employees: Employee[] = [
    { id: 1, name: 'Employee 1', appointments: [{ startTime: '11:00', endTime: '13:00', overLap:true, layer: 0 },{ startTime: '12:15', endTime: '13:00', overLap:true, layer: 1 },{ startTime: '13:25', endTime: '15:30',overLap:false, layer: 0 }] },
    { id: 1, name: 'Employee 1', appointments: [{ startTime: '11:00', endTime: '13:00', overLap:true, layer: 0 },{ startTime: '12:15', endTime: '13:00', overLap:true, layer: 1 },{ startTime: '13:25', endTime: '15:30',overLap:false, layer: 2 }] },
  ];


  timeSlots: TimeSlot[] = this.generateTimeSlots();
  gridMatrix:gridCell[] = this.generateGrid();
  startTime: Number=10;
  endTime: Number=19;
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

  addAppointment(employee:Employee) {
    employee.appointments.push({startTime: '10:00', endTime: '10:19', overLap:false, layer: 0})
  }

  editAppointment(appointment: Appointment){
    //todo mnodalDialog
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
