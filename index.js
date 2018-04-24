#!/usr/bin/env node
"use strict";
const fetch = require("node-fetch");

const argv = require("yargs")
  .usage("Usage: $0 <command> [options]")
  .command("t", "now token")
  .option("team", {
    describe: "team id"
  }).argv;

const DEPLOYMENT_URL = "https://api.zeit.co/v2/now/deployments";
const ALIAS_URL = "https://api.zeit.co/v2/now/aliases";

const prepareUrl = baseUrl => (teamId = null) => (url = null) => {
  let result = baseUrl;

  if (url !== null) {
    result = `${result}/${url}`;
  }

  if (teamId !== null) {
    result = `${result}?teamId=${teamId}`;
  }

  return result;
};

const prepareHeaders = token => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json"
});

const deploymentUrlGenerator = prepareUrl(DEPLOYMENT_URL);
const aliasUrlGenerator = prepareUrl(ALIAS_URL);

const prepareFetch = token => async url => {
  const headers = prepareHeaders(token);

  const response = await fetch(url, {
    headers
  });

  return response.json();
};

const getDeploymentsWithoutAlias = async (token, teamId) => {
  const aliasUrl = aliasUrlGenerator(teamId)();
  const deploymentUrl = deploymentUrlGenerator(teamId)();
  const get = prepareFetch(token);

  const [deployments, aliases] = await Promise.all([
    get(deploymentUrl),
    get(aliasUrl)
  ]);

  return deployments.filter(
    ({ uid }) =>
      aliases.findIndex(({ deploymentId }) => deploymentId === uid) === -1
  );
};

const removeDeployments = (deployments, token, teamId) => {
  if (deployments.length === 0) {
    console.log("No deployments to remove");
    return;
  }

  deployments.forEach(({ uid }) => {
    const url = deploymentUrlGenerator(teamId)(uid);

    fetch(url, {
      method: "DELETE",
      headers: prepareHeaders(token)
    })
      .then(() => console.log(`${uid} removed ✅`))
      .catch(() => console.log(`${uid} error ❌`));
  });
};

// you can pass your `package.json` or `now.json` `name` to filter your deployments
const main = () => {
  const { token, team } = argv;

  getDeploymentsWithoutAlias(token, team)
    .then(deployments => removeDeployments(deployments, token, team))
    .catch(err => console.log(`${err} ❌`));
};

module.exports = main;

if (!module.parent) {
  main();
}
