const main = require('./main.js');
const dfd = require("danfojs-node");

(async function () {
    try {
        const tests = await dfd.read_excel(source = "./case7.xlsx");
        const subTests = main.getSubTests(tests);
        

    }
    catch (err) {
        console.error(err.message);
    }
})();
