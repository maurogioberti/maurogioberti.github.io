import { ServiceRepository } from '../domain/repository/ServiceRepository';

export class GetServicesUseCase {
  constructor(private repository: ServiceRepository) {}

  execute() {
    return this.repository.getServices();
  }
}