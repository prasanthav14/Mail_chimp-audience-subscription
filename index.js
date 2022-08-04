const express = require('express')
const app = express();
const https = require('https');
const bodyParser = require('body-parser')
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { redirect } = require('express/lib/response');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => {
  console.log("server started")
})
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html", (err) => {
    if (err)
      console.log("html file error")
  })
})

app.post("/", (req, res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  const password = req.body.password;
  console.log(firstName, lastName, email, password)

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
        PASSWORD: password
      }
    }]
  }
  const jsondata = JSON.stringify(data);
  const options = {
    method: 'POST',
    auth: process.env.MAIL_CHIMP_API_KEY
  };
  url = process.env.MAIL_CHIMP_URL
  const request = https.request(url, options, (response) => {
    response.on('data', (d) => {
      console.log(response.statusCode)
      if (response.statusCode === 200)
        res.sendFile(__dirname + "/public/success.html")
      else
        res.sendFile(__dirname + "/public/fail.html")
    });
  });
  request.write(jsondata);
  request.end();
});
app.post("/goback", (req, res) => {
  res.redirect("/")
})

// mailchimp.setConfig({
//   apiKey: "af455ce5b43119599a6d2091555d5187-us14",
//   server: "us14",
//  audience id: 1f31a61590
// });





