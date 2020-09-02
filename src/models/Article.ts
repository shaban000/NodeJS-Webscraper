export class Article {
  readonly url: string;
  readonly title: string;
  readonly description: string;
  readonly paragraphs: string[];

  constructor( title: string, description: string, url: string ) {
      this.title = title;
      this.description = description;
      this.url = url;
      this.paragraphs = [];
  }

  public addParagraph( paragraph: string ): void{
      this.paragraphs.push( paragraph )
  }
}
