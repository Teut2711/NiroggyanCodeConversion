const { Filter } = require('./utils')

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

module.exports = {
    ProfileList,
    Profile,
}