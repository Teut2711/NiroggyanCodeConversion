const { read_excel: readExcel } = require('danfojs-node');
const fs = require('fs');

const { LocationList, Location } = require('./app/Location');
const { Department } = require('./app/Department');
const { Profile } = require('./app/Profile');
const { Section } = require('./app/Section');

// const zip = (list1, list2) => list1.map((v, i) => [v, list2[i]]);

function dropNulls(df) {
    let temp = df;
    ['Location', 'Dept', 'Gender', 'Age Group'].forEach((item) => {
        temp = temp.query({
            condition: df[item].apply(
                (x) => !([undefined, ''].includes(x)),
            ).values,
        });
    });
    return temp;
}

(async function main() {
    try {
        const testsDf = await readExcel('./case7.xlsx');

        testsDf.addColumn({
            column: 'Age Group',
            values: testsDf.Age.apply(
                (x) => (Number(x) > 40 ? 'old' : 'young'),
            ),
            inplace: true,
        });
        testsDf.drop({
            columns: ['Age', 'Patient Name', 'MRN', 'Result Value'],
            inplace: true,
        });

        const df = dropNulls(testsDf);

        const allLocations = df.Location.unique().values;
        const allDepartments = df.Dept.unique().values;
        const allGenders = df.Gender.unique().values;
        const allAgeGroups = df['Age Group'].unique().values;
        const allTestNames = df['Test Name'].unique().values;

        const dfGroupBy = df.groupby(
            ['Location', 'Dept', 'Test Name', 'Gender', 'Age Group'],
        );

        const locationsList = new LocationList();

        allLocations.forEach(
            (location) => {
                const aLocation = new Location(location);
                locationsList.add(aLocation);

                allDepartments.forEach(
                    (department) => {
                        const aDepartment = new Department(department);
                        aLocation.add(aDepartment);

                        allTestNames.forEach(
                            (testName) => {
                                const aProfile = new Profile(testName);
                                aDepartment.add(aProfile);

                                allGenders.forEach(
                                    (gender) => allAgeGroups.forEach(
                                        (ageGroup) => {
                                            const group = dfGroupBy.get_groups(
                                                [location, department,
                                                    testName, gender, ageGroup],
                                            );
                                            if (group && group.shape[0] > 0) {
                                                const aSection = (
                                                    new Section(
                                                        gender,
                                                        ageGroup,
                                                        group,
                                                    ));
                                                aProfile.add(aSection);
                                            }
                                        },
                                    ),
                                );
                            },
                        );
                    },
                );
            },
        );

        fs.writeFile(
            'user.json',
            JSON.stringify(locationsList.data, null, '\t'),
            (err) => {
                if (err) {
                    throw err;
                }
            },
        );
        // eslint-disable-next-line no-console
        console.log('File saved');
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err.message);
    }
}());
