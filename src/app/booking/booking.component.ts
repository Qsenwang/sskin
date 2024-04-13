import {Component, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from "@angular/common";

import {AppointmentDialogComponent} from "./appointment-dialog/appointment-dialog.component";
import {AppointmentBaseDto, staffDailyTaskDto} from "@shared/sskinModel/sskinDto.model"
import {BookingService} from "./booking.service";

import {Observable, of, Subscription} from "rxjs";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";

import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzColDirective} from "ng-zorro-antd/grid";

import {NzModalModule, NzModalService} from "ng-zorro-antd/modal";
import {NzButtonComponent} from "ng-zorro-antd/button";

interface TimeSlot {
  time: string;
}

interface gridCell {
  emptyContent: string;
  time: Date;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzDatePickerComponent,
    NzFormControlComponent,
    NzFormLabelComponent,
    NzFormItemComponent,
    NzColDirective,
    NzModalModule,
    NzButtonComponent,
  ],
  providers: [DatePipe],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {

  timeSlots = this.generateTimeSlots();
  gridMatrix = this.generateGrid()

  selectedDateControl = new FormControl('');
  staffTasks: Observable<staffDailyTaskDto[]> | any;
  _subscriptions: Subscription = new Subscription()
  selectedDate : Date | any;

  constructor(private modalService: NzModalService, private bookingService: BookingService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this._subscriptions.add(
      this.selectedDateControl.valueChanges.subscribe((newDate) => {
        if (newDate !== null) {
          this.fetchAppointmentInfoByDate(newDate)
          this.selectedDate = newDate;
        }
      })
    )
    this.selectedDateControl.setValue(new Date().toISOString());
  }

  fetchAppointmentInfoByDate(newDate: string | any) {
    let brisbaneTime = this.datePipe.transform(newDate, 'yyyy-MM-ddTHH:mm:ss.SSS', 'Australia/Brisbane');
    if (brisbaneTime !== null) {
      this.bookingService.getAllEmployeeTasks(brisbaneTime)
        .subscribe({
          next: (data) => {
            this.staffTasks = of(data);
          },
          error: (error) => {
            console.error("error")
          }
        })
    }
  }

  generateTimeSlots(): TimeSlot[] {
    const timeSlots: TimeSlot[] = [];
    for (let i = 10; i < 20; i++) {
      for (let j = 0; j < 60; j += 60) {
        const hours = i.toString().padStart(2, '0');
        const minutes = j.toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        timeSlots.push({time});
      }
    }
    return timeSlots;
  }

  generateGrid(): gridCell[] {
    // const matrix: gridCell[] = [];
    // for (let i = 10; i < 19; i++) {
    //   for (let j = 0; j < 60; j += 30) {
    //     const blank: string = "";
    //     matrix.push({emptyContent: blank});
    //   }
    // }
    // return matrix;

    const matrix: gridCell[] = [];
    const startDate = new Date(); // 假设今天开始
    startDate.setHours(10, 0, 0, 0); // 从早上10点开始

    for (let hour = 10; hour < 19; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const cellTime = new Date(startDate.getTime());
        cellTime.setHours(hour, min);
        const cell:gridCell = {
          emptyContent: "",
          time: cellTime
        };
        matrix.push(cell);
      }
    }
    return matrix;
  }

  isTimeSlotPast(cellTime: Date): boolean {
    const now = new Date();
    return cellTime < now || this.selectedDate<now;
  }

  addAppointment() {
    const modal = this.modalService.create({
      nzTitle: 'Appointment Info',
      nzContent: AppointmentDialogComponent,
      nzData: {
        staffId: null,
        appointmentId: null,
        customerId: null,
      },
      nzWidth: 1000,
      nzFooter: null
    });

    const instance = modal.getContentComponent();
    instance.saveSuccess.subscribe((success) => {
      if (success) {
        this.fetchAppointmentInfoByDate(this.selectedDateControl.value)
      }
    });
  }

  editAppointment(staffId: string, appointmentId: string, customerId: string) {
    const modal = this.modalService.create({
      nzTitle: 'Appointment Info',
      nzContent: AppointmentDialogComponent,
      nzStyle: {
        'min-width': '1000px',
        'background-color': '$color-base'
      },
      nzData: {
        staffId: staffId,
        appointmentId: appointmentId,
        customerId: customerId,
      },
      nzFooter: null
    });

    const instance = modal.getContentComponent();
    instance.saveSuccess.subscribe((success) => {
      if (success) {
        this.fetchAppointmentInfoByDate(this.selectedDateControl.value)
      }
    });

  }

  calculateHeight(appointments: AppointmentBaseDto[]): any {
    let maxLayer: number = 0;
    appointments.forEach((a) => {
      if (a.layer > maxLayer) {
        maxLayer = a.layer;
      }
    })
    const finalHeight = (maxLayer + 1) * 50;
    return {
      height: `${finalHeight}px`,
    }
  }

  calculateAppointmentStyle(appointment: AppointmentBaseDto): any {

    //employee name 120px, timeSlot 30min->75px
    const startTime = new Date(appointment.startTime);
    const endTime = new Date(appointment.endTime);

    // Extract hours and minutes from the Date objects
    const startHour = startTime.getHours();
    const startMin = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMin = endTime.getMinutes();

    const leftPos = 120 + (startHour - 10) * 150 + (startMin / 30) * 75;
    const width = (endHour * 60 + endMin - (startHour * 60 + startMin)) / 60 * 150;
    const topPos = appointment.layer * 50;

    return {
      left: `${leftPos}px`,
      top: `${topPos}px`,
      width: `${width}px`
    };

  }

  isInjection(appointment:AppointmentBaseDto){
    return appointment.type == "注射";
  }

  getCellClass(i: number): string {
    return 'slot-' + i;
  }
}
