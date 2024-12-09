import { Service } from '@/core/domain/model/Service';
import { ServiceService } from '@/core/domain/services/ServiceService';
import { BaseService } from '@/core/infrastructure/services/base/BaseService';

export class ServiceServiceImpl extends BaseService implements ServiceService {
  private static readonly SERVICES_GET: string = "services";

  async fetchServices(): Promise<Service[]> {
    return await this.fetchContent<Service>(ServiceServiceImpl.SERVICES_GET);
  }
}