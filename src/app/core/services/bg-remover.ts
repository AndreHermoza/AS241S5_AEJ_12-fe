import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BgRemover {
  
  private baseUrl = '/api/v1/bgremover';

  constructor(private http: HttpClient) {}

  findAll(): Observable<BgRemover[]> {
    return this.http.get<BgRemover[]>(this.baseUrl);
  }

  findById(id: number): Observable<BgRemover> {
    return this.http.get<BgRemover>(`${this.baseUrl}/${id}`);
  }

  removeBackgroundFromFile(file: File): Observable<BgRemover> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<BgRemover>(`${this.baseUrl}/process`, formData);
  }

  setStatus(id: number, status: boolean): Observable<BgRemover> {
    const action = status ? 'activate' : 'deactivate';
    return this.http.patch<BgRemover>(`${this.baseUrl}/${action}/${id}`, null);
  }
}
