import supertest from 'supertest';
import axios, { AxiosStatic } from 'axios';
import {App} from "../src/server";

jest.mock('axios');
const request = supertest(App);
let axiosMock: jest.Mocked<AxiosStatic>;

beforeEach( () => {
  axiosMock = axios as jest.Mocked<typeof axios>;
} );

afterEach( () => {
  axiosMock = null;
} );

test('test_baseUrl_catch_axiosGet', async () => {
  // Arrange
  axiosMock.get.mockRejectedValue( {} )

  // Act
  const response = await request.get('/api/nu')

  // Assert
  expect(response.status).toBe(500)
})

test('test_baseUrl_noArticles', async () => {
  // Arrange
  const html: string = '';

  // Act
  axiosMock.get.mockResolvedValue( { data: html } );
  const response = await request.get('/api/nu');

  // Assert
  expect(response.status).toBe(500)
})

test('test_baseUrl_catch_axiosAll', async () => {
  // Arrange
  const html: string = '<div><li class="list__item list__item--thumb" >' +
    '<a href="/champions-league/6072746/psg-en-bayern-missen-grote-kansen-in-eerste-helft.html"></a></li></div>'

  // Act
  axiosMock.get.mockResolvedValue( { data: html } )
  axiosMock.all.mockRejectedValue( {} )
  const response = await request.get('/api/nu')

  // Assert
  expect(response.status).toBe(404)
})

test('test_baseUrl_error_scraping', async () => {
  // Arrange
  const url = "/test";
  const title = 'Test for getArticleData methode.';
  const description = 'Converting HTML Article to Article Model.';
  const paragraphs = [ 'paragraph 1' ];
  const articleHtml = `<div><h1>${ title }</h1><div class="first"><div class="block-content">
    <p class="excerpt">${ description }</p><p>${ paragraphs[0] }</p></div></div></div>`;

  const html: string = '<div><li class="list__item list__item--thumb" >' +
    '<a href="/champions-league/6072746/psg-en-bayern-missen-grote-kansen-in-eerste-helft.html"></a></li></div>';

  // Act
  axiosMock.get.mockResolvedValue( { data: html } );
  axiosMock.all.mockResolvedValue( [{ data: articleHtml }] )
  const response = await request.get( '/api/nu' );

  // Assert
  expect( response.status ).toBe( 500 );
})
