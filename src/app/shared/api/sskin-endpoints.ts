import {dateTimestampProvider} from "rxjs/internal/scheduler/dateTimestampProvider";

export const sskinWebApi = {
  bookingEndpoints:{
    getDayTasks: (date: string)=>`http://localhost:4200/booking/tasks/${date}`,
    getAppointmentDetail: (appointmentId: string)=>`http://localhost:4200/booking/appointment/${appointmentId}`,
  }
}
