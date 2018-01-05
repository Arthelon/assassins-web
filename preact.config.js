const envVars = require("preact-cli-plugin-env-vars");
import asyncPlugin from "preact-cli-plugin-async";

export default function(config) {
  envVars(config);
  asyncPlugin(config);
}
