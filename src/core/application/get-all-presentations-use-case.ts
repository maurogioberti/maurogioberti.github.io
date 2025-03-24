import { PresentationRepository } from '@/core/domain/repository/PresentationRepository';

import { Presentation } from '../domain/model/Presentation';

export class GetAllPresentationsUseCase {
  constructor(private readonly repository: PresentationRepository) {}

  async execute(): Promise<Presentation[]> {
    return await this.repository.getAllPresentations();
  }
}