export interface TextToImageModel {
  id: number;
  prompt: string;
  generated_image_url: string;
  status: boolean;
  created_at: string;
}