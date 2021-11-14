const { Filter } = require('./utils');

class Section {
    #ageGroup = '';

    #gender = '';

    index = null;

    #attributes = {};

    constructor(gender, ageGroup, df) {
        this.#gender = gender;
        this.#ageGroup = ageGroup;
        this.#setattributes(df);
    }

    static applyFilters(df, filters) {
        let temp = df;
        filters.forEach((aFilter) => {
            temp = aFilter.applyOn(temp);
        });
        return temp;
    }

    #setattributes(df) {
        const filtersAnomaly = [
            new Filter('Impression', '!=', 'Normal'),
            new Filter('Impression', '!=', 'Inrange'),
        ];
        const countAgeGroupGender = `count${this.#ageGroup.charAt(0).toUpperCase()}${this.#ageGroup.slice(1)}${this.#gender.charAt(0).toUpperCase()}${this.#gender.slice(1)}`;
        this.#attributes = {
            [countAgeGroupGender]: df?.shape[0],
            [`${countAgeGroupGender}Anomalies`]: Section.applyFilters(df, filtersAnomaly)?.shape[0],
            subTests: df['Observation Name'].unique().values,
        };
    }

    get data() {
        return this.#attributes;
    }
}

module.exports = {
    Section,
};
