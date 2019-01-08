# What's On Staging?

Keep track of what's been deployed.

### Installation

```sh
$ git clone https://github.com/Pat878/whats-on-staging.git
$ cd whats-on-staging
$ npm link
```

### Usage


- Run `wos login` to log into your account.

- After succesfully deploying your project run `wos deploy` on your deploy branch. If it is your first time running `wos deploy` for the project, you will be prompted to create a project config file.

### Commands

- `wos deploy --branch [branch-name]`
	- Set the branch name to something other than staging.

- `wos deploy --count [number]`
	- Change the number of commits you send to your wos site. The default is 10.
