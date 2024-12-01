import { Profile } from "../model/Profile";

export interface ProfileService {
  fetchProfile(): Promise<Profile>;
}