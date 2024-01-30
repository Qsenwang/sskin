import {dateTimestampProvider} from "rxjs/internal/scheduler/dateTimestampProvider";

export const sskinWebApi = {
  bookingEndpoints:{
    getDayTasks: (date: string)=>`http://localhost:8080/booking/tasks/${date}`,
    getAppointmentDetail: (appointmentId: string)=>`http://localhost:8080/booking/appointment/${appointmentId}`,
  }
}
