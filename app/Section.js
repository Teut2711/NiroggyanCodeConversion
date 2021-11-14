const { Filter } = require('./utils')

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
    Section
} 