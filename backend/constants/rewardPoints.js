const REWARD_POINTS = {
  "Mobile Phone": 20,
  "Laptop": 60,
  "Battery": 10,
  "Television": 50,
};

const DEFAULT_REWARD = 15;

const getRewardPoints = (category) => REWARD_POINTS[category] || DEFAULT_REWARD;

module.exports = { REWARD_POINTS, getRewardPoints };