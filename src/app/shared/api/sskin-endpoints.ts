import {dateTimestampProvider} from "rxjs/internal/scheduler/dateTimestampProvider";

export const sskinWebApi = {
  treatmentEndpoints: {
    getAllItems: () => `http://localhost:8080/treatment-item/all`,
    getItemById: (itemId: string) =>`http://localhost:8080/treatment-item/${itemId}`,
    updateItem: (itemId: string) =>`http://localhost:8080/treatment-item/${itemId}`,
    newItem: () =>`http://localhost:8080/treatment-item/new`,
    removeItem: (itemId: string) =>`http://localhost:8080/treatment-item/${itemId}`,
  },
  staffEndpoints:{
    getAllStaff: () => `http://localhost:8080/staff/all`,
    getStaffById: (staffId: string) =>`http://localhost:8080/staff/${staffId}`,
    updateStaff: (staffId: string) =>`http://localhost:8080/staff/${staffId}`,
    newStaff: () =>`http://localhost:8080/staff/new`,
    removeStaff: (staffId: string) =>`http://localhost:8080/staff/${staffId}`,
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
    getCustomerById: (customerId: string) =>`http://localhost:8080/customer/${customerId}`,
    updateCustomer: (customerId: string) =>`http://localhost:8080/customer/${customerId}`,
    newCustomer: () =>`http://localhost:8080/customer/new`,
    getBundlePackageById: (bundleId: string) =>`http://localhost:8080/customer/detail/bundlePackage/${bundleId}`,
    updateBundlePackage: (customerId: string, bundlePackageId: string) =>`http://localhost:8080/customer/${customerId}/detail/bundlePackage/${bundlePackageId}`,
    addNewBundlePackage: (customerId: string, bundlePackageId: string) =>`http://localhost:8080/customer/${customerId}/detail/bundlePackage/new`
  }
}
