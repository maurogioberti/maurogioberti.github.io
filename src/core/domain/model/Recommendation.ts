import { formatDate } from '@/core/crosscutting/utils/date';

export class Recommendation {
  constructor(
    public name: string,
    public position: string,
    public relation: string,
    public date: Date,
    public profilePictureUrl: string,
    public linkedInProfileUrl: string,
    public linkedInRecommendationUrl: string,
    public translation: string | null,
    public text: string
  ) {}

  get formattedDate(): string {
    return formatDate(this.date);
  }
}