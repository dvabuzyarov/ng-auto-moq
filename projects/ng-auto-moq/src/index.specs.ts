/* tslint:disable:no-var-requires */
/* tslint:disable: no-require-imports */
const Jasmine = require("jasmine");
/* tslint:enable: no-require-imports */
/* tslint:enable:no-var-requires */

import "reflect-metadata";

const jasmine = new Jasmine({}) as any;
jasmine.configureDefaultReporter({
  print: arg => {
    if (arg !== "[32m.[0m") {
      process.stdout.write(arg);
    }
  },
  showColors: true
});

jasmine.loadConfig({
  spec_dir: "./out-tsc",
  spec_files: [
    "**/*.[sS]pec.js"
  ]
});

jasmine.execute();
