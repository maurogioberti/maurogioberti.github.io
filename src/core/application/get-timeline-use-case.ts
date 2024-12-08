import { ResumeRepository } from '@/core/domain/repository/ResumeRepository';

export class GetTimelineUseCase {
  constructor(private repository: ResumeRepository) {}

  execute() {
    return this.repository.getTimeline();
  }
}