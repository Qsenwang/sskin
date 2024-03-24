import {Injectable} from "@angular/core";
import {ApiService} from "@shared/api/api.service";
import {Observable} from "rxjs";
import {
  CustomerBundleDto,
  CustomerDto, TreatmentItemDto,
} from "@shared/sskinModel/sskinDto.model";
import {sskinWebApi} from "@shared/api/sskin-endpoints";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private apiService : ApiService) {
  }

  getAllTreatmentItems(): Observable<TreatmentItemDto[]> {
    const url = sskinWebApi.treatmentEndpoints.getAllTreatmentItems();
    return this.apiService.get<TreatmentItemDto[]>(url, {})
  }

  getAllCustomer(): Observable<CustomerDto[]> {
    const url = sskinWebApi.customerEndpoints.getAllCustomer();
    return this.apiService.get<CustomerDto[]>(url, {})
  }

  getCustomerBundles(customerId: string) {
    const url = sskinWebApi.customerEndpoints.getCustomerBundles(customerId);
    return this.apiService.get<CustomerBundleDto[]>(url, {})
  }

  getCustomerById(customerId: string) {
    const url = sskinWebApi.customerEndpoints.getCustomerById(customerId);
    return this.apiService.get<CustomerDto>(url, {})
  }

  updateCustomer(customerId: string, customerData: CustomerDto): Observable<any> {
    const url = sskinWebApi.customerEndpoints.updateCustomer(customerId);
    return this.apiService.put<CustomerDto>(url, customerData, {});
  }

}
