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

const REC_POINTS_PER_ROLL = 100;

const recycle_points = {
    1: 9,
    2: 91,
    3: 270,
    4: 1470,
    5: 15100
}


module.exports = { rarities, recycle_points, EPHIMERAL_ROLL_LIMIT, CARDS_PER_ROLL, REC_POINTS_PER_ROLL }