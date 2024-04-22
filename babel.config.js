const presets = (api) => {
  const useCommonModules = api.env(["common"]);
  return [
    [
      "@babel/preset-env",
      {
        bugfixes: true,
        debug: true,
        modules: useCommonModules ? "commonjs" : false,
        shippedProposals: api.env("modern"),
        targets: {
          browsers: [
            "last 2 Chrome versions",
            "last 2 Firefox versions",
            "last 2 Safari versions",
            "last 2 iOS versions",
            "last 1 Android version",
            "last 1 ChromeAndroid version",
            "ie 11",
          ],
        },
      },
    ],
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
    "@babel/preset-typescript",
  ];
};

const plugins = () => {
  const plugin = [
    ["@babel/plugin-transform-object-rest-spread", { loose: true }],
    ["@babel/plugin-transform-optional-chaining", { loose: true }],
    "@babel/plugin-transform-react-jsx",
  ];
  if (process.env.NODE_ENV === "production") {
    plugin.push(["react-remove-properties", { properties: ["data-testid"] }]);
  }
  return plugin;
};

module.exports = function (api) {
  return {
    plugins: plugins(),
    presets: presets(api),
    ignore: [/@babel[\\|/]runtime/],
    comments: false,
  };
};
