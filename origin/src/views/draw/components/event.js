class EventStore {
    constructor() {
        this.subs = {}
    }

    on(eventType, cb) {
        const { subs } = this
        if(typeof cb !== "function") throw new Error('callback is required')
        if(!subs || !subs[eventType]) {
            subs[eventType] = [ cb ]
            return
        }
        subs[eventType].push(cb)
    }

    emit(eventType) {
        const { subs } = this
        if(subs[eventType]) {
            subs[eventType].forEach(cb=> cb())
        }
    }
}

export default EventStore
