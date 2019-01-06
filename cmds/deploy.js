#!/usr/bin/env node

const fs = require("fs");
const wos = {
  userConfigPath: require("os").homedir() + "/.wos/config.json",
  projectConfig: "./wos.json"
};

module.exports = args => {
  const { prompt } = require("inquirer");
  const branch = args.branch || args.b;
  const commitCount = args.count || args.c;

  const questions = [
    {
      type: "input",
      name: "projectId",
      message: "Please enter the project ID"
    },
    {
      type: "input",
      name: "defaultSite",
      message:
        "The default site name is staging. If you want to use another name as the default, enter it now. Otherwise, hit enter"
    },
    {
      type: "input",
      name: "siteId",
      message: "Please enter the site ID"
    }
  ];

  if (fs.existsSync(wos.projectConfig)) {
    createGitLog(commitCount, branch);
  } else {
    prompt(questions).then(answers =>
      createProjectConfig(answers, commitCount, branch)
    );
  }
};

createProjectConfig = (answers, commitCount, branch) => {
  fs.writeFile(wos.projectConfig, JSON.stringify(answers, null, 2), function(
    err
  ) {
    if (err) {
      return console.log(err);
    }

    createGitLog(commitCount, branch);
  });
};

postGitLog = (gitLog, branch) => {
  const axios = require("axios");
  const path = require("path");
  const accessToken = JSON.parse(fs.readFileSync(wos.userConfigPath, "utf8"))
    .accessToken;
  const authorizationHeader = {
    headers: {
      Authorization: "Token token=" + accessToken
    }
  };

  const gitLogData = "[" + gitLog.slice(0, -1) + "]";
  const projectConfig = JSON.parse(
    fs.readFileSync(path.resolve("./", "wos.json"), "utf8")
  );

  if (branch === undefined && projectConfig.defaultSite == "") {
    branch = "staging";
  } else if (branch === undefined && projectConfig.defaultSite != "") {
    branch = projectConfig.defaultSite;
  }

  axios
    .post(
      process.env.POST_URL + projectConfig.projectId + "/deploys",
      {
        commit_log: gitLogData,
        project_id: projectConfig.projectId,
        site: branch,
        project_site_id: projectConfig.siteId
      },
      authorizationHeader
    )
    .then(function(response) {
      if (response.status == 200) {
        console.log("Site updated with your latest commits!");
      }
    })
    .catch(function(error) {
      //console.log(error);
      console.log("There's been an error. The request cannot be sent.");
    });
};

createGitLog = (commitCount, branch) => {
  const { exec } = require("child_process");
  if (commitCount === undefined) {
    commitCount = 10;
  }
  const gitLog = `git log --max-count=${commitCount} --pretty=format:'${JSON.stringify(
    {
      commit: "%H",
      abbreviated_commit: "%h",
      subject: "%s",
      body: "%b",
      commit_notes: "%N",
      verification_flag: "%G?",
      signer: "%GS",
      signer_key: "%GK",
      author: { name: "%aN", email: "%aE", date: "%aD" },
      commiter: { name: "%cN", email: "%cE", date: "%cD" }
    }
  )},'`;
  exec(gitLog, (err, stdout) => {
    if (err) {
      console.log(err);
    } else {
      postGitLog(stdout, branch);
    }
  });
};
