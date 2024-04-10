import {Component, Inject, inject, Input, OnInit} from '@angular/core';
import {AppointmentWithPaymentDto, CustomerDetailDto} from "@shared/sskinModel/sskinDto.model";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {NzDescriptionsComponent, NzDescriptionsItemComponent, NzDescriptionsSize} from "ng-zorro-antd/descriptions";
import {NzListComponent, NzListItemComponent} from "ng-zorro-antd/list";
import {NzTableComponent, NzTableModule} from "ng-zorro-antd/table";
import {NgForOf, NgIf} from "@angular/common";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {CustomerService} from "../customer.service";
import {of} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";

class IModalData {
}

@Component({
  selector: 'app-customer-view',
  standalone: true,
  imports: [
    NzDescriptionsItemComponent,
    NzDescriptionsComponent,
    NzListComponent,
    NzListItemComponent,
    NzTableModule,
    NgForOf,
    NzColDirective,
    NzRowDirective,
    NgIf,
    NzDividerComponent,
  ],
  templateUrl: './customer-view.component.html',
  styleUrl: './customer-view.component.scss'
})
export class CustomerViewComponent implements OnInit{
  expandSet = new Set<string>();
  appointmentPaymentHistoryList:AppointmentWithPaymentDto[] |any;
  constructor(@Inject(NZ_MODAL_DATA) public data: any,
              private customerService: CustomerService,
              private message: NzMessageService) {}

  ngOnInit() {
      this.customerService.getCompletedAppointmentAndPayment(this.data.customer.id).subscribe({
          next:(data)=>{
            this.appointmentPaymentHistoryList = data;
          },
        error: (error)=>{
            this.message.error(error)
        }
      })

  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }


}
