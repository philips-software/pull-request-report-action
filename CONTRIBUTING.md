# Contributing

## Submitting a pull request

1. Fork and clone the repository
1. Configure and install the dependencies: `yarn install`
1. Create a new branch: `git checkout -b my-branch-name`
1. Make your change, add tests, and make sure the tests still pass: `yarn test`
1. Run the linter and fix any new complaints: `yarn lint`
1. Make sure your code is correctly formatted: `yarn format`
1. Update `dist/index.js` using `yarn package`. This creates some files that is
used as an entrypoint for the action
1. Push to your fork and submit a pull request
1. Pat yourself on the back and wait for your pull request to be reviewed and merged

Here are a few things you can do that will increase the likelihood of your pull request being accepted:

- Write tests.
- Keep your change as focused as possible. If there are multiple changes you would like to make that are not dependent upon each other, consider submitting them as separate pull requests.

## Resources

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Using Pull Requests](https://help.github.com/articles/about-pull-requests/)
- [GitHub Help](https://help.github.com)
- [Writing good commit messages](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)

Thanks!
