const envVars = require("preact-cli-plugin-env-vars");
import asyncPlugin from "preact-cli-plugin-async";

export default function(config, env, helpers) {
  envVars(config);
  let babel = config.module.loaders.filter(
    loader => loader.loader === "babel-loader"
  )[0].options;

  // Blacklist regenerator within env preset:
  babel.presets[0][1].exclude.push(
    "transform-async-to-generator",
    "transform-regenerator"
  );

  // Replace stage-1 preset with an inlined, flattened version without regenerator:
  babel.presets.pop();
  babel.plugins.push(
    "transform-export-extensions",
    "syntax-dynamic-import",
    "transform-class-properties",
    "transform-object-rest-spread"
  );

  // Add Kneden
  if (env.production) {
    babel.plugins.push(require.resolve("babel-plugin-async-to-promises"));
  }
}
