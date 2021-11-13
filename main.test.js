const read_excel = require("danfojs-node").read_excel;
const { getSubTests, Locations, Departments } = require('./main.js');
const test7Fixture = require('./testFixtures/case7.test.json');


describe("Read File", () => {
 
    let df;
    beforeAll(async () => {
        try {
            df = await read_excel("./case7.xlsx");
        }
        catch (err) {
            console.error(err.message);
        }
    });

    test("check subtests", () => {
        expect(getSubTests(df)).toStrictEqual(test7Fixture);
    })


    test("check locations", () => {
        const locations = new Locations(df)
        expect(locations.get()).toStrictEqual(['Mixed', 'Vegetarian'])
        expect(locations.getWithIndices()).toStrictEqual({ 'Mixed': 0, 'Vegetarian': 1 })

    })

    test("check departments", () => {
        const departments = new Departments(df)
        expect(departments.get()).toStrictEqual(['Cogen', 'Store', 'Safety', 'LGMD', 'QC', 'Maintainence', 'DMH', 'ETP', 'Electrical', 'Instrumentation', 'Starch', 'Purchase', 'Industrial Purchase', 'Stores', 'Logistics', 'CWM', 'Manufacture', 'Quality', 'MSP', 'Maize', 'Finance', 'Civil', 'IT', 'Deravative', 'Accounts', 'Production', 'Supply Planning', 'DM Plant', 'COGEN', 'HR', '-', 'Quality Control', 'Environment', 'Maize Purchase', 'HSE', 'Crusing Operator', 'Export', 'MDH', 'Maize Quality Control', 'Process', 'Project', 'OHC', 'Quality Analyst', 'WTP', 'Supply Chain', 'SCM', 'Technician', 'Mechanical', 'Manufacturing Exc', 'DMH & LG', 'Manufacturing', 'SC', 'Bioproduct'])
    })

}
)