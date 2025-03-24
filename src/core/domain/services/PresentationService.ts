import { Presentation } from '../model/Presentation';

export interface PresentationService {
  fetchPresentations(): Promise<Presentation[]>;
}