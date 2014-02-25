function start(){
	var d = new Date();
	var seed = d.getTime();
	var randArr = new Array(100);
	var amount = 100;
	showNum = document.getElementById("showNum");
	randArr = getMultiRandomNumber(seed,amount);
	for (var i = 0; i < amount; i++){
		showNum.innerHTML = showNum.innerHTML + "<br>" + randArr[i].toString();
	}
	//hello.innerHTML = test.toString();
}

function random(seed){
  return (seed * 279470273) % 4294967291;
}
//get multiple random numbers by one seed
function getMultiRandomNumber(seed, amount){
    var numArr = new Array();
    for (var i = 0; i < amount; i++){
        a = random(seed+random(seed));
        numArr[i] = a;
        seed = a;
    }
    return numArr;
}
       
    
