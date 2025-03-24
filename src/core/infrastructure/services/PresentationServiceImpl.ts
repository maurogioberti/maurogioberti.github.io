import { Presentation } from '../../domain/model/Presentation';
import { PresentationService } from '../../domain/services/PresentationService';
import { BaseService } from './base/BaseService';

export class PresentationServiceImpl extends BaseService implements PresentationService {
  private static readonly PRESENTATIONS_GET: string = "presentations";

  async fetchPresentations(): Promise<Presentation[]> {
    return await this.fetchData<Presentation[]>(PresentationServiceImpl.PRESENTATIONS_GET);
  }
}