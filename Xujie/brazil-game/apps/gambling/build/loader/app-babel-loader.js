// Export from "./my-custom-loader.js" or whatever you want.
module.exports = require('babel-loader').custom((babel) => {
  console.log('my-loader-babel', babel);

  // Extract the custom options in the custom plugin
  function myPlugin(api, { opt1, opt2 }) {
    // console.log("my-loader-babel.api", api);
    // console.log("my-loader-babel.opt1", opt1);
    // console.log("my-loader-babel.opt2", opt2);

    return {
      visitor: {},
    };
  }

  return {
    // Passed the loader options.
    customOptions({ opt1, opt2, ...loader }) {
      return {
        // Pull out any custom options that the loader might have.
        custom: { opt1, opt2 },

        // Pass the options back with the two custom options removed.
        loader,
      };
    },

    // Passed Babel's 'PartialConfig' object.
    config(cfg, { customOptions }) {
      if (cfg.hasFilesystemConfig()) {
        // Use the normal config
        // console.log("Use the normal config.cfg.options", cfg.options)
        return cfg.options;
      }
      // console.log("cfg.options", cfg.options)
      // console.log("cfg.options.plugins", cfg.options.plugins)

      return {
        ...cfg.options,
        plugins: [
          ...(cfg.options.plugins || []),

          // Include a custom plugin in the options and passing it the customOptions object.
          [myPlugin, customOptions],
        ],
      };
    },

    result(result) {
      // console.log(result)
      // console.log("result.code", result.code);
      return {
        ...result,
        code: result.code + '\n// Generated by some custom loader',
      };
    },
  };
});