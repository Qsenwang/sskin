
  export interface staffDailyTaskDto {
    employeeId: string;
    employeeName: string;
    appointments: AppointmentBaseDto[];
  }

  export interface AppointmentBaseDto {
    appointmentId:string;
    customerName: string,
    serviceName: string,
    startTime: string;
    endTime: string;
    overLap: boolean;
    layer :number;
  }
  export interface AppointmentDetailDto {
    appointmentId:string;
    customerName: string,
    phone: string,
    treatItem: treatItemDto,
    startTime: string;
    endTime: string;
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
