import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TextToImage {
  
  private baseUrl = '/api/v1/tti';

  constructor(private http: HttpClient) {}

  findAll():Observable<TextToImage[]> {
    return this.http.get<TextToImage[]>(this.baseUrl);
  }

   findById(id: number): Observable<TextToImage> {
    return this.http.get<TextToImage>(`${this.baseUrl}/${id}`);
  }

  generateImage(prompt: string): Observable<TextToImage> {
    return this.http.post<TextToImage>(`${this.baseUrl}/generate`, { prompt });
  }

  setStatus(id: number, status: boolean): Observable<TextToImage> {
    const action = status ? 'activate' : 'deactivate';
    return this.http.patch<TextToImage>(`${this.baseUrl}/${action}/${id}`, null);
  }

}
