import fs from "node:fs";
import path from "node:path";
import { exec as nodeExec } from "node:child_process";
import tsconfig from "../tsconfig.json" assert { type: "json" };
import packageJson from "../package.json" assert { type: "json" };

async function exec(command, option) {
  return new Promise((resolve, reject) => {
    try {
      return nodeExec(command, option, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ stdout, stderr });
      });
    } catch (e) {
      reject(e);
    }
  });
}
const root = process.cwd();
const srcDir = path.resolve(root, "./src");
const outDir = path.resolve(root, tsconfig.compilerOptions.outDir);
const babelConfigPath = path.resolve(root, "./babel.config.js");
const extensions = [".ts", ".tsx"];
const ignore = [
  "**/*.test.js",
  "**/*.test.ts",
  "**/*.test.tsx",
  "**/*.spec.ts",
  "**/*.spec.tsx",
  "**/*.d.ts",
];

async function run({ bundle }) {
  let outPath = "./";
  if (bundle === "common") {
    outPath = "./cjs";
  }

  const babelArgs = [
    "--config-file",
    babelConfigPath,
    "--extensions",
    `"${extensions.join(",")}"`,
    srcDir,
    "--out-dir",
    path.resolve(outDir, outPath),
    "--ignore",
    `"${ignore.join('","')}"`,
  ];
  const command = ["pnpm", "babel", ...babelArgs].join(" ");

  const { stderr, stdout } = await exec(command, {
    env: { ...process.env, BABEL_ENV: bundle },
  });

  if (stdout) {
    console.log(stdout);
  }

  if (stderr) {
    throw new Error(`'${command}' failed with \n${stderr}`);
  }
}

const removeBuildInfoFile = () => {
  const tsbuildinfoPath = path.resolve(root, "tsconfig.tsbuildinfo");
  if (fs.existsSync(tsbuildinfoPath)) {
    fs.rmSync(tsbuildinfoPath);
  }
};

const cleanUp = () => {
  removeBuildInfoFile();
  if (fs.existsSync(outDir)) {
    fs.rmdirSync(outDir, { recursive: true });
  }
};

const createBuildFiles = () => {
  const { devDependencies, scripts, publishConfig, ...rest } = packageJson;
  const distPackageJson = {
    ...rest,
    private: false,
    publishConfig: {
      access: "public",
    },
    main: "./cjs/index.js",
    module: "./index.js",
    types: "./index.d.ts",
  };
  delete distPackageJson["lint-staged"];
  fs.writeFileSync(
    path.resolve(outDir, "package.json"),
    JSON.stringify(distPackageJson, null, 2)
  );
  fs.copyFileSync(
    path.resolve(root, "README.md"),
    path.resolve(outDir, "README.md")
  );
};

async function build() {
  cleanUp();

  await Promise.all(
    ["common", "modern"].map((bundle) => {
      return run({ bundle });
    })
  );

  const { stderr, stdout } = await exec("pnpm tsc", {
    env: { ...process.env },
  });
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.log(stderr);
  }

  removeBuildInfoFile();
  createBuildFiles();
}

build();
