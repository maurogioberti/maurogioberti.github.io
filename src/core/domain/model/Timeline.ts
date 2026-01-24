export class Timeline {
  constructor(
    public year: string,
    public title: string,
    public company: string,
    public companyUrl: string | null,
    public companyLogoUrl: string,
    public location: string | null,
    public workType: string | null,
    public consultingCompany: string | null,
    public consultingCompanyUrl: string | null,
    public consultingCompanyLogoUrl: string | null,
    public description: string,
    public tags: string[]
  ) {}
}