class EventStore {
    constructor() {
        this.subs = {}
    }

    /**
    *@name: on
    *@args: eventType:string, cb: Function
    *@return: void
    *@description: 注册事件,存入subs
    *@author: WE!D
    *@time: 2022/12/20
    */
    on(eventType, cb) {
        const { subs } = this
        if(typeof cb !== "function") throw new Error('callback is required')
        if(!subs || !subs[eventType]) {
            subs[eventType] = [ cb ]
            return
        }
        subs[eventType].push(cb)
    }

    /**
    *@name: emit
    *@args: eventType:string
    *@return: void
    *@description: 派发事件, 执行回调
    *@author: WE!D
    *@time: 2022/12/20
    */
    emit(eventType) {
        const { subs } = this
        if(subs[eventType]) {
            subs[eventType].forEach(cb=> cb())
        }
    }
}

export default EventStore
