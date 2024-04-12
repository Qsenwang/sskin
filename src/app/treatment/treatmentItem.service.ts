import {Injectable} from "@angular/core";
import {ApiService} from "@shared/api/api.service";
import {Observable} from "rxjs";
import {sskinWebApi} from "@shared/api/sskin-endpoints";
import {TreatmentItemDto, TreatmentItemTypeDto} from "@shared/sskinModel/sskinDto.model";

@Injectable({
  providedIn: 'root'
})
export class TreatmentItemService{

  constructor(private apiService : ApiService) {
  }

  getAllItems(): Observable<TreatmentItemDto[]> {
    const url = sskinWebApi.treatmentEndpoints.getAllItems();
    return this.apiService.get<TreatmentItemDto[]>(url, {})
  }

  getItem(itemId: string) {
    const url = sskinWebApi.treatmentEndpoints.getItemById(itemId);
    return this.apiService.get<TreatmentItemDto>(url, {})
  }

  createNewItem(itemData: TreatmentItemDto): Observable<any> {
    const url = sskinWebApi.treatmentEndpoints.newItem();
    return this.apiService.post<TreatmentItemDto>(url, itemData, {});
  }

  updateItem(itemId: string, itemData: TreatmentItemDto): Observable<any> {
    const url = sskinWebApi.treatmentEndpoints.updateItem(itemId);
    return this.apiService.put<TreatmentItemDto>(url, itemData, {});
  }

  removeItem(itemId: string) {
    const url = sskinWebApi.treatmentEndpoints.removeItem(itemId);
    return this.apiService.delete(url);
  }

  getAllItemTypes() {
    const url = sskinWebApi.treatmentEndpoints.allItemTypes();
    return this.apiService.get<TreatmentItemTypeDto[]>(url, {})
  }

  updateType(id: string, data: TreatmentItemTypeDto) {
    const url = sskinWebApi.treatmentEndpoints.updateType(id);
    return this.apiService.put<TreatmentItemTypeDto>(url, data, {});
  }
  addNewType(data: TreatmentItemTypeDto) {
    const url = sskinWebApi.treatmentEndpoints.addNewType();
    return this.apiService.post<TreatmentItemTypeDto>(url, data, {});
  }

}
