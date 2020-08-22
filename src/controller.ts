// import cheerio from "cheerio";
// import axios from 'axios'

// class Article {
//     title: string
//     description: string
//     story: string[]
// }
//
// export const getData = async (html: string, url: string) => {
//
// };



//         async function asyncForEach() {
//             for ( const link of articleLinks) {
//                 await rp('https://www.nu.nl' + link)
//                     .then(function(htmlA : any){
//                         const title : String = $('h1', htmlA).text();
//                         let description: String = "";
//                         const story: String[] = [];
//
//                         const paragh = $('.first .block-content p', html);
//                         for (const index of paragh){
//                             if($(paragh[index]).hasClass('excerpt')) description = $(paragh[index]).text();
//                             else story.push($(paragh[index]).text());
//                         }
//
//                         const article = {
//                             title: title,
//                             description: description,
//                             story: story
//                         };
//                         items.push(article);
//                     })
//                     .catch(function(err: String){
//                         console.log(err);
//                         response.send("We failed to get the article booiiiii");
//                     });
//             }
//         }
//     })

// asyncForEach()
//     .then(() => {
//         // tslint:disable-next-line:no-console
//         console.log('async data done : ')
//         return data;
//     })
//     .catch(() => {
//         // tslint:disable-next-line:no-console
//         console.log('async error: ')
//     });
//
// async function asyncForEach() {
//     for (const href of hrefs) {
//         await axios.get(url.concat(href))
//             .then( res => {
//                 const article = htmlToArticle( res.data )
//                 // tslint:disable-next-line:no-console
//                 console.log('article: ')
//                 data.push(article)
//             }).catch(err =>{
//                 // tslint:disable-next-line:no-console
//                 console.log('async function error: ')
//             });
//     }
// }