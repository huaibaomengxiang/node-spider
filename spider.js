const rq = require('request')
const cheerio = require('cheerio')
const fs = require ('fs')

const basicUrl="http://www.tycqxs.com/48_48093/"
var count=0;
var name,listUrl=[];


rq(basicUrl, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        $ = cheerio.load(body);
        name=$("#info>h1").text()
        if(fs.exists('./novel')){
            fs.mkdir(`./novel/${name}.txt`,(err)=>{
                if(err){
                    console.log(err)
                }
            })
        }else{
            fs.mkdir('./novel/',(err)=>{
                if(err){
                    console.log(err)
                }
            })
        }
        $('#list').find('dd').each((i,e)=>{
            if(i>=9){
                listUrl.push(basicUrl+e.children[0].attribs.href.slice(10))
            }
        })
        getContent()
        function getContent() {
            rq(listUrl[count],(err,res,body)=>{
                $$=cheerio.load(body)
                var title=$$('.bookname').find('h1').text()
                var content=$$("#content").text()
                fs.appendFileSync(`./novel/${name}.txt`,title+'\n')
                fs.appendFileSync(`./novel/${name}.txt`,content)
                if(count+1<listUrl.length){
                    count++;
                    getContent()
                }
            })
        }
        console.log(listUrl.length)
    }
})



