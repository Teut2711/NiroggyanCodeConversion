const { DepartmentList } = require('./Department');

class LocationList {
    #items = [];

    add(location) {
        const loc = location;
        if (loc.index === null) { loc.index = this.#items.length; }
        this.#items.push(loc);
    }

    get data() {
        return this.#items.map((item) => item.data);
    }

    map(f) {
        return this.#items.map(f);
    }
}

class Location {
    #name = '';

    #departments = [];

    index = null;

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
            departments: this.#departments.data,
        };
    }
}

module.exports = {
    Location,
    LocationList,
};
