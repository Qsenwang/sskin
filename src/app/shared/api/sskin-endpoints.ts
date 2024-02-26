import {dateTimestampProvider} from "rxjs/internal/scheduler/dateTimestampProvider";

export const sskinWebApi = {
  treatmentEndpoints: {
    getAllTreatmentItems: () => `http://localhost:8080/treatmentItems/all`,
  },
  staffEndpoints:{
    getAllStaff: () => `http://localhost:8080/staff/all`,
  },
  bookingEndpoints:{
    getDayTasks: ()=>`http://localhost:8080/booking/summary`,
    getAppointmentDetail: (appointmentId: string)=>`http://localhost:8080/booking/appointment/${appointmentId}`,
    // saveAppointment: () => `http://localhost:8080/booking/staff/{staffId}/appointment/{appointmentId}`,
  },
  customerEndpoints:{
    getAllTreatmentItems: () => `http://localhost:8080/treatment-item/all`,
    getAllCustomer: () => `http://localhost:8080/customer/all`,
    getCustomerBundles: (customerId: string) =>`http://localhost:8080/customer/${customerId}/bundles`,
  }
}
