import { BaseRepository } from "./base/BaseRepository";
import { Profile } from "../../domain/model/Profile";
import { ProfileRepository } from "../../domain/repository/ProfileRepository";
import { ProfileService } from "../../domain/services/ProfileService";
import { Automapper } from "../../crosscutting/mapping/Automapper";

export class ProfileRepositoryImpl extends BaseRepository implements ProfileRepository {
  private profileService: ProfileService;

  constructor(profileService: ProfileService) {
    super();
    this.profileService = profileService;
  }

  async getProfile(): Promise<Profile> {
    const rawDataProfile =  await this.profileService.fetchProfile();
    return Automapper.map(rawDataProfile, Profile);
  }
}