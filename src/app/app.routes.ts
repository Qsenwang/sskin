import { Routes } from '@angular/router';
import {CustomerComponent} from "./customer/customer.component";
import {InventoryComponent} from "./inventory/inventory.component";
import {RevenueComponent} from "./revenue/revenue.component";
import {StaffComponent} from "./staff/staff.component";
import {SummaryComponent} from "./summary/summary.component";
import {TreatmentComponent} from "./treatment/treatment.component";
import {BookingComponent} from "./booking/booking.component";
import {CustomerEditComponent} from "./customer/customer-edit/customer-edit.component";


export const routes: Routes = [
  {path:'',  redirectTo: '/booking', pathMatch: 'full'},
  {path:'booking', component:BookingComponent},
  {path:'summary', component:SummaryComponent},
  {path:'customer', component:CustomerComponent},
  {path:'staff', component:StaffComponent},
  {path:'treatment', component:TreatmentComponent},
  // {path:'inventory', component:InventoryComponent},
  {path:'revenue', component:RevenueComponent},
  {path:'customer/:customerId/edit', component:CustomerEditComponent},
  {path:'customer/newCustomer', component:CustomerEditComponent},
  {path: 'customer/**', redirectTo: '/customer'},
];
