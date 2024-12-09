import { Service } from '@/core/domain/model/Service';
import { ServiceRepository } from '@/core/domain/repository/ServiceRepository';
import { ServiceService } from '@/core/domain/services/ServiceService';

export class ServiceRepositoryImpl implements ServiceRepository {
  constructor(private serviceService: ServiceService) {}

  async getServices(): Promise<Service[]> {
    return await this.serviceService.fetchServices();
  }
}