import {dateTimestampProvider} from "rxjs/internal/scheduler/dateTimestampProvider";

export const sskinWebApi = {
  bookingEndpoints:{
    getDayTasks: ()=>`http://localhost:8080/booking/summary`,
    getAppointmentDetail: (appointmentId: string)=>`http://localhost:8080/booking/appointment/${appointmentId}`,
    getAllTreatmentItems: () => `http://localhost:8080/booking/all-treatmentItems`,
    getAllStaff: () => `http://localhost:8080/booking/all-staff`,
    getAllCustomer: () => `http://localhost:8080/booking/all-customer`,
    saveAppointment: () => `http://localhost:8080/booking/staff/{staffId}/appointment/{appointmentId}`,
  }
}
