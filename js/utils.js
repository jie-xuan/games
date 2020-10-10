function createEle( elename, heightArr, styleobj){

    var oDiv = document.createElement(elename);

      for(var i=0; i<heightArr.length; i++){
          oDiv.classList.add(heightArr[i]);
        
      }

      for(var key in styleobj){

           oDiv.style[key]= styleobj[key];
      }

      return oDiv;

}

function setLocal(key,value){
    if(value.type ==='object' || value !=null){
       var value = JSON.stringify(value);
       localStorage.setItem(key,value);
    }


}

function getLocal(key){

    var value =localStorage.getItem(key);
    if(value === null){
        return value;
    }
    if(value[0]==='[' ||value[0]==='{'){
      return  JSON.parse(value);
       
    }
        return value;

}

function formatNumber(number){

    if(number <10){
        return '0' + number;
    }

    return number;

}