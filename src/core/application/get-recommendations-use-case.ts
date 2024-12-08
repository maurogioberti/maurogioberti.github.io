import { ResumeRepository } from '@/core/domain/repository/ResumeRepository';

export class GetRecommendationsUseCase {
  constructor(private repository: ResumeRepository) {}

  execute() {
    return this.repository.getRecommendations();
  }
}