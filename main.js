const zip = (list1, list2) => {
    return list1.map((v, i) => [v, list2[i]]);
}


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



class Base {
    constructor(df) {
        this.df = df;
    }

    getWithIndices() {
        return Object.fromEntries(this.get().map((element, index) => [element, index]));
    }
}


const GenderTypes = {
    male: "Male",
    female: "Female"
}

const AgeGroup = {
    young: "young",
    old: "old",
}


class Filter {
    constructor(column, comparator, value) {
        this.column = column;
        this.value = value;
        this.comparator = comparator;
    }

    applyOn(df) {
        const initialColumns = df.columns;
        let temp = df;
        if (df.shape[0] > 0) {
            temp = df.query(this.#getquery());
            const finalColumns = temp.columns;
            const mapping = Object.fromEntries(initialColumns.map((v, i) => [finalColumns[i], v]));
            temp = temp.rename({ mapper: mapping })
        }
        return temp;
    }

    #getquery() {
        return {
            column: this.column,
            is: this.comparator,
            to: this.value
        }
    }
};











class LocationList {
    #items = []
    add(location) {
        if (location.index === null)
            location.index = this.#items.length;
        this.#items.push(location);
    }
    get data() {
        return this.#items.map(item => item.data);
    }
    map(f) {
        return this.#items.map(f)

    }

}


class DepartmentList {
    #items = []
    add(department) {
        if (department.index === null)
            department.index = this.#items.length;
        this.#items.push(department);
    }
    get data() {
        return this.#items.map(item => item.data);
    }
    map(f) {
        return this.#items.map(f)

    }

}

class ProfileList {
    #items = []
    add(profile) {
        if (profile.index === null)
            profile.index = this.#items.length;
        this.#items.push(profile);
    }
    get data() {
        return this.#items.map(item => item.data);
    }
    map(f) {
        return this.#items.map(f)

    }

}

class Location {
    #name = "";
    #departments = [];
    index = null

    constructor(name) {
        this.#departments = new DepartmentList();
        this.#name = name;
    }

    add(department) {
        this.#departments.add(department);
    }

    get data() {
        return {
            index: this.index,
            location: this.#name,
            departments: this.#departments.data
        }

    }
}

class Department {
    #name = "";
    #profiles = [];
    index = null

    constructor(name) {
        this.#profiles = new ProfileList();
        this.#name = name;
    }

    add(profile) {
        this.#profiles.add(profile);
    }

    get data() {
        return {
            index: this.index,
            department: this.#name,
            profiles: this.#profiles.data
        };
    }
}



class Profile {
    #name = ""
    #comment = ""
    #sections = []
    #subtests = []
    index = null
    constructor(name, comment = "") {
        this.#name = name;
        this.#comment = comment || "Hello";

    }

    add(section) {
        this.#sections.push(section);
    }
    get data() {
        return {
            index: this.index,
            name: this.#name,
            ...Object.assign({}, ...this.#sections.map(item => item.data)),
            comment: this.#comment,
            subTests: this.#subtests
        }
    }

}
class Section {
    #ageGroup = ""
    #gender = ""
    index = null
    #attributes = {}
    constructor(gender, ageGroup, df) {
        this.#gender = gender;
        this.#ageGroup = ageGroup;
        this.#setattributes(df)
    }

    #applyFilters(df, filters) {
        let temp = df;
        for (let aFilter of filters)
            temp = aFilter.applyOn(temp)
        return temp;
    };
    #setattributes(df) {

        const filtersAnomaly = [
            new Filter("Impression", "!=", "Normal"),
            new Filter("Impression", "!=", "Inrange")
        ]
        const countAgeGroupGender = "count" +
            this.#ageGroup.charAt(0).toUpperCase() +
            this.#ageGroup.slice(1) +
            this.#gender.charAt(0).toUpperCase() +
            this.#gender.slice(1);
        this.#attributes = {
            [countAgeGroupGender]: df?.shape[0],
            [`${countAgeGroupGender}Anomalies`]: this.#applyFilters(df, filtersAnomaly)?.shape[0]
        }
    }

    get data() {
        return this.#attributes
    }

}

module.exports = {
    getSubTests: function (testsDf) {

        let testNames = testsDf["Test Name"].unique().values;
        let testsGroupedBy = testsDf.groupby(["Test Name"]);

        let subTests = Object.fromEntries(testNames.map(testName => {
            const subTestsOfTest = testsGroupedBy.get_groups([testName]).column("Observation Name").drop_duplicates().values;
            return [testName, subTestsOfTest];
        }));

        return subTests;
    },
    LocationList,
    DepartmentList,
    Location,
    Department,
    Profile,
    Section,

    Filter
}