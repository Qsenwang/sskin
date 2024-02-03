import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get<T>(url: string,
         options: {
           headers?: HttpHeaders,
           observe?: 'body',
           params?: HttpParams,
           reportProgress?: boolean,
           responseType?: 'json',
           withCredentials?: boolean
         }): Observable<T>{
    options = options || {};
    return this.http.get<T> (url, options);
  }

  post<T>(url: string,
          data: any|null,
          options: {
            headers?: HttpHeaders,
            observe?: 'body',
            params?: HttpParams,
            reportProgress?: boolean,
            responseType?: 'json',
            withCredentials?: boolean }) : Observable<T>{
    options = options || {}
    return this.http.post<T>(url, data, options)
  }

  put<T>(url: string,
          data: any|null,
          options: {
            headers?: HttpHeaders,
            observe?: 'body',
            params?: HttpParams,
            reportProgress?: boolean,
            responseType?: 'json',
            withCredentials?: boolean }) : Observable<T>{
    options = options || {}
    return this.http.put<T>(url, JSON.stringify(data), options)
  }

  delete(url: string): Observable<any>{
    return this.http.delete(url,{})
  }
  getForBlob(url: string): Observable<any>{
    return this.http.get(url,{responseType:'blob'})
  }
  getForDownload(url: string): Observable<any>{
    return this.http.get(url,{responseType:'arraybuffer'})
  }
  getForDownloadWithResponse(url: string): Observable<any>{
    return this.http.get(url,{responseType:'arraybuffer', observe: 'response'})
  }
}
