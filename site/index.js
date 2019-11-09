const buildingSelect = document.getElementById("buildings");

function updateBuilding(){
  console.log(buildingSelect.value);
}

buildingSelect.addEventListener("change", updateBuilding, false);
console.log(buildingSelect);
