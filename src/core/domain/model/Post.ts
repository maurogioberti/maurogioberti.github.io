export class Post {
  public readonly slug: string;

  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly content: string,
    public readonly tags: string[],
    public readonly imageUrl: string,
    public readonly postedDate: Date,
  ) {
    this.slug = Post.generateSlug(this.title);
  }

  get formattedDate(): string {
    return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(this.postedDate);
  }

  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  }
}