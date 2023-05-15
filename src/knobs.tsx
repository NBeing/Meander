export const coarseIncEndlessEncoder = (e, knobNumber) => {
    return e.rawValue
}

export const noteLengths = [1 / 32, 1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2]

export const cycleArrayOfValuesEndlessEncoder = (e, knobNumber, params) => {
    const { arrayToCycle } = params
    return arrayToCycle[e.rawValue % arrayToCycle.length]
}
export class Knobs {
    knobTrackers = []
    types = {
        cycle: cycleArrayOfValuesEndlessEncoder,
        value: coarseIncEndlessEncoder,
    }
    constructor() { }

    addKnobHandler(name, knobNumber, type, initialValue, params = {}) {
        this.knobTrackers.push({
            knobNumber,
            name,
            value: initialValue,
            prevValue: initialValue,
            type: type,
            params,
            handler: this.types[type]
        })
        // console.log("Updated knobTrackers", this.knobTrackers)

    }
    getKnobValue(name) {
        let knobIndex = this.knobTrackers.findIndex(knobObj => {
            return knobObj.name == name
        })
        if (knobIndex == -1) {
            debugger;
            return
        }
        return this.knobTrackers[knobIndex].value
    }
    updateKnobs(e) {
        const knobNumber = e.dataBytes[0]
        let knobIndex = this.knobTrackers.findIndex(knobObj => {
            return knobObj.knobNumber == knobNumber
        })
        if (knobIndex == -1) {
            return
        }
        // console.log("Found Knob!", knobIndex)
        const updatedValue = this.knobTrackers[knobIndex].handler(e, knobNumber, this.knobTrackers[knobIndex].params)
        this.knobTrackers[knobIndex].value = updatedValue
        // console.log("Updated knobTrackers", this.knobTrackers)
    }
}
