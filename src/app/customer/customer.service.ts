import {Injectable} from "@angular/core";
import {ApiService} from "@shared/api/api.service";
import {Observable} from "rxjs";
import {
  AppointmentWithPaymentDto,
  CustomerBasicInfoDto,
  CustomerBundleDto,
  CustomerDetailDto, PackageAndPaymentDetailDto, TreatmentItemDto,
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
    const url = sskinWebApi.treatmentEndpoints.getAllItems();
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

  getCustomer(customerId: string) {
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

  getBundleDetail(bundleId: string) {
    const url = sskinWebApi.customerEndpoints.getBundlePackageById(bundleId);
    return this.apiService.get<PackageAndPaymentDetailDto>(url, {})
  }

  updateBundlePackage(bundlePackageData: PackageAndPaymentDetailDto): Observable<any> {
    const url = sskinWebApi.customerEndpoints.updateBundlePackage(bundlePackageData.customerId, bundlePackageData.id);
    return this.apiService.put(url, bundlePackageData, {});
  }
  addNewBundlePackage(bundlePackageData: PackageAndPaymentDetailDto): Observable<any> {
    const url = sskinWebApi.customerEndpoints.addNewBundlePackage(bundlePackageData.customerId);
    return this.apiService.post(url, bundlePackageData, {});
  }

  removeBundlePackage(bundleId: string){
    const url = sskinWebApi.customerEndpoints.removeBundlePackage(bundleId);
    return this.apiService.delete(url);
  }

  getCompletedAppointmentAndPayment(customerId: string) {
    const url = sskinWebApi.customerEndpoints.getCompletedAppointmentAndPayment(customerId);
    return this.apiService.get<AppointmentWithPaymentDto[]>(url, {})
  }

}
