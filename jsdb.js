(function(global) {

  //give JSDB a name, this will be used when saving to local storage
  var JSDB = function(DBname){

  var data = [];
  var index = {};
  var din;

  this.getName = function(){return DBname};

  //todo: when adding data update the index
  this.push = function(obj){data.push(obj);};

  //todo: add deep indexes, compund indexes and async index computing with webworkers
  this.addIndex = function(name){
    if(index[name]) return false;
    var len = data.length;
    var indexObj = {};
    for(var i = 0; i < len; i++){
      if(din = data[i][name]){
        if(indexObj[din])
          indexObj[din].push(i);
        else
          indexObj[din]=[i];
      }
    }
    index[name] = indexObj;
    return true;
  };

  //save data to localstorage, option to save the indexes as well
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

  //load data and indexes from localstorage
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

  //find obj can have multiple keys for AND condition, and have multiple values in an array, num is the number to return, offset where to start in the return
  this.find = function(obj,num,offset){
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
    for(i=(offset||0),l=Math.min(resIndex.length,(num||Infinity)+(offset||0));i<l;i++){
      result[resIndex[i]] = data[resIndex[i]];
    }
    return result;
  };


  };

  JSDB.VERSION = '0.1.1';

  //utility function
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

