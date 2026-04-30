import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { BgRemover } from '../../core/services/bg-remover';
import { ToastService } from '../../core/services/toast.service';
import { BgRemoverModel } from '../../core/models/bg-remover';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-bg-remover.component',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './bg-remover.component.html',
  styleUrl: './bg-remover.component.css',
})
export class BgRemoverComponent implements OnInit {
  private bgService = inject(BgRemover);
  private toast = inject(ToastService);

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  loading = false;
  isDragging = false;
  items = signal<BgRemoverModel[]>([]);
  activeItems = computed(() => this.items().filter(item => item.status));
  inactiveItems = computed(() => this.items().filter(item => !item.status));
  showDeleted = false;

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.bgService.findAll().subscribe({
      next: (data) => this.items.set(data.reverse()),
      error: () => this.toast.error('No se pudo cargar el historial', { description: 'Verifica tu conexión.' })
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.setFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files?.length) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        this.setFile(file);
      } else {
        this.toast.warning('Archivo no válido', { description: 'Solo se aceptan imágenes.' });
      }
    }
  }

  private setFile(file: File): void {
    this.selectedFile = file;
    this.previewUrl = URL.createObjectURL(file);
    this.toast.info('Imagen seleccionada', { description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)` });
  }

  clearFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  process(): void {
    if (!this.selectedFile) return;
    this.loading = true;
    this.toast.info('Procesando imagen...', { description: 'Eliminando el fondo con IA.' });

    this.bgService.removeBackgroundFromFile(this.selectedFile).subscribe({
      next: (newItem) => {
        this.items.update(list => [newItem, ...list]);
        this.clearFile();
        this.loading = false;
        this.toast.success('¡Fondo eliminado!', { description: 'La imagen procesada está lista.' });
      },
      error: () => {
        this.loading = false;
        this.toast.error('Error al procesar', { description: 'No se pudo eliminar el fondo. Intenta con otra imagen.' });
      }
    });
  }

  toggleStatus(item: BgRemoverModel) {
    if (!item.id) return;
    const newStatus = !item.status;
    this.bgService.setStatus(item.id, newStatus).subscribe({
      next: (updated: BgRemoverModel) => {
        this.items.update(list => list.map(i => i.id === updated.id ? updated : i));
        if (updated.status) {
          this.toast.success('Imagen activada', { description: 'La imagen es visible nuevamente.' });
        } else {
          this.toast.warning('Imagen desactivada', { description: 'La imagen ha sido ocultada.' });
        }
      },
      error: () => this.toast.error('Error', { description: 'No se pudo cambiar el estado.' })
    });
  }
}
