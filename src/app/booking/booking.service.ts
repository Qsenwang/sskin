// src/app/schedule/booking.service.ts

import { Injectable } from '@angular/core';
import {employeeTask} from "@shared/sskinModel/booking.model";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  task1: employeeTask = {
    employeeId:"1",
    employeeName: 'Employee 1',
    appointments: [
      {
        name:"a1",
        phone:"11111111",
        treatmentItem:{id:"1",name:"t1"},
        startTime: '11:00',
        endTime: '13:00',
        type:"type",
        price:"100",
        paymentMethod:"card",
        employeeBonus: "5",
        overLap:true,
        layer: 0 },
    ]
  };

  task2 : employeeTask ={
    employeeId:"2",
    employeeName: 'Employee 2',
    appointments: [
      {
        name:"a2",
        phone:"2222222",
        treatmentItem:{id:"1",name:"t1"},
        startTime: '12:00',
        endTime: '14:00',
        type:"type",
        price:"200",
        paymentMethod:"card",
        employeeBonus: "5",
        overLap:true,
        layer: 0 },
    ]
  }
  getAllEmployeeTasks() {
    return  [this.task1,this.task2];

  }

  updateTask(form:FormGroup){
    console.warn(form.value)
  }

}
