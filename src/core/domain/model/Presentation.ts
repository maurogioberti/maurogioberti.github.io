export const PRESENTATION_TYPE = {
  WEBINAR: "webinar",
  ONSITE: "onsite",
  HYBRID: "hybrid",
} as const;

export const PRESENTATION_STATUS = {
  UPCOMING: "upcoming",
  PAST: "past",
  ONGOING: "ongoing",
} as const;

type PresentationType = typeof PRESENTATION_TYPE[keyof typeof PRESENTATION_TYPE];
type PresentationStatus = typeof PRESENTATION_STATUS[keyof typeof PRESENTATION_STATUS];

export class Presentation {
  constructor(
    public id: string,
    public title: string,
    public slug: string,
    public sponsor: string,
    public sponsorSlug: string,
    public type: PresentationType,
    public description: string,
    public place: string,
    public language: string,
    public date: Date,
    public imageUrl: string,
    public eventName?: string,
    public location?: string,
    public postUrl?: string,
    public repositoryUrl?: string,
    public slidesUrl?: string,
    public videoUrl?: string,
    public resourcesUrl?: string,
    public feedbackUrl?: string,
    public tags: string[] = []
  ) {}

  get status(): PresentationStatus {
    const now = new Date();
    if (this.date > now) return PRESENTATION_STATUS.UPCOMING;
    if (this.date.toDateString() === now.toDateString()) return PRESENTATION_STATUS.ONGOING;
    return PRESENTATION_STATUS.PAST;
  }
}