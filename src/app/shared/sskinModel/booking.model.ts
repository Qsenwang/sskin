
  export interface staffDailyTaskDto {
    staffId: string;
    staffFirstName: string;
    appointmentBaseDtoList: AppointmentBaseDto[];
  }

  export interface AppointmentBaseDto {
    appointmentId: string;
    customerFirstName: string;
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
  }

  export interface StaffDto {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    onBoardDate: Date;
    offBoardDate: Date;
    active : boolean;
  }
  export interface CustomerDto {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    contactPhone: string;
    customerNote: string;
  }


