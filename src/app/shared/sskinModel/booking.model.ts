
  export interface staffDailyTaskDto {
    staffId: number;
    staffFirstName: string;
    appointmentBaseDtoList: AppointmentBaseDto[];
  }

  export interface AppointmentBaseDto {
    appointmentId:string;
    customerFirstName: string,
    treatmentName: string,
    startTime: Date;
    endTime: Date;
    overLap: string;
    layer :number;
  }
  export interface AppointmentDetailDto {
    appointmentId:string;
    customerName: string,
    phone: string,
    treatItem: treatItemDto,
    startTime: Date;
    endTime: Date;
    type: string,
    price: string,
    paymentMethod:string,
    staffBonus: string,
    overLap: boolean;
    layer :number;
  }

  export interface treatItemDto {
    id:string;
    name:string;

  }
