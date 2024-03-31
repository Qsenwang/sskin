import {Injectable} from "@angular/core";
import {ApiService} from "@shared/api/api.service";
import {Observable} from "rxjs";
import {
  CustomerBasicInfoDto,
  CustomerBundleDto,
  CustomerDetailDto, TreatmentItemDto,
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

  getAllCustomer(): Observable<CustomerDetailDto[]> {
    const url = sskinWebApi.customerEndpoints.getAllCustomer();
    return this.apiService.get<CustomerDetailDto[]>(url, {})
  }

  getCustomerBundles(customerId: string) {
    const url = sskinWebApi.customerEndpoints.getCustomerBundles(customerId);
    return this.apiService.get<CustomerBundleDto[]>(url, {})
  }

  getCustomerById(customerId: string) {
    const url = sskinWebApi.customerEndpoints.getCustomerById(customerId);
    return this.apiService.get<CustomerDetailDto>(url, {})
  }

  updateCustomer(customerId: string, customerData: CustomerDetailDto): Observable<any> {
    const url = sskinWebApi.customerEndpoints.updateCustomer(customerId);
    return this.apiService.put<CustomerDetailDto>(url, customerData, {});
  }

  createNewCustomer(customerData: CustomerBasicInfoDto): Observable<any> {
    const url = sskinWebApi.customerEndpoints.newCustomer();
    return this.apiService.post<CustomerDetailDto>(url, customerData, {});
  }

}
