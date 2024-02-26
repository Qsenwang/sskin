import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {CustomerDto} from "@shared/sskinModel/sskinDto.model";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzListComponent, NzListItemComponent, NzListItemMetaComponent} from "ng-zorro-antd/list";
import {NgForOf, NgIf} from "@angular/common";
import {NzIconDirective, NzIconModule} from "ng-zorro-antd/icon";
import {CustomerService} from "./customer.service";
import {NzModalModule, NzModalService} from "ng-zorro-antd/modal";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {
  NzTableModule,
  NzTdAddOnComponent,
  NzThMeasureDirective,
  NzTrExpandDirective
} from "ng-zorro-antd/table";

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NzInputGroupComponent,
    NzListComponent,
    NzListItemComponent,
    NzListItemMetaComponent,
    NzInputDirective,
    NgForOf,
    NzIconDirective,
    NgIf,
    NzModalModule,
    NzButtonComponent,
    NzColDirective,
    NzRowDirective,
    NzTableModule,
    NzTrExpandDirective,
    NzTdAddOnComponent,
    NzThMeasureDirective,
    NzIconModule
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent  implements OnInit {

  customerList: CustomerDto[] = [];
  filteredCustomers: CustomerDto[] = [];
  expandSet = new Set<string>();

  constructor(
    private customerService: CustomerService,
    private router: Router) {}
  ngOnInit(): void {
    this.getAllCustomer();
  }

  getAllCustomer() {
    return this.customerService.getAllCustomer().subscribe({
      next: (data) => {
        // data.forEach((customer) => {
        //     const customerDto =
        //       {
        //         id: customer.id,
        //         name: customer.name,
        //         contactPhone: customer.contactPhone,
        //         customerNote: customer.customerNote,
        //         bundlePackages: customer.bundlePackages
        //       };
        //     this.customerList.push(customerDto);
        //     this.filteredCustomers.push(customerDto)
        //   }
        // );
        this.customerList = data;
        this.filteredCustomers = data;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  search(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.filteredCustomers = this.customerList.filter(customer =>
      customer.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // toggleExpand(customerId: string): void {
  //   this.expandedCustomerId = this.expandedCustomerId === customerId ? null : customerId;
  // }

  // editCustomer(customer: CustomerDto): void {
  //   const modal = this.modal.create({
  //     nzTitle: 'Edit Customer',
  //     nzContent: CustomerEditModalComponent,
  //     nzData: {
  //       customer: customer,
  //     },
  //     nzFooter: [
  //       {
  //         label: 'Cancel',
  //         onClick: () => this.modal.closeAll()
  //       },
  //       {
  //         label: 'Save',
  //         type: 'primary',
  //         onClick: () => this.saveCustomer()
  //       }
  //     ]
  //   });
  // }

  // saveCustomer(): void {
  //   // Implement save logic here
  //   this.modal.closeAll();
  // }




  editCustomer(customerId: string): void {
    this.router.navigate(['/customer', customerId, 'edit']);
  }

  onExpandChange(id: string, expanded: boolean): void {
    if (expanded) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

}
