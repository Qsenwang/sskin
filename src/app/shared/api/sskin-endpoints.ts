import {dateTimestampProvider} from "rxjs/internal/scheduler/dateTimestampProvider";

export const sskinWebApi = {
  bookingEndpoints:{
    getDayTasks: ()=>`http://localhost:8080/booking/summary`,
    getAppointmentDetail: (appointmentId: string)=>`http://localhost:8080/booking/appointment/${appointmentId}`,
  }
}
