const simpleGit = require('simple-git')();
// Shelljs package for running shell tasks optional
const shellJs = require('shelljs');
// Simple Git with Promise for handling success and failure
const simpleGitPromise = require('simple-git/promise')();
// change current directory to repo directory in local



const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
const port = 8080;
//app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

/*app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
 });*/
app.listen(port,()=> {
   console.log('listen port 8080');
   })
   router.get('/',function(req,res){
      res.send("hello")

   });
router.post('/',function (req,res){
   var option=req.body.option;
  // var userName=req.body.userName;
   //var pswrd=req.body.password;
//   var repo_name=req.body.repoName;
   var update_msg=req.body.update_msg;
 
   
//let folder=process.argv[3];
var folder= req.body.repoName;
// Repo name
//const repo = 'dum';  //Repo name
// User name and password of your GitHub
const userName = req.body.userName;
const password = req.body.password;
//Set up GitHub url like this so no manual entry of user pass needed

const gitHubUrl = `https://${userName}:${password}@github.com/${userName}/${folder}`;
// add local git config like username and email
simpleGit.addConfig('user.email',req.body.mailId);
simpleGit.addConfig('user.name',userName);
const {Octokit}  = require("@octokit/rest");
const octo = new Octokit({
   auth: req.body.token
});
if(option==='create')
{
   
   octo.repos.createForAuthenticatedUser({
      name: folder
  }).then(data => {
      console.log("successfully created repo " + folder)
      res.send("successfully created repo")
  }).catch(e => {

      console.log(e);
      res.send(e)
      
   });

   
}



else if( option==='push')
{   
   simpleGitPromise.cwd('C:/Users/ca_user1/Desktop/display')
   simpleGitPromise.init();


   octo.repos.createForAuthenticatedUser({

      name: folder
   }).then(data => {
      console.log("successfully created repo " + folder)
      //res.send("successfully created repo")
      //simpleGitPromise.removeRemote('origin',gitHubUrl);
     simpleGitPromise.addRemote('origin',gitHubUrl);
// Add all files for commit
  simpleGitPromise.add('.')
    .then(
       (addSuccess) => {
          console.log(addSuccess);
       }, (failedAdd) => {
          console.log('adding files failed');
    });
// Commit files as Initial Commit
 simpleGitPromise.commit('Intial commit by simplegit')
   .then(
      (successCommit) => {
        console.log(successCommit);
     }, (failed) => {
        console.log('failed commmit');
 });
// Finally push to online repository
 simpleGitPromise.push('origin','master')
    .then((success) => {
       console.log('repo successfully pushed');
       res.send("repo pushed successfully")
    },(failed)=> {
       console.log('repo push failed');
       res.send("repo push failed")
 });


   }).catch(e => {
     console.log("repo already exists");
  //simpleGitPromise.removeRemote('origin',gitHubUrl);

// Add remore repo url as origin to repo
simpleGitPromise.addRemote('origin',gitHubUrl);
// Add all files for commit
  simpleGitPromise.add('.')
    .then(
       (addSuccess) => {
          console.log(addSuccess);
        //  res.send(addSuccess)
       }, (failedAdd) => {
          console.log('adding files failed');
         // res.send("adding files failed")
    });
// Commit files as Initial Commit
 simpleGitPromise.commit('Intial commit by simplegit')
   .then(
      (successCommit) => {
        console.log(successCommit);
       // res.send(
     }, (failed) => {
        console.log('failed commmit');
      //  res.send("failed commit")
 });
// Finally push to online repository
 simpleGitPromise.push('origin','master')
    .then((success) => {
       console.log('repo successfully pushed');
       res.send("repo successfully pushed")
    },(failed)=> {
       console.log('repo push failed');
       res.send("repo push failed")
 });
});

}
else if( option==='update')
{
   simpleGitPromise.add('.')
   .then(
      (addSuccess) => {
         console.log(addSuccess);
       //  res.send(addSuccess)
      }, (failedAdd) => {
         console.log('adding files failed');
      //   res.send("addingfiles failed")
   });

   // Commit files as Initial Commit
simpleGitPromise.commit(update_msg)
 .then(
    (successCommit) => {
      console.log(successCommit);
    //  res.send(successCommit)
   }, (failed) => {
      console.log('failed commmit');
    //  res.send("failed commit")
});
// Finally push to online repository
simpleGitPromise.push('origin','master')
  .then((success) => {
     console.log(success);
     res.send("successfully updated repo")
  },(failed)=> {
     console.log('repo update failed');
     res.send("update failed")
});
}
});
app.use("/", router);
