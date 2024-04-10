import {Injectable} from "@angular/core";
import {ApiService} from "@shared/api/api.service";
import {sskinWebApi} from "@shared/api/sskin-endpoints";
import {HttpParams} from "@angular/common/http";
import {RevenueDto, staffDailyTaskDto} from "@shared/sskinModel/sskinDto.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RevenueService {
  constructor(private apiService : ApiService) {
  }

  geRevenueByDateRange(startDate: string, endDate:string) {
    const url = sskinWebApi.revenueEndpoints.getRevenueByDateRange();
    const httpParams = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.apiService.get<RevenueDto>(url, {params: httpParams})
  }


}
