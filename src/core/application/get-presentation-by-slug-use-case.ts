import { PresentationRepository } from '@/core/domain/repository/PresentationRepository';

export class GetPresentationBySlugUseCase {
  constructor(private repository: PresentationRepository) {}

  execute(slug: string, sponsorSlug: string) {
    return this.repository.getPresentationBySlug(slug, sponsorSlug);
  }
}