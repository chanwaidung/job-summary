export function singleton(className) {
    let instance = null;
    return new Proxy(className, {
        construct(target, argArray) {
            if(instance) return instance;
            return (instance = new target(...argArray));
        }
    })
}
