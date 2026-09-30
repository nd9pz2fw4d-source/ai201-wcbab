import path from "node:path";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// The video reuses brand tokens, logo paths and station names from the deck in ../src.
// Resolve every package from this folder first, so those files share this folder's React and lucide-react.
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    modules: [path.join(process.cwd(), "node_modules"), "node_modules"],
  },
}));
