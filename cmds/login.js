#!/usr/bin/env node

module.exports = () => {
  const fs = require("fs");
  const homedir = require("os").homedir();
  const { prompt } = require("inquirer");

  const questions = [
    {
      type: "input",
      name: "email",
      message: "Please enter your email address"
    },
    {
      type: "input",
      name: "accessToken",
      message: "Please enter your access token"
    }
  ];

  prompt(questions).then(answers => createConfig(answers));

  createConfig = answers => {
    const wosDirectory = homedir + "/.wos";

    if (fs.existsSync(wosDirectory)) {
      writeFile(answers, wosDirectory);
    } else {
      fs.mkdirSync(wosDirectory);
      writeFile(answers, wosDirectory);
    }
  };

  writeFile = (answers, directory) => {
    fs.writeFile(
      directory + "/config.json",
      JSON.stringify(answers, null, 2),
      function(err) {
        if (err) {
          return console.log(err);
        }

        console.log("Login complete!");
      }
    );
  };
};
