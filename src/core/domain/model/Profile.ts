export class Profile {
  constructor(
    public readonly name: string,
    public readonly lastName: string,
    public readonly position: string,
    public readonly additionalPositions: string[] = [],
    public readonly shortDescription: string,
    public readonly longDescription: string,
    public readonly socials: { [key: string]: string },
    public readonly avatarUrl?: string,
    public readonly email?: string,
    public readonly location?: { city: string; country: string; description: string;},
    public readonly skills: string[] = []
  ) {}
}