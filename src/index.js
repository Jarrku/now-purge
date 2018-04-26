#!/usr/bin/env node
"use strict";

const argv = require("yargs")
  .usage("Usage: $0 <command> [options]")
  .command("t", "now token")
  .option("team", {
    describe: "team id"
  }).argv;

const Now = require("./now");

let nowClient;

const getDeploymentsWithoutAlias = async () => {
  const [{ deployments }, { aliases }] = await Promise.all([
    nowClient.getDeploys(),
    nowClient.getAliases()
  ]);

  return deployments.filter(
    ({ uid }) =>
      aliases.findIndex(({ deploymentId }) => deploymentId === uid) === -1
  );
};

const removeDeployments = deployments => {
  if (deployments.length === 0) {
    console.log("No deployments to remove");
    return;
  }

  return Promise.all(deployments.map(deploy => nowClient.removeDeploy(deploy)));
};

// you can pass your `package.json` or `now.json` `name` to filter your deployments
const main = async () => {
  const { token, team } = argv;
  nowClient = new Now({ token, team });

  await nowClient.init();

  const deployments = await getDeploymentsWithoutAlias();
  await removeDeployments(deployments);

  console.log("✅ Succesfully removed unaliases instances");
};

module.exports = main;

if (!module.parent) {
  main();
}
