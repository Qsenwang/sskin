// src/app/schedule/booking.service.ts

import {Injectable} from '@angular/core';
import {
  AppointmentDetailDto, CustomerBundleDto,
  CustomerDetailDto,
  staffDailyTaskDto,
  StaffDto,
  TreatmentItemDto
} from "@shared/sskinModel/sskinDto.model";
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

  constructor(private apiService: ApiService) {
  }

  getAllEmployeeTasks(date: string): Observable<staffDailyTaskDto[]> {

    const url = sskinWebApi.bookingEndpoints.getDayTasks();
    const httpParams = new HttpParams().set('selectedDate', date)
    return this.apiService.get<staffDailyTaskDto[]>(url, {params: httpParams})
  }

  getAppointmentDetailById(appointmentId: string): Observable<AppointmentDetailDto> {
    const url = sskinWebApi.bookingEndpoints.getAppointmentDetail(appointmentId);
    const httpParams = new HttpParams({
      fromObject: {appointmentId: appointmentId}
    })
    return this.apiService.get<AppointmentDetailDto>(url, {params: httpParams})
  }

  getAllTreatmentItems(): Observable<TreatmentItemDto[]> {
    const url = sskinWebApi.treatmentEndpoints.getAllItems();
    return this.apiService.get<TreatmentItemDto[]>(url, {})
  }

  getAllStaff(): Observable<StaffDto[]> {
    const url = sskinWebApi.staffEndpoints.getAllStaff();
    return this.apiService.get<StaffDto[]>(url, {})
  }

  getAllCustomer(): Observable<CustomerDetailDto[]> {
    const url = sskinWebApi.customerEndpoints.getAllCustomer();
    return this.apiService.get<CustomerDetailDto[]>(url, {})
  }

  getCustomerBundles(customerId: string) {
    const url = sskinWebApi.customerEndpoints.getCustomerBundles(customerId);
    return this.apiService.get<CustomerBundleDto[]>(url, {})
  }

  updateAppointment(appointmentId: string, appointmentData: AppointmentDetailDto) {
    const url = sskinWebApi.bookingEndpoints.updateAppointment(appointmentId);
    return this.apiService.put<string>(url, appointmentData, {})
  }

  newAppointment(appointmentData: AppointmentDetailDto) {
    const url = sskinWebApi.bookingEndpoints.newAppointment();
    return this.apiService.post<string>(url, appointmentData, {})
  }

  removeAppointment(appointmentId: string){
    const url = sskinWebApi.bookingEndpoints.removeAppointment(appointmentId);
    return this.apiService.delete(url)
  }

}
