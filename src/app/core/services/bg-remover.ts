import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BgRemoverModel } from '../models/bg-remover';

@Injectable({
  providedIn: 'root',
})
export class BgRemover {
  
 private baseUrl = '/api/v1/bgremover';

  constructor(private http: HttpClient) {}

  findAll(): Observable<BgRemoverModel[]> {
    return this.http.get<BgRemoverModel[]>(this.baseUrl);
  }

  findById(id: number): Observable<BgRemoverModel> {
    return this.http.get<BgRemoverModel>(`${this.baseUrl}/${id}`);
  }

  removeBackgroundFromFile(file: File): Observable<BgRemoverModel> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<BgRemoverModel>(`${this.baseUrl}/process`, formData);
  }

  setStatus(id: number, status: boolean): Observable<BgRemoverModel> {
    const action = status ? 'activate' : 'deactivate';
    return this.http.patch<BgRemoverModel>(`${this.baseUrl}/${action}/${id}`, null);
  }
}
