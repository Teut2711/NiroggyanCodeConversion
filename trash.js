
class PersonCount {
    #df = null;
    #filters = {};
    #totals = {}
    #anomalies = {}
    #percentages = {}
    constructor(df, filtersGeneral, filtersAnomaly) {

        this.#df = df;
        this.#filters = {
            general: filtersGeneral,
            anomaly: filtersAnomaly
        }

        this.#setAttributes(df);
    };


    get totals() {
        return this.#totals;

    }
    get anomalies() {
        return this.#anomalies;

    }

    get percentages() {
        return this.#percentages
    }
    get attributes() {
        return {
            percentages: this.#percentages,
            anomalies: this.#anomalies,
            totals: this.#totals
        }
    }

    #applyFilters(df, filters) {

        let temp = df;

        for (let aFilter of filters)
            temp = aFilter.filter(temp)

        return temp;
    };


    #setAttributes() {

        let filteredDf = this.#df;

        this.#setTotals(filteredDf);

        this.#setAnomalies(filteredDf);

        this.#setPercentages();

    }



    #setTotals(filteredDf) {

        filteredDf = this.#applyFilters(filteredDf, this.#filters.general);
        this.#totals = this.#getValueCounts(filteredDf);
    }


    #setAnomalies(filteredDf) {
        filteredDf = this.#applyFilters(filteredDf, this.#filters.anomaly);
        this.#anomalies = this.#getValueCounts(filteredDf);


        // initialize keys in anomalies to 0 which only exist in `total`

        if (this.#totals) {
            Object.keys(this.#totals).forEach(k => {
                if (!this.#anomalies.hasOwnProperty(k)) {
                    this.#anomalies[k] = 0;
                }
            })
        }

    }

    #setPercentages() {
        if (this.#totals && this.#anomalies)
            Object.keys(this.#totals).forEach(k => {
                this.#percentages[k] = (this.#anomalies[k] / this.#totals[k]) * 100;
            })

    }
    #getValueCounts(filteredDf) {
        if (filteredDf.shape[0] > 0) {

            let valueCounts = filteredDf["Test Name"].value_counts();
            return Object.fromEntries(zip(valueCounts.index, valueCounts.values));
        }

        return {}
    }
}