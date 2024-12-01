const SOCIAL_KEYS = {
  GITHUB: "github",
  YOUTUBE: "youtube",
  TWITTER: "twitter",
  INSTAGRAM: "instagram",
  LINKEDIN: "linkedin",
  WEBSITE: "website",
};

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
    public readonly location?: { city: string; country: string; description: string; },
    public readonly skills: string[] = []
  ) {}

  get fullname(): string {
    return `${this.name} ${this.lastName}`;
  }

  get githubUrl(): string {
    return this.socials[SOCIAL_KEYS.GITHUB];
  }

  get youtubeUrl(): string {
    return this.socials[SOCIAL_KEYS.YOUTUBE];
  }

  get twitterUrl(): string {
    return this.socials[SOCIAL_KEYS.TWITTER];
  }

  get instagramUrl(): string {
    return this.socials[SOCIAL_KEYS.INSTAGRAM];
  }

  get linkedinUrl(): string {
    return this.socials[SOCIAL_KEYS.LINKEDIN];
  }

  get websiteUrl(): string {
    return this.socials[SOCIAL_KEYS.WEBSITE];
  }
}