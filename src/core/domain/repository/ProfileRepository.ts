import { Profile } from "../model/Profile";

export interface ProfileRepository {
  getProfile(): Promise<Profile>
}