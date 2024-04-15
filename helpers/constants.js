const EPHIMERAL_ROLL_LIMIT = 15;

const CARDS_PER_ROLL = 3;

const REC_POINTS_PER_ROLL = 100;

const ROLL_PRICE = 1;

const rarities = {
    1: 'COMÚN',
    2: 'POCO COMÚN',
    3: 'RARA',
    4: 'ÉPICA',
    5: 'LEGENDARIA',
    6: 'IMPOSIBLE',
}

const buy_price = {
    1: 1.0,
    2: 0.5,
    3: 3,
    4: 21,
    5: 150,
    6: 300
}

const sell_price = {
    1: 0.02,
    2: 0.1,
    3: 0.7,
    4: 4,
    5: 44,
    6: 88
}

const recycle_points = {
    1: 3,
    2: 15,
    3: 95,
    4: 500,
    5: 5400,
    6: 0
}


module.exports = { 
    rarities, 
    recycle_points,
    sell_price,
    buy_price, 
    EPHIMERAL_ROLL_LIMIT, 
    CARDS_PER_ROLL, 
    REC_POINTS_PER_ROLL,
    ROLL_PRICE
}

