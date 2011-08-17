(function(global) {

  var JSDB = function(DBname){

  var data = [];
  var index = {};

  this.getName = function(){return DBname};

  this.push = function(obj){data.push(obj);};

  this.addIndex = function(name){
    if(index[name]) return false;
    var len = data.length;
    var indexObj = {};
    for(var i = 0; i < len; i++){
      if(data[i][name]){
        if(indexObj[data[i][name]])
          indexObj[data[i][name]].push(i);
        else
          indexObj[data[i][name]]=[i];
      }
    }
    index[name] = indexObj;
    return true;
  };

  this.save = function(saveIndex){
    try{
	  if('localStorage' in window && window['localStorage'] !== null){
	    localStorage.setItem("JSDB."+DBname,JSON.stringify(data));
	    if(saveIndex){
	      localStorage.setItem("JSDB.index."+DBname,JSON.stringify(index));
	    }
	    return true;
	  }
	}catch(e){}
    return false;
  };

  this.load = function(){
    try{
	  if('localStorage' in window && window['localStorage'] !== null){
	    data = JSON.parse(localStorage.getItem("JSDB."+DBname));
	    index = JSON.parse(localStorage.getItem("JSDB.index"+DBname));
	    return true;
	  }
	}catch(e){}
    return false;
  };

  this.getById = function(num){return data[num];};

  this.find = function(obj,num){
    var key;
    var result = {};
    var resIndex = [];
    var temp;
    var check;
    var indResult;
    var indRR;
    var ok;
    var init = true;
    for(key in obj){
      if(!(obj[key] instanceof Array))
        ok = [obj[key]];
      else
        ok = obj[key];
      if(init){
        for(var i=0,l=ok.length;i<l;i++){
          if((indResult = index[key])&&(indRR = indResult[ok[i]])){
            resIndex = resIndex.concat(indRR);
          }
        }
        init = false;
      }
      else{
        temp = [];
        for(i=0,l=ok.length;i<l;i++){
		  if((indResult = index[key])&&(indRR = indResult[ok[i]])){
		     temp = temp.concat(indRR);
		   }
        }
        check = [];
        for(i=0,l=temp.length;i<l;i++){
          if(JSDB.isIn(temp[i],resIndex)>-1){
            check.push(temp[i]);
          }
        }
        resIndex = check;
      }
    }
    for(i=0,l=Math.min(resIndex.length,(num||Infinity));i<l;i++){
      result[resIndex[i]] = data[resIndex[i]];
    }
    return result;
  };


  };

  JSDB.VERSION = '0.0.6';

  JSDB.isIn = function(item, arr){
    var len = arr.length;
    for(var i = 0; i < len; i++){
      if(arr[i]==item){
        return i;
      }
    }
    return -1;
  };

  if (global.JSDB) {
    throw new Error('JSDB already exists');
  } else {
    global.JSDB = JSDB;
  }
})(typeof window === 'undefined' ? this : window);

