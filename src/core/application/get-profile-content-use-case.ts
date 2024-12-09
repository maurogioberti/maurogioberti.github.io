import { ProfileRepository } from "@/core/domain/repository/ProfileRepository";

export class GetProfileUseCase {
  constructor(private repository: ProfileRepository) {}

  execute() {
    return this.repository.getProfile();
  }
}