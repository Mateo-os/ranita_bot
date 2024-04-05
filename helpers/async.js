function lock(lock){
    while(lock){
        continue;
    }
    return true;
}

function unlock(lock){
    lock = false;
    return lock;
}

module.exports = { lock , unlock}