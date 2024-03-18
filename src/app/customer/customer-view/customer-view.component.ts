import {Component, Inject, inject, Input, OnInit} from '@angular/core';
import {CustomerDto} from "@shared/sskinModel/sskinDto.model";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {NzDescriptionsComponent, NzDescriptionsItemComponent, NzDescriptionsSize} from "ng-zorro-antd/descriptions";
import {NzListComponent, NzListItemComponent} from "ng-zorro-antd/list";
import {NzTableComponent, NzTableModule} from "ng-zorro-antd/table";
import {NgForOf} from "@angular/common";

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
  ],
  templateUrl: './customer-view.component.html',
  styleUrl: './customer-view.component.scss'
})
export class CustomerViewComponent implements OnInit{
  constructor(@Inject(NZ_MODAL_DATA) public data: any) {}

  ngOnInit(): void {
  }


}
