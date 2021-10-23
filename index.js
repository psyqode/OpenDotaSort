let laneRoleData
let heroData

const calculateWinPercentage = (rawData) => {
  for (let i = 0; i < rawData.length; i++) {
    const games = rawData[i].games
    const wins = rawData[i].wins

    const winPercentage = wins/games

    rawData[i].winPercentage = winPercentage
  }

  return rawData
}


const fetchRoleData = async () => {
  const data = await fetch('https://api.opendota.com/api/scenarios/laneRoles')
    .then((resp) => resp.json())

  const dataWithWinPercentage = calculateWinPercentage(data)

  laneRoleData = dataWithWinPercentage;
}


const fetchHeroData = async () => {
  const data = await fetch('https://api.opendota.com/api/heroes')
    .then((resp) => resp.json())

  heroData = data;
}


const setup = () => {
  fetchRoleData()
  fetchHeroData()
}

setup()
