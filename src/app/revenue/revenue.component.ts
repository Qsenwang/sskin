import {Component, OnInit} from '@angular/core';
import {NzDatePickerModule, NzRangePickerComponent} from "ng-zorro-antd/date-picker";
import {FormsModule} from "@angular/forms";
import {RevenueService} from "./revenue.service";
import moment from "moment/moment";
import {RevenueDto} from "@shared/sskinModel/sskinDto.model";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzTransitionPatchDirective} from "ng-zorro-antd/core/transition-patch/transition-patch.directive";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NgForOf} from "@angular/common";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {
  NzTableCellDirective,
  NzTableComponent,
  NzTbodyComponent,
  NzTheadComponent,
  NzThMeasureDirective, NzTrDirective
} from "ng-zorro-antd/table";
import {NzDescriptionsComponent, NzDescriptionsItemComponent} from "ng-zorro-antd/descriptions";

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [
    NzDatePickerModule,
    FormsModule,
    NzButtonModule,
    NgForOf,
    NzDividerComponent,
    NzTableCellDirective,
    NzTableComponent,
    NzTbodyComponent,
    NzThMeasureDirective,
    NzTheadComponent,
    NzTrDirective,
    NzDescriptionsComponent,
    NzDescriptionsItemComponent
  ],
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.scss'
})
export class RevenueComponent implements OnInit {
  revenue: RevenueDto | any;
  startDate:Date;
  endDate:Date;

  constructor(private revenueService: RevenueService,
              private message: NzMessageService) {
    this.startDate = new Date();
    this.endDate = new Date();
  }

  ngOnInit() {
    this.fetchRevenue();


  }

  fetchRevenue(){
    let startDateTime = moment(this.startDate).format('YYYY-MM-DDT00:00:00');
    let endDateTime = moment(this.endDate).format('YYYY-MM-DDT23:59:59');
    this.revenueService.geRevenueByDateRange(startDateTime, endDateTime).subscribe({
      next: (revenue) => {
        this.revenue = revenue;
      },
      error: (error) => {
        this.message.error(error)
      },
    })
}



}
