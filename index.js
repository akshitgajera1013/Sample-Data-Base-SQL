const { faker } = require('@faker-js/faker');
const mysql=require("mysql2");
const express=require("express");
const app=express();
const port=8080;
const path=require("path");
const methodOverride=require("method-override");
const { v4: uuidv4 } = require("uuid");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

const connection=mysql.createConnection({
  host:"localhost",
  user:"root",
  database:"delta_app",
  password:"@Akshit9761"
});

let getRandomUser=() => {
  return [
     faker.string.uuid(),
    faker.internet.username(), 
     faker.internet.email(),
     faker.internet.password(),
];
};

app.get("/",(req,res) => {
  let q="SELECT count(*) FROM user";
  try{
  connection.query(q, (err,result) => {
    if(err) throw err;
   let count=result[0]["count(*)"];
    res.render("home.ejs",{count});
    });
} catch(err){
  console.log(err);
  res.send("SOME ERROR IN DB");
}
});

app.get("/users",(req,res) => {
  let q="SELECT * FROM user";
  try{
    connection.query(q, (err,users) => {
      if(err) throw err;
      res.render("show.ejs",{users});
      });
  } catch(err){
    console.log(err);
    res.send("SOME ERROR IN DB");
  }
});


app.get("/users/:id/edit",(req,res) => {
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q, (err,result) => {
      if(err) throw err;
      let user=result[0];
      res.render("edit.ejs",{user});
      });
  } catch(err){
    console.log(err);
    res.send("SOME ERROR IN DB");
  }
});

app.patch("/users/:id",(req,res) => {
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;
  let{password:formPass,username:newUser}=req.body;
  try{
    connection.query(q, (err,result) => {
      if(err) throw err;
      let user=result[0];
      if(formPass != user.password){
        res.send("WRONG PASSWORD");
      } else{
        let q2=`UPDATE user SET username='${newUser}' WHERE id='${id}'`;
        connection.query(q2, (err,result) => {
          if(err) throw err;
          res.redirect("/users"); 
        })
      }
      });
  } catch(err){
    console.log(err);
    res.send("SOME ERROR IN DB");
  }
});

app.post("/users/new", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();
  let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added new user");
      res.redirect("/users");
    });
  } catch (err) {
    res.send("some error occurred");
  }
});

app.delete("/users/:id/", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (user.password != password) {
        res.send("WRONG Password entered!");
      } else {
        let q2 = `DELETE FROM user WHERE id='${id}'`; 
        connection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            // console.log(result);
            // console.log("deleted!");
            res.redirect("/users");
          }
        });
      }
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

// app.listen("8080", () => {
//   console.log("welome to the port 8080");
// });

// let q="INSERT INTO user (id,username,email,password) VALUES ?";
// let data=[];
// for(let i=1;i<=100;i++){
//   data.push(getRandomUser());
// }

// try{
//   connection.query(q,[data],(err,result) => {
//     if(err) throw err;
//     console.log(result);
//   });
// } catch(err){
//   console.log(err);
// }
 
// connection.end();  


