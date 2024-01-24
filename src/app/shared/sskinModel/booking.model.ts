
  export interface employeeTask {
    employeeId: string;
    employeeName: string;
    appointments: Appointment[];
  }
  export interface Appointment {
    name: string,
    phone: string,
    treatmentItem: TreatMentItem,
    startTime: string;
    endTime: string;
    type: string,
    price: string,
    paymentMethod:string,
    employeeBonus: string,
    overLap: boolean;
    layer :number;
  }


  export interface TreatMentItem {
    id:string;
    name:string;

  }
