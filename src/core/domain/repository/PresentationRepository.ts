import { Presentation } from '../model/Presentation';

export interface PresentationRepository {
  getPresentationBySlug(slug: string, sponsorSlug: string): Promise<Presentation>;
  getAllPresentations(): Promise<Presentation[]>;
}