import { Profile } from '../../domain/model/Profile';
import { ProfileService } from '../../domain/services/ProfileService';
import { BaseService } from './base/BaseService';

export class ProfileServiceImpl extends BaseService implements ProfileService {
  private static readonly PROFILE_GET: string = "profile";

  async fetchProfile(): Promise<Profile> {
    return await this.fetchData<Profile>(ProfileServiceImpl.PROFILE_GET);
  }
}