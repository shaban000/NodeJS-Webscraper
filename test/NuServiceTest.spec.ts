import { NuService } from '../src/services/NuService'
import { Article } from "../src/models/Article";

const subject = new NuService();

test( 'test_getAllArticleHrefs_OneHeadlineOneBasic', () => {
  // Arrange
  const html = `<div><lic class="block headline"><a href="/one"></a></lic><li class="list__item list__item--thumb" >
    <a href="/two"></a></li></div>`

  // Act
  const hrefs: string[] = subject.getAllArticleHrefs( html );

  // Assert
  expect( hrefs.length ).toBe( 2 );

} )

test( 'test_getAllArticleHrefs_noneArticles', () => {
  // Arrange
  const html = `<div><lic class="block headline"><a class="block-title" href="/one"></a></lic><li class="list__item list__item--thumb" >
    <a href="/two"><label class="item-title__label"></label></a></li></div>`

  // Act
  const hrefs: string[] = subject.getAllArticleHrefs( html );

  // Assert
  expect( hrefs.length ).toBe( 0 );

} )

test( 'test_getArticleData', () => {
  // Arrange
  const url = '/getArticleDataTest';
  const title = 'Test for getArticleData methode.';
  const description = 'Converting HTML Article to Article Model.';
  const paragraphs = [ 'paragraph 1'];

  // Act
  const html = `<div><h1>${ title }</h1><div class="first"><div class="block-content">
    <p class="excerpt">${ description }</p><p>${ paragraphs[0] }</p></div></div></div>`;
  const article: Article = subject.getArticleData( html , url );

  // Assert
  expect( article.url ).toBe( url );
  expect( article.title ).toBe( title );
  expect( article.description ).toBe( description );
  expect( article.paragraphs[0] ).toBe( paragraphs[0] );
} )

