const SOCIAL_KEYS = {
  GITHUB: "github",
  YOUTUBE: "youtube",
  TWITTER: "twitter",
  INSTAGRAM: "instagram",
  TIKTOK: "tiktok",
  LINKEDIN: "linkedin",
  WEBSITE: "website",
};

const INITIAL_EXPERIENCE_DATE = new Date("2014-01-01");

export class Profile {
  constructor(
    public readonly name: string,
    public readonly lastName: string,
    public readonly birthDate: Date,
    public readonly position: string,
    public readonly additionalPositions: string[] = [],
    public readonly shortDescription: string,
    public readonly longDescription: string,
    public readonly conciseDescription: string,
    public readonly socials: { [key: string]: string },
    public readonly avatarUrl?: string,
    public readonly email?: string,
    public readonly location?: { city: string; country: string; description: string },
    public readonly skills: string[] = []
  ) {}

  get fullname(): string {
    return `${this.name} ${this.lastName}`;
  }

  get age(): number {
    const today = new Date();
    const birth = this.birthDate;
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  get yearsOfExperience(): number {
    const today = new Date();
    let years = today.getFullYear() - INITIAL_EXPERIENCE_DATE.getFullYear();
    const monthDiff = today.getMonth() - INITIAL_EXPERIENCE_DATE.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < INITIAL_EXPERIENCE_DATE.getDate())) {
      years--;
    }
    return years;
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

  get tiktokUrl(): string {
    return this.socials[SOCIAL_KEYS.TIKTOK];
  }

  get linkedinUrl(): string {
    return this.socials[SOCIAL_KEYS.LINKEDIN];
  }

  get websiteUrl(): string {
    return this.socials[SOCIAL_KEYS.WEBSITE];
  }
}