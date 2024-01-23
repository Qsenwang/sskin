// src/app/schedule/schedule.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private timeSlots: string[] = [];
  private employees: string[] = [];
  private scheduleData: any[][] = [];

  constructor() {
    this.timeSlots = this.generateTimeSlots();
    this.employees = this.getEmployeeNames();
    this.scheduleData = this.generateScheduleData();
  }

  generateTimeSlots(): string[] {
    // Generate time slots from 10:00 to 18:00 with half-hour intervals
    const timeSlots = [];
    for (let i = 10; i <= 18; i++) {
      timeSlots.push(`${i}:00`);
      timeSlots.push(`${i}:30`);
    }
    return timeSlots;
  }

  getEmployeeNames(): string[] {
    // You can fetch employee names from your API or hardcode them
    return ['Employee 1', 'Employee 2'];
  }

  generateScheduleData(): any[][] {
    // Mock schedule data for demonstration purposes
    const scheduleData = [];
    for (let i = 0; i < this.employees.length; i++) {
      const employeeSchedule = [];
      for (let j = 0; j < this.timeSlots.length; j++) {
        // Mock data for appointments (start and end times)
        const appointment = Math.random() > 0.7 ? 'Appointment' : null;
        employeeSchedule.push(appointment);
      }
      scheduleData.push(employeeSchedule);
    }
    return scheduleData;
  }

  // You can add more methods to handle CRUD operations or data fetching
}
