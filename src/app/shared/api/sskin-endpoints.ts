import {dateTimestampProvider} from "rxjs/internal/scheduler/dateTimestampProvider";

export const sskinWebApi = {
  treatmentEndpoints: {
    getAllItems: () => `http://localhost:8080/treatment-item/all`,
    getItemById: (itemId: string) => `http://localhost:8080/treatment-item/${itemId}`,
    updateItem: (itemId: string) => `http://localhost:8080/treatment-item/${itemId}`,
    newItem: () => `http://localhost:8080/treatment-item/new`,
    removeItem: (itemId: string) => `http://localhost:8080/treatment-item/${itemId}`,
  },
  staffEndpoints: {
    getAllStaff: () => `http://localhost:8080/staff/all`,
    getStaffById: (staffId: string) => `http://localhost:8080/staff/${staffId}`,
    updateStaff: (staffId: string) => `http://localhost:8080/staff/${staffId}`,
    newStaff: () => `http://localhost:8080/staff/new`,
    removeStaff: (staffId: string) => `http://localhost:8080/staff/${staffId}`,
  },
  bookingEndpoints: {
    getDayTasks: () => `http://localhost:8080/booking/summary`,
    getAppointmentDetail: (appointmentId: string) => `http://localhost:8080/booking/appointment/${appointmentId}`,
    updateAppointment: (appointmentId: string) => `http://localhost:8080/booking/appointment/${appointmentId}`,
    newAppointment: () => `http://localhost:8080/booking/appointment/new`,
    removeAppointment: (appointmentId: string) => `http://localhost:8080/booking/appointment/${appointmentId}`,
    completeAndNormalPay: (appointmentId: string) => `http://localhost:8080/booking/appointment/${appointmentId}/complete/normal-pay`,
    getPaymentById: (appointmentId: string, paymentId: string) => `http://localhost:8080/booking/appointment/${appointmentId}/payment/${paymentId}`,
    completeAndPayByBundle: (appointmentId: string) => `http://localhost:8080/booking/appointment/${appointmentId}/complete/bundle`,
    getBundleById: (bundleId: string) => `http://localhost:8080/booking/appointment/bundle/${bundleId}`,
  },
  customerEndpoints: {
    getAllTreatmentItems: () => `http://localhost:8080/treatment-item/all`,
    getAllCustomer: () => `http://localhost:8080/customer/all`,
    getCustomerBundles: (customerId: string) => `http://localhost:8080/customer/${customerId}/bundles`,
    getActiveCustomerBundles: (customerId: string) => `http://localhost:8080/customer/${customerId}/bundles/active`,
    getCustomerById: (customerId: string) => `http://localhost:8080/customer/${customerId}`,
    updateCustomer: (customerId: string) => `http://localhost:8080/customer/${customerId}`,
    newCustomer: () => `http://localhost:8080/customer/new`,
    getBundlePackageById: (bundleId: string) => `http://localhost:8080/customer/detail/bundlePackage/${bundleId}`,
    updateBundlePackage: (customerId: string, bundlePackageId: string) => `http://localhost:8080/customer/${customerId}/detail/bundlePackage/${bundlePackageId}`,
    addNewBundlePackage: (customerId: string) => `http://localhost:8080/customer/${customerId}/detail/bundlePackage/new`,
    removeBundlePackage: (bundleId: string) => `http://localhost:8080/customer/detail/bundlePackage/${bundleId}`,
  }
}
