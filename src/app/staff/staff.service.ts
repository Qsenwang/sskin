import {Injectable} from "@angular/core";
import {ApiService} from "@shared/api/api.service";
import {Observable} from "rxjs";
import {
  CustomerBasicInfoDto,
  CustomerBundleDto,
  CustomerDetailDto, PackageAndPaymentDetailDto, StaffDto, TreatmentItemDto,
} from "@shared/sskinModel/sskinDto.model";
import {sskinWebApi} from "@shared/api/sskin-endpoints";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private apiService : ApiService) {
  }

  getAllStaff(): Observable<StaffDto[]> {
    const url = sskinWebApi.staffEndpoints.getAllStaff();
    return this.apiService.get<StaffDto[]>(url, {})
  }

  getStaff(staffId: string) {
    const url = sskinWebApi.staffEndpoints.getStaffById(staffId);
    return this.apiService.get<StaffDto>(url, {})
  }

  createNewStaff(staffData: StaffDto): Observable<any> {
    const url = sskinWebApi.staffEndpoints.newStaff();
    return this.apiService.post<StaffDto>(url, staffData, {});
  }

  updateStaff(staffId: string, staffData: StaffDto): Observable<any> {
    const url = sskinWebApi.staffEndpoints.updateStaff(staffId);
    return this.apiService.put<StaffDto>(url, staffData, {});
  }

  removeStaff(staffId: string) {
    const url = sskinWebApi.staffEndpoints.removeStaff(staffId);
    return this.apiService.delete(url);
  }

}
