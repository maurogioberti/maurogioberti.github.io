import { Automapper } from '@/core/crosscutting/mapping/Automapper';

import { Presentation } from '../../domain/model/Presentation';
import { PresentationRepository } from '../../domain/repository/PresentationRepository';
import { PresentationService } from '../../domain/services/PresentationService';

export class PresentationRepositoryImpl implements PresentationRepository {
  private presentationService: PresentationService;

  constructor(presentationService: PresentationService) {
    this.presentationService = presentationService;
  }

  async getPresentationBySlug(slug: string, sponsorSlug: string): Promise<Presentation> {
    const presentations = await this.getAllPresentations();
    const presentation = presentations.find(
      (presentation: Presentation) => presentation.slug === slug && presentation.sponsorSlug === sponsorSlug
    );
    
    if (!presentation)
      throw new Error(`Presentation with slug '${slug}' and sponsor '${sponsorSlug}' not found`);
    
    return presentation;
  }

  async getAllPresentations(): Promise<Presentation[]> {
    const rawPresentationData = await this.presentationService.fetchPresentations();
    
    return rawPresentationData.map(item => 
      Automapper.map(item, Presentation)
    );
  }
}