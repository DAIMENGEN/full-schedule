const scss = require("rollup-plugin-scss");
module.exports = {
    rollup(config, options) {
        config.plugins.push(scss({
            fileName: "full-schedule.css",
        }));
        return config;
    },
};