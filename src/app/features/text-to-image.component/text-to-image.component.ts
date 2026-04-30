import { Component, inject, signal, computed } from '@angular/core';
import { TextToImage } from '../../core/services/text-to-image';
import { ToastService } from '../../core/services/toast.service';
import { TextToImageModel } from '../../core/models/text-to-image';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-to-image.component',
  imports: [DatePipe, FormsModule],
  templateUrl: './text-to-image.component.html',
  styleUrl: './text-to-image.component.css',
})
export class TextToImageComponent {
  private ttiService = inject(TextToImage);
  private toast = inject(ToastService);

  prompt = '';
  loading = false;
  items = signal<TextToImageModel[]>([]);
  activeItems = computed(() => this.items().filter(item => item.status));
  inactiveItems = computed(() => this.items().filter(item => !item.status));
  showDeleted = false;

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.ttiService.findAll().subscribe({
      next: (data) => this.items.set(data.reverse()),
      error: () => this.toast.error('No se pudo cargar el historial', { description: 'Verifica tu conexión e intenta de nuevo.' })
    });
  }

  generate() {
    if (!this.prompt.trim()) return;

    this.toast.info('Procesando solicitud...', { description: 'Tu imagen se está generando con IA.' });
    this.loading = true;
    const promptBackup = this.prompt;

    this.ttiService.generateImage(promptBackup).subscribe({
      next: (newItem) => {
        this.items.update(list => [newItem, ...list]);
        this.prompt = '';
        this.loading = false;
        this.toast.success('¡Imagen generada!', { description: 'Tu creación está lista para ver.' });
      },
      error: () => {
        this.loading = false;
        this.toast.error('Error al generar', { description: 'No se pudo crear la imagen. Intenta nuevamente.' });
      }
    });
  }

  toggleStatus(item: TextToImageModel) {
    if (!item.id) return;
    const newStatus = !item.status;

    this.ttiService.setStatus(item.id, newStatus).subscribe({
      next: (updated) => {
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

  openPreview(item: TextToImageModel) {
    if (item.generated_image_url) {
      window.open(item.generated_image_url, '_blank');
    }
  }

  suggestions = [
    { emoji: '🌃', label: 'Cyberpunk', prompt: 'Ciudad cyberpunk lluviosa de noche con luces de neón' },
    { emoji: '🐉', label: 'Dragón', prompt: 'Dragón de cristal en un bosque nevado al atardecer' },
    { emoji: '🎨', label: 'Retrato', prompt: 'Retrato al óleo de un gato con sombrero y monóculo' },
    { emoji: '🚀', label: 'Espacio', prompt: 'Astronauta flotando sobre un planeta con anillos dorados' },
    { emoji: '🏯', label: 'Fantasía', prompt: 'Castillo flotante entre nubes con cascadas mágicas' },
  ];
}
