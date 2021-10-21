const fetchRoleData = async () => {
  const data = await fetch('https://api.opendota.com/api/scenarios/laneRoles?lane_role=3')
    .then((resp) => resp.json())


  document.body.innerHTML = JSON.stringify(data)
}

fetchRoleData()
