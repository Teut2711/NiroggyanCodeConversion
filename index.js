const read_excel = require("danfojs-node").read_excel;
const fs = require("fs");

const { LocationList, Location } = require('./app/Location');
const { Department } = require('./app/Department');
const { Profile } = require('./app/Profile');
const { Section } = require('./app/Section');


(async function () {
    try {
        const zip = (list1, list2) => {
            return list1.map((v, i) => [v, list2[i]]);
        }

        const testsDf = await read_excel("./case7.xlsx");

        testsDf.addColumn({ "column": "Age Group", "values": testsDf["Age"].apply(x => Number(x) > 40 ? "old" : "young"), inplace: true })
        testsDf.drop({
            columns: ["Age",
                'Patient Name',
                'MRN',
                'Result Value'
            ], inplace: true
        })


        let df = testsDf;
        df = dropNulls(df);

        const allLocations = df["Location"].unique().values
        const allDepartments = df["Dept"].unique().values
        const allGenders = df["Gender"].unique().values
        const allAgeGroups = df["Age Group"].unique().values
        const allTestNames = df["Test Name"].unique().values

        let dfGroupBy = df.groupby(["Location", "Dept", "Test Name", "Gender", "Age Group"])

        const locationsList = new LocationList();
        


        allLocations.forEach(
            location => {
                let aLocation = new Location(location)
                locationsList.add(aLocation)


                allDepartments.forEach(
                    department => {
                        let aDepartment = new Department(department)
                        aLocation.add(aDepartment)

                        allTestNames.forEach(
                            testName => {
                                let aProfile = new Profile(testName)
                                aDepartment.add(aProfile);

                                allGenders.forEach(
                                    gender =>
                                        allAgeGroups.forEach(
                                            ageGroup => {

                                                let group = dfGroupBy.get_groups([location, department, testName, gender, ageGroup]);
                                                if (group && group.shape[0] > 0) {
                                                    let aSection = new Section(gender, ageGroup, group);
                                                    aProfile.add(aSection);
                                                }

                                            }))
                            })
                    })
            }
        )

        writeJSON(locationsList.data)


        function writeJSON(data) {

            // write JSON string to a file
            fs.writeFile('user.json', JSON.stringify(data, null, '\t'), (err) => {
                if (err) {
                    throw err;
                }
                console.log("JSON data is saved.");
            });
        }
    }
    catch (err) {
        console.log(err.message);
    }
})();


function dropNulls(df) {
    ["Location", "Dept", "Gender", "Age Group"].forEach(item => {
        df = df.query({ condition: df[item].apply(x => !([undefined, ""].includes(x))).values });
    });
    return df;
}

