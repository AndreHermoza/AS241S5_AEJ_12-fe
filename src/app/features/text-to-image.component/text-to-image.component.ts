import { Component, inject, signal } from '@angular/core';
import { TextToImage } from '../../core/services/text-to-image';

@Component({
  selector: 'app-text-to-image.component',
  imports: [],
  templateUrl: './text-to-image.component.html',
  styleUrl: './text-to-image.component.css',
})
export class TextToImageComponent {
    private ttiService = inject(TextToImage);
  private toast = inject(DynamicToastService);

  prompt = '';
  loading = false;
  items = signal<TextToImage[]>([]);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.ttiService.findAll().subscribe({
      next: (data) => this.items.set(data.reverse() as TextToImage[]), 
      error: () => this.toast.error('No se pudo cargar el historial')
    });
  }

  generate() {
    if (!this.prompt.trim()) return;
    this.loading = true;
    this.error.set(null);
    this.ttiService.generateImage(this.prompt).subscribe({
      next: (newItem) => {
        this.items.update(list => [newItem, ...list]);
        this.prompt = '';
        this.loading = false;
        this.toast.success('¡Imagen generada!');
      },
      error: (err: any) => {
        this.toast.error('Error al generar la imagen');
        this.loading = false;
      }
    });
  }

  toggleStatus(item: TextToImage) {
    if (!item.id) return;
    const newStatus = !item.status;
    this.ttiService.setStatus(item.id, newStatus).subscribe({
      next: (updated) => {
        this.items.update(list =>
          list.map(i => i.id === updated.id ? updated : i)
        );
        this.toast.success(`Estado: ${updated.status ? 'Activo' : 'Inactivo'}`);
      },
      error: () => this.toast.error('Error al cambiar estado')
    });
  }

}
