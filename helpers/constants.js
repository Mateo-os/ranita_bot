const EPHIMERAL_ROLL_LIMIT = 15;

const CARDS_PER_ROLL = 3;

const rarities = {
    1: 'COMÚN',
    2: 'POCO COMÚN',
    3: 'RARA',
    4: 'ÉPICA',
    5: 'LEGENDARIA',
    6: 'IMPOSIBLE',
}

const recycle_points = {
    1: 2,
    2: 2,
    3: 5,
    4: 20,
    5: 200
}


module.exports = { rarities, recycle_points, EPHIMERAL_ROLL_LIMIT, CARDS_PER_ROLL }