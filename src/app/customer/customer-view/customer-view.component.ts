import {Component, Inject, inject, Input, OnInit} from '@angular/core';
import {AppointmentWithPaymentDto, CustomerBundleDto, CustomerDetailDto} from "@shared/sskinModel/sskinDto.model";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {NzDescriptionsComponent, NzDescriptionsItemComponent, NzDescriptionsSize} from "ng-zorro-antd/descriptions";
import {NzListComponent, NzListItemComponent} from "ng-zorro-antd/list";
import {NzTableModule} from "ng-zorro-antd/table";
import {NgForOf, NgIf} from "@angular/common";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {CustomerService} from "../customer.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {FormsModule} from "@angular/forms";

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
    NzSwitchModule,
    FormsModule,
  ],
  templateUrl: './customer-view.component.html',
  styleUrl: './customer-view.component.scss'
})
export class CustomerViewComponent implements OnInit {
  expandSet = new Set<string>();
  appointmentPaymentHistoryList: AppointmentWithPaymentDto[] | any;
  availableBundleOnly: boolean = false;
  customer: CustomerDetailDto | any;
  bundleList: CustomerBundleDto[] | any;
  filteredBdunleList: CustomerBundleDto[] | any;

  constructor(@Inject(NZ_MODAL_DATA) public data: any,
              private customerService: CustomerService,
              private message: NzMessageService) {
  }

  ngOnInit() {
    this.customer = this.data.customer;
    this.bundleList = this.data.customer.bundlePackages;
    this.filteredBdunleList = [...this.bundleList];
    this.filterBundles(this.availableBundleOnly)

    this.customerService.getCompletedAppointmentAndPayment(this.data.customer.id).subscribe({
      next: (data) => {
        this.appointmentPaymentHistoryList = data.map((item) => ({
          ...item,
          startTime: item.startTime.toString().replace('T', ' '),
          endTime: item.endTime.toString().replace('T', ' ')
        }));
      },
      error: (error) => {
        this.message.error(error)
      }
    })

  }

  filterBundles (availableOnly: boolean) {
    if(this.availableBundleOnly){
      this.filteredBdunleList =  [...this.bundleList]
        .filter((bundle: CustomerBundleDto) => bundle.active)
        .sort((a: CustomerBundleDto, b: CustomerBundleDto) => {return b.purchaseDate.getTime() -a.purchaseDate.getTime()});
    } else {
      this.filteredBdunleList =  [...this.bundleList].sort((a: CustomerBundleDto, b: CustomerBundleDto) => {
        // 将 purchaseDate 转换为 Date 对象进行比较
        return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
      });
    }
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  toogleExapnd(id: string) {
    if (this.expandSet.has(id)) {
      this.expandSet.delete(id);
    } else {
      this.expandSet.add(id);
    }
  }

}
