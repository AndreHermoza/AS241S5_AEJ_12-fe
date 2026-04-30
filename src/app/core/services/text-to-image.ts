import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TextToImageModel } from '../models/text-to-image';

@Injectable({
  providedIn: 'root',
})
export class TextToImage {
 private baseUrl = '/api/v1/tti';

  constructor(private http: HttpClient) {}

  findAll(): Observable<TextToImageModel[]> {
    return this.http.get<TextToImageModel[]>(this.baseUrl);
  }

  findById(id: number): Observable<TextToImageModel> {
    return this.http.get<TextToImageModel>(`${this.baseUrl}/${id}`);
  }

  generateImage(prompt: string): Observable<TextToImageModel> {
    return this.http.post<TextToImageModel>(`${this.baseUrl}/generate`, { prompt });
  }

  setStatus(id: number, status: boolean): Observable<TextToImageModel> {
    const action = status ? 'activate' : 'deactivate';
    return this.http.patch<TextToImageModel>(`${this.baseUrl}/${action}/${id}`, null);
  }
}
