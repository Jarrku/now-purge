"use strict";

const fetch = require("node-fetch");

const BASE_URL = "https://api.zeit.co";
const URLS = {
  DEPLOYMENT: "/v2/now/deployments",
  ALIAS: "/v2/now/aliases",
  TEAMS: "/teams"
};

const logError = err => {
  console.log(`${err} ❌`);
};

class Now {
  constructor({ token, team }) {
    this._teamSlug = team;
    this._headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  }

  async init() {
    //  fetch teamId from slug if needed
    if (!this._teamSlug) return;

    const url = `${URLS.TEAMS}?slug=${this._teamSlug}`;

    try {
      const { id } = await this._fetch(url);
      this._teamId = id;
    } catch (err) {
      logError(err);
    }
  }

  _createOpts(opts = {}) {
    let options = Object.assign({}, opts);

    options.headers = Object.assign({}, this._headers, opts.headers);

    return options;
  }

  _prepareUrl(url) {
    let urlToUse = `${BASE_URL}${url}`;

    if (this._teamId) {
      urlToUse = `${urlToUse}?teamId=${this._teamId}`;
    }

    return urlToUse;
  }

  async _fetch(url, opts) {
    const response = await fetch(this._prepareUrl(url), this._createOpts(opts));

    return await response.json();
  }

  async getDeploys() {
    try {
      return this._fetch(URLS.DEPLOYMENT);
    } catch (err) {
      logError(err);
    }
  }

  async getAliases() {
    try {
      return this._fetch(URLS.ALIAS);
    } catch (err) {
      logError(err);
    }
  }

  async removeDeploy({ uid }) {
    const url = `${URLS.DEPLOYMENT}/${uid}`;
    const opts = {
      method: "DELETE"
    };

    try {
      await this._fetch(url, opts);
      console.log(`${uid} removed ✅`);
    } catch (err) {
      logError(`${uid} error`);
      console.log(err);
    }
  }
}

module.exports = Now;
