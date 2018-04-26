# @jarrku/now-purge [![Version](https://img.shields.io/npm/v/@jarrku/now-purge.svg)](https://www.npmjs.com/package/@jarrku/now-purge)

> Remove [now](https://zeit.co/now) deployments without an alias

Credit to original idea for this package: [now-purge](https://github.com/matiastucci/now-purge)

This repo is updated to use the API endpoints in favour of the deprecated `now-client` package

## CLI

### One time run (using NPM 5 / npx)

```bash
npx @jarrku/now-purge --token YOUR_NOW_TOKEN --team OPTION_TEAM_ID
```

### Installation

```bash
npm install -g @jarrku/now-purge
```

### Usage

```bash
@jarrku/now-purge [options]

Options:
  --token        now auth token [Required]
  --team, -m     team id [Optional]
```

## From your CI

You can remove your oldest deployments without an alias

```bash
npx @jarrku/now-purge --token YOUR_NOW_TOKEN --team OPTION_TEAM_ID
```
