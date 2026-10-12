import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const data = JSON.parse(
  await readFile(new URL("../data/targets.json", import.meta.url), "utf8")
);

assert.equal(data.categories.length, 12, "Expected 12 target categories");

const requiredIssueFields = [
  "id",
  "issue",
  "title",
  "action",
  "measure",
  "measures",
  "duration",
  "aliases"
];

const categoryIds = new Set();
const issueIds = new Set();
let issueCount = 0;

for (const category of data.categories) {
  assert.ok(category.id && category.name, "Every category needs an id and name");
  assert.ok(!categoryIds.has(category.id), `Duplicate category id: ${category.id}`);
  categoryIds.add(category.id);
  assert.ok(Array.isArray(category.issues) && category.issues.length, `${category.name} needs issues`);
  if (!["english", "maths"].includes(category.id)) {
    assert.ok(category.issues.length <= 9, `${category.name} must contain no more than 9 options`);
  }

  for (const issue of category.issues) {
    issueCount += 1;
    for (const field of requiredIssueFields) {
      assert.ok(issue[field], `${category.name} / ${issue.issue || issue.id} is missing ${field}`);
    }
    assert.ok(!issueIds.has(issue.id), `Duplicate issue id: ${issue.id}`);
    issueIds.add(issue.id);
    assert.ok(Array.isArray(issue.measures) && issue.measures.length, `${issue.id} needs measures`);
    assert.ok(
      issue.measures.some((measure) => measure.toLowerCase() === issue.measure.toLowerCase()),
      `${issue.id} default measure must appear in measures`
    );
    assert.ok(Array.isArray(issue.aliases) && issue.aliases.length, `${issue.id} needs search aliases`);
    if (issue.intent) {
      assert.ok(["maintain", "extend"].includes(issue.intent), `${issue.id} has an unsupported intent`);
    }
  }
}

assert.ok(categoryIds.has("english") && categoryIds.has("maths"), "English and Maths must be separate categories");
assert.ok(!categoryIds.has("english-maths"), "Combined English and Maths category must be removed");
assert.ok(issueCount >= 90, `Expected at least 90 substantive issues, found ${issueCount}`);
console.log(`Validated ${data.categories.length} categories and ${issueCount} issues.`);
