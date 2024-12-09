import { Service } from '../model/Service';

export interface ServiceService {
  fetchServices(): Promise<Service[]>;
}