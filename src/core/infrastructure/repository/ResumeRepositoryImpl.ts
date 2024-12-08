import { Automapper } from '@/core/crosscutting/mapping/Automapper';
import { Recommendation } from '@/core/domain/model/Recommendation';
import { Timeline } from '@/core/domain/model/Timeline';
import { ResumeRepository } from '@/core/domain/repository/ResumeRepository';
import { ResumeService } from '@/core/domain/services/ResumeService';

export class ResumeRepositoryImpl implements ResumeRepository {
  constructor(private resumeService: ResumeService) {}

  async getRecommendations(): Promise<Recommendation[]> {
    const rawRecommendations = await this.resumeService.fetchRecommendations();
    return rawRecommendations.map((recommendation) => Automapper.map(recommendation, Recommendation));
  }

  async getTimeline(): Promise<Timeline[]> {
    const rawTimeline = await this.resumeService.fetchTimeline();
    return rawTimeline.map((timeline) => Automapper.map(timeline, Timeline));
  }
}