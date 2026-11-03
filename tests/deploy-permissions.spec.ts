import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const workflow = readFileSync(".github/workflows/deploy.yml", "utf8");
const [beforeJobs, jobs] = workflow.split(/^jobs:\s*$/m);
const [build, deploy] = jobs.split(/^  deploy:\s*$/m);

test("PR-controlled builds do not inherit Pages or OIDC write permissions", () => {
  expect(beforeJobs).toMatch(/^permissions:\n  contents: read$/m);
  expect(beforeJobs).not.toMatch(/^  (?:pages|id-token):/m);
  expect(build).not.toMatch(/^\s+(?:pages|id-token):/m);
});

test("only the main-only deployment job receives deployment permissions", () => {
  expect(deploy).toMatch(/^    if: github\.ref == 'refs\/heads\/main'$/m);
  expect(deploy).toMatch(
    /^    permissions:\n      contents: read\n      pages: write\n      id-token: write$/m,
  );
});
