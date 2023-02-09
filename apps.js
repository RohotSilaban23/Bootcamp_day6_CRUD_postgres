const http = require('http');
const fs = require('fs');



http
 .createServer((req, res)=>{
    const url =req.url;
    console.log(url)
    function page(url) {
        fs.readFile(`.${url}.html`, (err, data) => {
            if(err){
                res.writeHead(404);
                res.write('Error : page not found')
            } else {
                res.write(data)
            }
            res.end()
        })
    };
    res.writeHead(200,{
        'content-type': 'text/html'
    })

    page(url);


 })
    
    

   

.listen(3000,()=>{
    console.log('Server is listening on port 3000')
  });