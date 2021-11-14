class ProfileList {
    #items = [];

    add(profile) {
        const temp = profile;
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

class Profile {
    #name = '';

    #comment = '';

    #sections = [];

    #subtests = [];

    index = null;

    constructor(name, comment = '') {
        this.#name = name;
        this.#comment = comment || 'Hello';
    }

    add(section) {
        this.#sections.push(section);
    }

    get data() {
        const temp = this.#sections.map((item) => item.data);
        const subTests = [...new Set([].concat(...temp.map((item) => item.subTests)))];
        temp.forEach((item) => {
            delete item.subTests;
        });

        return {
            index: this.index,
            name: this.#name,
            ...Object.assign({}, ...temp),
            subTests,
            comment: this.#comment,
        };
    }
}

module.exports = {
    ProfileList,
    Profile,
};
