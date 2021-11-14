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
            temp = temp.rename({ mapper: mapping });
        }
        return temp;
    }

    #getquery() {
        return {
            column: this.column,
            is: this.comparator,
            to: this.value,
        };
    }
}

module.exports = {
    Filter,
};
