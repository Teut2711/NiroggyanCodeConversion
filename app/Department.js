const { ProfileList } = require('./Profile');

class DepartmentList {
    #items = [];

    add(department) {
        const temp = department;
        if (temp.index === null) { temp.index = this.#items.length; }
        this.#items.push(temp);
    }

    get data() {
        return this.#items.map((item) => item.data);
    }

    map(f) {
        return this.#items.map(f);
    }
}

class Department {
    #name = '';

    #profiles = [];

    index = null;

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
            profiles: this.#profiles.data,
        };
    }
}

module.exports = {
    Department,
    DepartmentList,
};
