import { Recommendation } from '@/core/domain/model/Recommendation';
import { Timeline } from '@/core/domain/model/Timeline';

export interface ResumeRepository {
  getRecommendations(): Promise<Recommendation[]>;
  getTimeline(): Promise<Timeline[]>;
}