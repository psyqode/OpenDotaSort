let laneRoleData
let heroData


const consolidateGameTimes = (data) => {
  const splitHeroData = []

  data.forEach((laneRole) => {
    const newHeroArray = []

    if (splitHeroData[laneRole.hero_id - 1]) {
      newHeroArray.push(...splitHeroData[laneRole.hero_id - 1])
    }

    newHeroArray.push(laneRole)

    splitHeroData[laneRole.hero_id - 1] = newHeroArray
  })

  const consolidatedData = []

  splitHeroData.forEach((heroArray) => {

    let games = 0
    let wins = 0


    heroArray.forEach(laneRoleData => {
      games = parseInt(laneRoleData.games) + games;
      wins = parseInt(laneRoleData.wins) + wins;
    })

    const newHeroLaneData = {
      hero_id: heroArray[0].hero_id,
      lane_role: heroArray[0].lane_role,
      games: games,
      wins: wins,
    }

    consolidatedData.push(newHeroLaneData)
  })


  return consolidatedData
}


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
  const data = await fetch('https://api.opendota.com/api/scenarios/laneRoles?lane_role=3')
    .then((resp) => resp.json())

  return data
}


const fetchHeroData = async () => {
  const data = await fetch('https://api.opendota.com/api/heroStats')
    .then((resp) => resp.json())

  return data
}

function compare(a, b) {
  if (a.winPercentage > b.winPercentage) {
    return -1;
  }
  if (a.winPercentage < b.winPercentage) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

const sortByWinPercentage = (data) => {
  const sortedData = data.sort(compare)
  return sortedData
}





// UI logic
const renderHeroList = () => {

  const formatWinPercentage = (winPercentageDecimal) => Math.round(winPercentageDecimal * 100) + '%';


  laneRoleData.forEach((laneRole) => {
    const sortedHeroList = document.getElementById('SortedHeroList')

    // query template and then clone for new hero
    const heroListItem = document.getElementsByClassName('hero_list_item')[0]
    const newHeroListItem = heroListItem.cloneNode(true)


    // get hero specific shit
    let heroName;
    heroData.forEach(hero => {
      if (laneRole.hero_id === hero.id) {
        heroName = hero.localized_name
      }
    })


    // write data into cloned hero list item
    newHeroListItem.getElementsByClassName('hero_name')[0].appendChild(document.createTextNode(heroName))

    const formattedWinPercentage = formatWinPercentage(laneRole.winPercentage)
    newHeroListItem.getElementsByClassName('hero_win_percentage')[0].appendChild(document.createTextNode(formattedWinPercentage))



    // append new list item into container
    sortedHeroList.appendChild(newHeroListItem)

  })

}





const setup = async () => {
  const lrData = await fetchRoleData()

  const consolidatedData = consolidateGameTimes(lrData)

  const dataWithWinPercentage = calculateWinPercentage(consolidatedData)

  const sortedData = sortByWinPercentage(dataWithWinPercentage)

  laneRoleData = sortedData;

  heroData = await fetchHeroData()

  renderHeroList()
}

setup()
