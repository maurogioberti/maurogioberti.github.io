import { Recommendation } from '@/core/domain/model/Recommendation';
import { Timeline } from '@/core/domain/model/Timeline';
import { ResumeService } from '@/core/domain/services/ResumeService';
import { BaseService } from '@/core/infrastructure/services/base/BaseService';

export class ResumeServiceImpl extends BaseService implements ResumeService {
  private static readonly RECOMMENDATIONS_GET: string = "recommendations";
  private static readonly TIMELINE_GET: string = "timeline";

  async fetchRecommendations(): Promise<Recommendation[]> {
    return await this.fetchData(ResumeServiceImpl.RECOMMENDATIONS_GET);
  }

  async fetchTimeline(): Promise<Timeline[]> {
    return await this.fetchData(ResumeServiceImpl.TIMELINE_GET);
  }
}