import { formatDate } from '@/core/crosscutting/utils/date';

export class Post {
  public readonly slug: string;
  private static readonly EMPTY_STRING = "";

  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly content: string,
    public readonly tags: string[],
    public readonly imageUrl: string,
    public readonly postedDate?: Date,
  ) {
    this.slug = Post.generateSlug(this.title);
  }

  get formattedDate(): string {
    return formatDate(this.postedDate);
  }

  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  }
}