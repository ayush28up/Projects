#!/usr/bin/env node
//const fs=require('fs')
//let data=fs.readFileSync("abc.txt","utf-8");
//fs.writeFileSync("abc.txt",data + "hiiiiiiiiiiiiiiiiiiiiiiiiiiii")
//console.log(data);

let commds=process.argv.slice(2);
const fs=require('fs');

function wwcat(commds){
    if(commds.length==0){
        console.log("file does not exist")
        return;
    }
    let count=0;
    for (i in commds){
        if(!fs.existsSync(commds[i])){
           console.log(commds[i] + " does not exist.")
           return;
        }
    let data=fs.readFileSync(commds[i],"utf-8");
    
            for(let k=0;k<data.length;k++){
                if(data.charAt(k)=='n'){
                   count=count+1; 
                }
            }
        }
        console.log(count);
    }
wwcat(commds);