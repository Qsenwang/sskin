// src/app/schedule/booking.service.ts

import { Injectable } from '@angular/core';
import {AppointmentDetailDto, staffDailyTaskDto} from "@shared/sskinModel/booking.model";
import {FormGroup} from "@angular/forms";
import {ApiService} from "@shared/api/api.service";
import {sskinWebApi} from "@shared/api/sskin-endpoints";
import {HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {dateTimestampProvider} from "rxjs/internal/scheduler/dateTimestampProvider";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private apiService : ApiService) {
  }

  getAllEmployeeTasks(date: string ): Observable<staffDailyTaskDto[]>{

    const url = sskinWebApi.bookingEndpoints.getDayTasks();
    const httpParams = new HttpParams().set('selectedDate', date)
    return this.apiService.get<staffDailyTaskDto[]>(url, {params: httpParams})
  }

  getAppointmentDetailById(appointmentId: string): Observable<AppointmentDetailDto> {
    const url = sskinWebApi.bookingEndpoints.getAppointmentDetail(appointmentId);
    const httpParams = new HttpParams( {
      fromObject: {appointmentId:appointmentId}
    })
    return this.apiService.get<AppointmentDetailDto>(url, {params: httpParams})
  }

  updateTask(form:FormGroup){
    console.warn(form.value)
  }

}
