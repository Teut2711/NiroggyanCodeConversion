const dfd = require("danfojs-node");



let testNameMapper = {
    "Complete Blood Count": "Complete Blood Count",
    "Kidney": "Body screening ",
    "Lipids": "BP & BMI",
    "Thyroid": "Thyroid Function Test (TFT)",
    "Liver": "LIVER FUNCTION TEST",
    "Diabetes": "Diabetes",
    "Vitamin D": "Vitamin D",
    "Vitamin B12": "Vitamin B12:(Cyanocobalamin)",
    "Electrolytes & Minerals": "Fasting Blood Glucose (FBS)",
    "Anemia": "Iron Studies (for Anemia Screening)",
    "Urine": "Urine",
    "Body Screening": "Body Screening",
    "BP & BMI": "BP & BMI",
    "Covid": "Covid",
    "Body Systems": "Body Systems",
    "Lifestyle & Occupation": "Lifestyle & Occupation"
};






module.exports = {
    getSubTests: function (tests) {
        let testNames = tests["Test Name"].unique().values;
        let testsGroupedBy = tests.groupby(["Test Name"]);

        let subTests = Object.fromEntries(testNames.map(testName => {
            const subTestsOfTest = testsGroupedBy.get_groups([testName]).column("Observation Name").drop_duplicates().values;
            return [testName, subTestsOfTest];
        }));

        return subTests;
    }
}




//     //.apply(lambda x: x["Observation Name"].drop_duplicates().to_list()).to_dict()