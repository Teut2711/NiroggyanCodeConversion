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
