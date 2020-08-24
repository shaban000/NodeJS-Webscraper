export class Article {
  private readonly _title: string;
  private readonly _description: string;
  private readonly _paragraphs: string[];
  private readonly _url: string;

  constructor( title: string, description: string, url: string ) {
      this._title = title;
      this._description = description;
      this._url = url;
      this._paragraphs = [];
  }

  public addParagraph( paragraph: string ): void{
      this._paragraphs.push( paragraph )
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get paragraphs(): string[] {
    return this._paragraphs;
  }

  get url(): string {
    return this._url;
  }
}
