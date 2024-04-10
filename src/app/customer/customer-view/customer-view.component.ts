import {Component, Inject, inject, Input, OnInit} from '@angular/core';
import {CustomerDetailDto} from "@shared/sskinModel/sskinDto.model";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {NzDescriptionsComponent, NzDescriptionsItemComponent, NzDescriptionsSize} from "ng-zorro-antd/descriptions";
import {NzListComponent, NzListItemComponent} from "ng-zorro-antd/list";
import {NzTableComponent, NzTableModule} from "ng-zorro-antd/table";
import {NgForOf, NgIf} from "@angular/common";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";

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
  ],
  templateUrl: './customer-view.component.html',
  styleUrl: './customer-view.component.scss'
})
export class CustomerViewComponent implements OnInit{
  expandSet = new Set<string>();
  firstTime = "NO";
  constructor(@Inject(NZ_MODAL_DATA) public data: any) {}

  ngOnInit() {
    if(this.data.customer?.firstTime){
      this.firstTime="YES";
    }

  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }


}
