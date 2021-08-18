/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/naming-convention */
const Jasmine = require("jasmine");
/* eslint-enable @typescript-eslint/naming-convention */
/* eslint-enable @typescript-eslint/no-require-imports */
/* eslint-enable @typescript-eslint/no-var-requires */

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
    /* eslint-disable @typescript-eslint/naming-convention */
    spec_dir: "./out-tsc",
    spec_files: [
        "**/*.[sS]pec.js"
    ]
    /* eslint-enable @typescript-eslint/naming-convention */
});

jasmine.execute();
