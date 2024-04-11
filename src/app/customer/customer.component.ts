import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {CustomerDetailDto} from "@shared/sskinModel/sskinDto.model";
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
import {CustomerViewComponent} from "./customer-view/customer-view.component";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {CustomerCreateComponent} from "./customer-create/customer-create.component";

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
    NzIconModule,
    NzDividerComponent
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent  implements OnInit {

  customerList: CustomerDetailDto[] = [];
  filteredCustomers: CustomerDetailDto[] = [];

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private modalService: NzModalService) {
  }
  ngOnInit(): void {
    this.getAllCustomer();
  }

  getAllCustomer() {
    return this.customerService.getAllCustomer().subscribe({
      next: (data) => {
        this.customerList = data;
        this.filteredCustomers =  [...data];
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

  viewCustomer(customer: CustomerDetailDto) {
    const modal: any = this.modalService.create({
      nzTitle: '客户信息预览',
      nzContent: CustomerViewComponent,
      nzData: {
        customer: customer
      },
      nzWidth: 900,
      nzFooter: [{
        label: '关闭',
        type: 'primary',
        onClick: () => modal.destroy()
      }]
    });
  }

  editCustomer(customerId: string): void {
    this.router.navigate(['customer', customerId, 'edit']);
  }
  createNewCustomer(): void {
    const modalRef  = this.modalService.create({
      nzTitle: '创建新客戶',
      nzContent: CustomerCreateComponent,
      nzWidth: 600,
      nzFooter:null
    });
    const instance = modalRef.getContentComponent();
    instance.operationSuccess.subscribe((success) => {
      if (success) {
        this.getAllCustomer(); // 重新获取所有客户信息
      }
    });
  }
}
