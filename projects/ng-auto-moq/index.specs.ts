import Jasmine from "jasmine";
import "core-js/proposals/reflect-metadata.js";
import "@angular/compiler";

const runner = new Jasmine({}) as any;
runner.configureDefaultReporter({
    print: arg => {
        if (arg !== "[32m.[0m") {
            process.stdout.write(arg);
        }
    },
    showColors: true
});

runner.loadConfig({
    /* eslint-disable @typescript-eslint/naming-convention */
    spec_dir: "./specs/ng-auto-moq",
    spec_files: [
        "**/*.[sS]pec.js"
    ]
    /* eslint-enable @typescript-eslint/naming-convention */
});

runner.execute();
