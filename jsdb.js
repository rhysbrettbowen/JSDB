(function(global) {
  data = {
    data: []
  };

  index = {
    names: [],
    indexes: []
  }

  function JSDB() {
  };

  JSDB.push = function(obj){
    data.data.push(obj);
  };

  JSDB.isIn = function(item, arr){
    var len = arr.length;
    for(var i = 0; i < len; i++){
      if(arr[i]==item){
        return i;
      }
    }
    return -1;
  };

  JSDB.addIndex = function(name){
    if(JSDB.isIn(name, index.names)>-1) return false;
    var len = data.data.length;
    var indexObj = {};
    for(var i = 0; i < len; i++){
      if(data.data[i][name]){
        if(indexObj[data.data[i][name]])
          indexObj[data.data[i][name]].push(i);
        else
          indexObj[data.data[i][name]]=[i];
      }
    }
    index.names.push(name);
    index.indexes.push(indexObj);
    return true;
  };
  
  JSDB.find = function(obj){
    var key;
    var result = [];
    var indResult;
    for(key in obj){
      indTest = JSDB.isIn(key, index.names);
      if(indTest>-1){
        if(indResult = index.indexes[indTest][obj[key]]){
          for(var n = indResult.length-1; n>=0; n--){
            result.push(data.data[indResult[n]]);
          }
        }
      }
    }
    return result;
  };

  JSDB.VERSION = '0.0.1'; 
  
  if (global.JSDB) {
    throw new Error('JSDB already exists');
  } else {
    global.JSDB = JSDB;
  }
})(typeof window === 'undefined' ? this : window);

