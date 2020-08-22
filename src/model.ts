export class Article {
    private title: string;
    private description: string;
    private story: string[];

    constructor(title: string, description: string) {
        this.title = title;
        this.description = description;
        this.story = [];
    }

    addParagraph(paragraph: string ){
        this.story.push( paragraph )
    }
}