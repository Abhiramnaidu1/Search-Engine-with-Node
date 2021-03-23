const { Client } = require('elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

//   async function createTitle() {
//     const { response } = await client.create({
//         index: 'data',
//         id: 11,
//         body: {
//             title: 'My First title',
//             author: 'Jaseem',
//             date: new Date()
//         }
//     });
// }
//
// // createTitle().catch(console.log);
  async function getTitle(id) {
    return await client.search({
       index: 'data',
       body: {
           query: {
               match: {
                   _id: id
               }
           }
       }
   });
  }
//
//     console.log(body);
// }

// getTitle().catch(console.log);
//
//   async function updateTitle() {
//     const { response } = await client.update({
//         index: 'data',
//         id: 11,
//         body: {
//             doc: {
//                 title: 'Awsome title'
//             }
//         }
//     });
// }



// const body = titles.flatMap((doc, index) => [
//     { index: { _index: 'data', _id: index + 1 } },
//     doc
// ]);

//  async function createTitles() {
//     const { response } = await client.bulk({ body: body, refresh: true });
//
//     if (response) {
//         console.log(response.errors);
//     }
// }

// createTitles().catch(console.log);
//
//  async function countTitles() {
//     const { body } = await client.count({
//         index: 'data'
//     });
//
//     console.log(body);
// }

// countTitles().catch(console.log);
//const { body: response } =
 async function searchTitles(titlename) {
     return await client.search({
        index: 'data',
        body: {
            query: {
                match: {
                    title: titlename
                }
            },
              size:"10000"
        }
    });


}

var service = {};
async function advsearch(userObj) {
  var searchQuery={
    index: 'data',
      body: {
        query: {
            bool: {
               must: []
                   }
                },
                size:"10000"
            }

};

var must=searchQuery.body.query.bool.must;
if (userObj.title != undefined && userObj.title != null&&userObj.title != "") {
  var obj = {
    match: {
      title: userObj.title
    }
  };
  must.push(obj);
}
if (userObj.Author != undefined && userObj.Author != null&&userObj.Author != "") {
  var obj = {
    match: {
      contributor_author: userObj.Author
    }
  };
  must.push(obj);
}
if (userObj.Department != undefined && userObj.Department != null&&userObj.Department != "") {
  var obj = {
    match: {
      contributor_department: userObj.Department
    }
  };
  must.push(obj);
}
if (userObj.Description != undefined && userObj.Description != null&&userObj.Description != "") {
  var obj = {
    match: {
      description_abstract: userObj.Description
    }
  };
  must.push(obj);
}
console.log("========================================================");
console.log(searchQuery);
console.log("========================================================");
    return await client.search(searchQuery);
}

service.searchTitles = searchTitles;
service.getTitle = getTitle;
service.advsearch=advsearch;
module.exports = service;
