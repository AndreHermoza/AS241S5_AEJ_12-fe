import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
  duration: number;
  createdAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private nextId = 0;

  private addToast(type: ToastType, title: string, options?: { description?: string; duration?: number }) {
    const toast: Toast = {
      id: this.nextId++,
      type,
      title,
      description: options?.description,
      duration: options?.duration ?? 4000,
      createdAt: Date.now(),
    };
    this.toasts.update(list => [...list, toast]);
    if (toast.duration > 0) {
      setTimeout(() => this.remove(toast.id), toast.duration);
    }
  }

  success(title: string, options?: { description?: string; duration?: number }) {
    this.addToast('success', title, options);
  }

  error(title: string, options?: { description?: string; duration?: number }) {
    this.addToast('error', title, options);
  }

  warning(title: string, options?: { description?: string; duration?: number }) {
    this.addToast('warning', title, options);
  }

  info(title: string, options?: { description?: string; duration?: number }) {
    this.addToast('info', title, options);
  }

  remove(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
