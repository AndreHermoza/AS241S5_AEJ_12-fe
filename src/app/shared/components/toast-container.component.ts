import { Component, inject } from '@angular/core';
import { ToastService, Toast } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [],
  template: `
    <div class="toast-wrapper">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-card" [attr.data-type]="toast.type">
          <!-- Icon -->
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
                  <path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon-check"/>
                </svg>
              }
              @case ('error') {
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
                  <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="icon-x"/>
                </svg>
              }
              @case ('warning') {
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 22h20L12 2z" fill="currentColor" opacity="0.15"/>
                  <path d="M12 9v4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                  <circle cx="12" cy="17" r="1" fill="currentColor"/>
                </svg>
              }
              @case ('info') {
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
                  <path d="M12 16v-4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                  <circle cx="12" cy="8" r="1" fill="currentColor"/>
                </svg>
              }
            }
          </div>

          <!-- Content -->
          <div class="toast-content">
            <p class="toast-title">{{ toast.title }}</p>
            @if (toast.description) {
              <p class="toast-desc">{{ toast.description }}</p>
            }
          </div>

          <!-- Close -->
          <button class="toast-close" (click)="toastService.remove(toast.id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <!-- Progress bar -->
          <div class="toast-progress">
            <div class="toast-progress-bar" [style.animation-duration.ms]="toast.duration"></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-wrapper {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 380px;
      max-width: calc(100vw - 2rem);
      pointer-events: none;
    }

    .toast-card {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem 1rem 1.25rem;
      border-radius: 1rem;
      background: rgba(22, 22, 55, 0.92);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.05) inset;
      position: relative;
      overflow: hidden;
      animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Type-specific accent glow */
    .toast-card[data-type="success"] { border-left: 3px solid #10b981; }
    .toast-card[data-type="error"]   { border-left: 3px solid #ef4444; }
    .toast-card[data-type="warning"] { border-left: 3px solid #f59e0b; }
    .toast-card[data-type="info"]    { border-left: 3px solid #3b82f6; }

    /* Icon */
    .toast-icon {
      flex-shrink: 0;
      width: 1.75rem;
      height: 1.75rem;
      margin-top: 0.125rem;
    }
    .toast-card[data-type="success"] .toast-icon { color: #10b981; }
    .toast-card[data-type="error"]   .toast-icon { color: #ef4444; }
    .toast-card[data-type="warning"] .toast-icon { color: #f59e0b; }
    .toast-card[data-type="info"]    .toast-icon { color: #3b82f6; }

    .icon-check {
      stroke-dasharray: 24;
      stroke-dashoffset: 24;
      animation: checkDraw 0.4s 0.15s ease forwards;
    }
    .icon-x {
      stroke-dasharray: 20;
      stroke-dashoffset: 20;
      animation: xDraw 0.3s 0.15s ease forwards;
    }

    /* Content */
    .toast-content { flex: 1; min-width: 0; }
    .toast-title {
      font-weight: 600;
      font-size: 0.9rem;
      color: #f1f5f9;
      margin: 0;
      line-height: 1.4;
    }
    .toast-desc {
      font-size: 0.8rem;
      color: #94a3b8;
      margin: 0.25rem 0 0;
      line-height: 1.4;
    }

    /* Close */
    .toast-close {
      flex-shrink: 0;
      width: 1.25rem;
      height: 1.25rem;
      padding: 0;
      background: none;
      border: none;
      cursor: pointer;
      color: #64748b;
      transition: color 0.2s;
      margin-top: 0.125rem;
    }
    .toast-close:hover { color: #f1f5f9; }

    /* Progress bar */
    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.05);
    }
    .toast-progress-bar {
      height: 100%;
      border-radius: 0 3px 0 0;
      animation: countdownBar linear forwards;
    }
    .toast-card[data-type="success"] .toast-progress-bar { background: #10b981; }
    .toast-card[data-type="error"]   .toast-progress-bar { background: #ef4444; }
    .toast-card[data-type="warning"] .toast-progress-bar { background: #f59e0b; }
    .toast-card[data-type="info"]    .toast-progress-bar { background: #3b82f6; }

    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(100%); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes countdownBar {
      from { width: 100%; }
      to   { width: 0%; }
    }
    @keyframes checkDraw {
      to { stroke-dashoffset: 0; }
    }
    @keyframes xDraw {
      to { stroke-dashoffset: 0; }
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}