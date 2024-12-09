import { Service } from '../model/Service';

export interface ServiceRepository {
  getServices(): Promise<Service[]>;
}