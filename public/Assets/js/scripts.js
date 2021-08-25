// const fetch = require('node-fetch');

// exports.functionName= (req, res) => {
//   const fetchFromURL = async () => await (await fetch('https://yourURL.com')).json();

//   fetchFromURL().then((data) => {
//     // do something with data (received from URL).
//   });
// };

fetch('https://opentdb.com/api.php?amount=10&category=28&type=boolean')
.then(promise=>promise.json())
.then(obj=>{
    console.log(obj);
})

