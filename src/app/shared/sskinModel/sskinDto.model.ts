
  export interface staffDailyTaskDto {
    staffId: string;
    staffName: string;
    appointmentBaseDtoList: AppointmentBaseDto[];
  }

  export interface AppointmentBaseDto {
    appointmentId: string;
    customerId: string;
    customerName: string;
    treatmentName: string;
    startTime: Date;
    endTime: Date;
    overLap: string;
    layer :number;
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
    paymentMethod:string;
    staffId:string;
    staffBonus: string;
    overLap: boolean;
    layer :number;
  }

  export interface TreatmentItemDto {
    id: string;
    name: string;
    standardPrice: number;
    itemNote: string;
    active : boolean;
  }

  export interface StaffDto {
    id: string;
    name: string;
    onBoardDate: Date;
    offBoardDate: Date;
    active : boolean;
  }
  export interface CustomerDto {
    id: string;
    name: string;
    contactPhone: string;
    customerNote: string;
    bundlePackages: CustomerBundleDto[];
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
    packageDetailList: PackageDetailList[];
    active: boolean;
  }

  export interface PackageDetailList {
    id: string;
    treatmentItemId: TreatmentItemDto;
    treatmentItem: string;
    remainCount: number;
    active: boolean;
}




