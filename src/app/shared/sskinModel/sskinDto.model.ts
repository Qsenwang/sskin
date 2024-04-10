export interface staffDailyTaskDto {
  staffId: string;
  staffName: string;
  appointmentBaseDtoList: AppointmentBaseDto[];
}

export interface AppointmentBaseDto {
  appointmentId: string;
  customerId: string;
  customerName: string;
  firstTimeAppointment: boolean;
  treatmentName: string;
  startTime: Date;
  endTime: Date;
  overLap: string;
  layer: number;
  type:string;
}

export interface AppointmentDetailDto {
  appointmentId: string;
  customerId: string;
  phone: string;
  treatmentItemId: string;
  startTime: Date;
  endTime: Date;
  type: string;
  charge: string;
  firstTimeAppointment: boolean;
  staffId: string;
  overLap: boolean;
  layer: number;
  appointmentNote: string;
  paymentId: string;
  complete: boolean;
  paymentBundle: string; //paid bundle id
}

export interface TreatmentItemDto {
  id: string;
  name: string;
  standardPrice: number;
  itemNote: string;
  active: boolean;
}

export interface StaffDto {
  id: string;
  name: string;
  onBoardDate: Date;
  offBoardDate: Date;
  active: boolean;
}

export interface CustomerBasicInfoDto {
  id: string;
  name: string;
  contactPhone: string;
  customerNote: string;
  active: boolean;
}

export interface CustomerDetailDto {
  id: string;
  name: string;
  contactPhone: string;
  customerNote: string;
  bundlePackages: CustomerBundleDto[] | null;
  active: boolean;
}

export interface CustomerBundleDto {
  id: string;
  bundlePackageName: string;
  purchaseDate: Date;
  bundleValue: string;
  bundleNote: string;
  customerId: string;
  paymentId: string;
  packageDetailList: PackageDetailDto[] | null;
  active: boolean;
}

export interface PackageDetailDto {
  id: string;
  treatmentItem: TreatmentItemDto;
  treatmentItemId: string;
  remainCount: number;
  bundlePackageId: string;
  active: boolean;
}

export interface PackageAndPaymentDetailDto {
  id: string;
  bundlePackageName: string;
  purchaseDate: Date;
  bundleValue: string;
  bundleNote: string;
  customerId: string;
  paymentId: string;
  packageDetailList: PackageDetailDto[] | null;
  active: boolean;
  paymentDetail: PaymentDto;

}

export interface PaymentDto {
  id: string;
  cash: string;
  card: string;
  transfer: string;
  membershipCard: string;
  insurance: string;
  rmb: string;
  paymentDate: Date;
  paymentFor: string;
}

export interface RevenueDto {
  totalAppointmentPayments: string;
  totalBundlePayments: string;

  dailyTotalAppointmentPayments: { [key: string]: string }; // 或者 { [key: string]: string } 如果您想保留精确的小数
  dailyTotalBundlePayments: { [key: string]: string }; // 同上

  appointmentPayments: AppointmentPayment[];
  bundlePayments: BundlePayment[];
}

export interface AppointmentPayment {
  id: string;
  cash: string;
  card: string;
  transfer: string;
  membershipCard: string;
  insurance: string;
  rmb: string;
  paymentDate: Date;
  paymentFor: string;

  appointmentId: string;
  customerId: string;
  treatmentId: string;
  appointmentCharge: string;
}

export interface BundlePayment {
  id: string;
  cash: string;
  card: string;
  transfer: string;
  membershipCard: string;
  insurance: string;
  rmb: string;
  paymentDate: Date;
  paymentFor: string;

  bundleId: string;
  customerId: string;
  purchasePurchaseDate: Date;
  bundleValue: string;
}
