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
  
    const presentations = rawPresentationData.map(item => new Presentation(
      item.id,
      item.title,
      item.slug,
      item.sponsor,
      item.sponsorSlug,
      item.type,
      item.description,
      item.place,
      item.language,
      new Date(item.date),
      item.imageUrl,
      item.eventName,
      item.location,
      item.postUrl,
      item.repositoryUrl,
      item.slidesUrl,
      item.demoVideoUrl,
      item.videoUrl,
      item.registrationUrl,
      item.resourcesUrl,
      item.feedbackUrl,
      item.tags || []
    ));
  
    return presentations.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}