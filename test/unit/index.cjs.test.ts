import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

test("index.cjs skips built-in function properties when copying CommonJS exports", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "model-router-index-cjs-"));

  try {
    writeFileSync(
      join(tempDir, "index.bundle.cjs"),
      `"use strict";
function plugin() {
  return "ok";
}
module.exports = { default: plugin, helper: "value", name: "bad", length: 99 };
`,
      "utf8",
    );
    writeFileSync(
      join(tempDir, "index.cjs"),
      readFileSync("packages/opencode/src/index.cjs", "utf8"),
      "utf8",
    );

    const exported = require(join(tempDir, "index.cjs"));

    assert.equal(typeof exported, "function");
    assert.equal(exported(), "ok");
    assert.equal(exported.helper, "value");
    assert.equal(exported.name, "plugin");
    assert.equal(exported.length, 0);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("repo-local OpenCode shim targets root index.cjs instead of package source", async () => {
  const tempDir = mkdtempSync(join(tmpdir(), "model-router-opencode-shim-"));

  try {
    writeFileSync(join(tempDir, "package.json"), '{\n  "type": "module"\n}\n', "utf8");
    writeFileSync(
      join(tempDir, "index.cjs"),
      `"use strict";
module.exports = (ctx) => ({ ok: true, ctx });
`,
      "utf8",
    );

    const shimDir = join(tempDir, ".opencode", "plugins");
    mkdirSync(shimDir, { recursive: true });

    const shimSource = readFileSync(".opencode/plugins/model-router.js", "utf8");
    assert.match(shimSource, /import\("\.\.\/\.\.\/index\.cjs"\)/);
    assert.doesNotMatch(shimSource, /packages\/opencode\/src\/index\.js/);

    const shimPath = join(shimDir, "model-router.js");
    writeFileSync(shimPath, shimSource, "utf8");

    const pluginModule = await import(pathToFileURL(shimPath).href);
    assert.equal(typeof pluginModule.default, "function");
    assert.deepEqual(await pluginModule.default({ route: "fast" }), {
      ok: true,
      ctx: { route: "fast" },
    });
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("root package import resolves through the stable wrapper", async () => {
  const pluginModule = await import("model-router");

  assert.equal(typeof pluginModule.default, "function");
  assert.equal(typeof pluginModule.routerBuildInfo, "object");
  assert.equal(typeof pluginModule.validateConfig, "function");
});
