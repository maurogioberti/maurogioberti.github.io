import { Recommendation } from '../model/Recommendation';
import { Timeline } from '../model/Timeline';

export interface ResumeService {
  fetchRecommendations(): Promise<Recommendation[]>;
  fetchTimeline(): Promise<Timeline[]>;
}