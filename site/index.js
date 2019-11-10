const buildingSelect = document.getElementById("buildings");

function updateBuilding(){
  console.log(buildingSelect.value);
  loadData();
}

buildingSelect.addEventListener("change", updateBuilding, false);
console.log(buildingSelect);

var req = new XMLHttpRequest();
req.onload = function(){
  console.log("LOAD");
  if(this.status == 200){
		console.log(req.responseText);
    var data = JSON.parse(req.responseText);
    data = data[buildingSelect.value];
    let ret = "";

    if(data){
      Object.keys(data).forEach(v => {

        ret+=`<tr><td>${v}</td><td>${data[v].data}</td></tr>`;
      });
    }

    document.getElementById("results").innerHTML = ret;
  }
};

function loadData(){
  if(buildingSelect.value!=""){
    console.log("REQ");
    req.open("GET", "/_get/", true);
    req.send();
    // setTimeout(loadData(), 60000);
  }
}
