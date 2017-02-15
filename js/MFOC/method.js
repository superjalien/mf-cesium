//User Method Definition

MFOC.prototype.add = null;
MFOC.prototype.drawPaths = null;
MFOC.prototype.clear = null;
MFOC.prototype.remove = null;
MFOC.prototype.drawFeatures = null;
MFOC.prototype.removeByIndex = null;
MFOC.prototype.showProperty = null;
MFOC.prototype.highlight = null;
MFOC.prototype.showHOTSPOT = null;
MFOC.prototype.animate = null;
MFOC.prototype.changeMode = null;

MFOC.prototype.add = function(mf){
  if (mf.type != 'MovingFeature'){
    console.log("it is not MovingFeature!!@!@!");
    return 0;
  }
  this.features.push(mf);
  //this.min_max = this.findMinMax();
  return this.features.length;
}

MFOC.prototype.drawFeatures = function(options){

  var mf_arr;
  if (options != undefined){
    if (options.name == undefined){
      mf_arr = this.features;
    }
    else{
      mf_arr = [];
      var name_arr = [];
      if (!Array.isArray(options.name) ){
        name_arr.push(options.name);
      }
      else{
        name_arr = options.name;
      }

      for (var i = 0 ; i < name_arr.length ; i++){
        var feat = this.getFeatureByName(name_arr[i]);
        if (feat != -1){
          mf_arr.push(feat);
        }
      }
    }
  }
  else{
    mf_arr = this.features;
  }

  this.min_max = this.findMinMaxGeometry(mf_arr);


  for (var index = 0 ; index < mf_arr.length ; index++){
    var feature = mf_arr[index];
    var feat_prim;
    if (this.feature_prim_memory[feature.properties.name] != undefined){
      if (this.mode == '2D'){
        continue;
      }
      else{
  //      this.viwer.scene.primitives.remove(this.feature_prim_memory[feature.properties.name]);
      }
    }
    if (feature.temporalGeometry.type == "MovingPoint"){
      feat_prim = this.viewer.scene.primitives.add(this.drawMovingPoint(feature.temporalGeometry));
    }
    else if(feature.temporalGeometry.type == "MovingPolygon"){
      feat_prim = this.viewer.scene.primitives.add(this.drawMovingPolygon(feature.temporalGeometry));
    }
    else if(feature.temporalGeometry.type == "MovingLineString"){
      feat_prim = this.viewer.scene.primitives.add(this.drawMovingLineString(feature.temporalGeometry));
    }
    else{
      console.log("this type cannot be drawn", feature);
    }

    this.feature_prim_memory[feature.properties.name] = feat_prim;//찾아서 지울때 사용.

  }

}

MFOC.prototype.drawPaths = function(options){

  var mf_arr;
  if (options != undefined){
    if (options.name == undefined){
      mf_arr = this.features;
    }
    else{
      mf_arr = [];
      var name_arr = [];
      if (!Array.isArray(options.name) ){
        name_arr.push(options.name);
      }
      else{
        name_arr = options.name;
      }

      for (var i = 0 ; i < name_arr.length ; i++){
        mf_arr.push(this.getFeatureByName(name_arr[i]));
      }
    }
  }
  else{
    mf_arr = this.features;
  }

  this.min_max = this.findMinMaxGeometry(mf_arr);

  for (var index = 0 ; index < mf_arr.length ; index++){
    var feature = mf_arr[index];
    var path_prim;
    if (this.path_prim_memory[feature.properties.name] != undefined){
      if (this.mode == '2D'){
        continue;
      }
      else{
    //    this.viwer.scene.primitives.remove(this.path_prim_memory[feature.properties.name]);
      }
    }
    if (feature.temporalGeometry.type == "MovingPoint"){
      path_prim = this.viewer.scene.primitives.add(this.drawPathMovingPoint({
        temporalGeometry : feature.temporalGeometry
      }));
    }
    else if(feature.temporalGeometry.type == "MovingPolygon"){
      path_prim = this.viewer.scene.primitives.add(this.drawPathMovingPolygon({
        temporalGeometry : feature.temporalGeometry
      }));
    }
    else if(feature.temporalGeometry.type == "MovingLineString"){
      path_prim = this.viewer.scene.primitives.add(this.drawPathMovingLineString({
        temporalGeometry : feature.temporalGeometry
      }));
    }
    else{
      console.log("this type cannot be drawn", feature);
    }

    this.path_prim_memory[feature.properties.name] = path_prim;
  }
}

MFOC.prototype.reset = function(){
  this.viewer.clock.multiplier = 10;
  this.viewer.dataSources.removeAll();
  var temp = this.viewer.scene.primitives.get(0);
  this.viewer.entities.removeAll();
  this.viewer.scene.primitives.removeAll();
  this.viewer.scene.primitives.add(temp);

  this.path_prim_memory = {};
  this.feature_prim_memory = {};
  this.features = [];
}

MFOC.prototype.clearViewer = function(){
  this.viewer.clock.multiplier = 10;
  this.viewer.dataSources.removeAll();
  var temp = this.viewer.scene.primitives.get(0);
  this.viewer.entities.removeAll();
  this.viewer.scene.primitives.removeAll();
  this.viewer.scene.primitives.add(temp);

  this.path_prim_memory = {};
  this.feature_prim_memory = {};
}

MFOC.prototype.clearAnimation = function(){
  this.viewer.clock.multiplier = 10;
  this.viewer.dataSources.removeAll();
}

MFOC.prototype.remove = function(mf){
  var index = this.features.indexOf(mf);
  if(index === -1){
    console.log("this mf is not exist in array");
  }
  else{
    console.log(this.features, this.features[index], mf);
    return;
    var remove_mf = this.features.splice(index, 1);
    if (remove_mf[0] != mf){
      console.log(index, remove_mf[0], mf);
      console.log("it is something wrong!!!");
      return;
    }
    if (this.path_prim_memory[mf.properties.name] != undefined){
      this.viewer.scene.primitives.remove(this.path_prim_memory[mf.properties.name]);
      this.path_prim_memory[mf.properties.name] = undefined;
    }
    if (this.feature_prim_memory[mf.properties.name] != undefined){
      this.viewer.scene.primitives.remove(this.feature_prim_memory[mf.properties.name]);
      this.feature_prim_memory[mf.properties.name] = undefined;
    }
  }
  return this.features.length;
}

MFOC.prototype.removeByName = function(name){
  var features = this.getFeatureByName(name);
  if (features == -1){
    return;
  }
  var index = this.features.indexOf(features);
  if(index === -1){
    console.log("this mf is not exist in array");
    return;
  }
  else{
    console.log(this.features, this.features[index], mf);
    return;
    var remove_mf = this.features.splice(index, 1);
    if (remove_mf[0] != mf){
      console.log(index, remove_mf[0], mf);
      console.log("it is something wrong!!!");
      return;
    }
    if (this.path_prim_memory[mf.properties.name] != undefined){
      this.viewer.scene.primitives.remove(this.path_prim_memory[mf.properties.name]);
      this.path_prim_memory[mf.properties.name] = undefined;
    }
    if (this.feature_prim_memory[mf.properties.name] != undefined){
      this.viewer.scene.primitives.remove(this.feature_prim_memory[mf.properties.name]);
      this.feature_prim_memory[mf.properties.name] = undefined;
    }
  }
  return this.features.length;
}

MFOC.prototype.showProperty = function(propertyName, divID){
  var pro_arr = [];
  for (var i = 0 ; i < this.features.length ; i ++){
    var property = MFOC.getPropertyByName(this.features[i], propertyName);
    if (property != -1){
      pro_arr.push(property);
    }
  }
  this.showPropertyArray(pro_arr, divID);
}

MFOC.getPropertyByName = function(mf, name){
  if (mf.temporalProperties == undefined) return -1;

  for (var i = 0 ; i < mf.temporalProperties.length ; i++){
    if (mf.temporalProperties[i].name == name){
      return mf.temporalProperties[i];
    }
  }
  return -1;
}


MFOC.prototype.highlight = function(movingfeatureName,propertyName){
  var mf_name = movingfeatureName;
  var pro_name = propertyName;

  var mf = this.getFeatureByName(mf_name);
  if (mf == -1){
    console.log("please add mf first.");
    return;
  }
  var property = MFOC.getPropertyByName(mf, pro_name);
  if (property == -1){
    console.log("that property is not in this moving feature");
    return;
  }

  if (this.path_prim_memory[mf_name] != undefined){
    this.viewer.scene.primitives.remove(this.path_prim_memory[mf_name]);
    this.path_prim_memory[mf_name] = undefined;
  }
  if (this.feature_prim_memory[mf_name] != undefined){
    this.viewer.scene.primitives.remove(this.feature_prim_memory[mf_name]);
    this.feature_prim_memory[mf_name] = undefined;
  }

  var type = mf.temporalGeometry.type;

  if (type == 'MovingPolygon'){
    this.viewer.scene.primitives.add(drawPathMovingPolygon({
      temporalGeometry : mf,
      temporalProperty : property
    }));
  }
  else if (type == 'MovingPoint'){
    this.viewer.scene.primitives.add(drawMovingPointPath({
      temporalGeometry : mf,
      temporalProperty : property
    }));
  }
  else if (type == 'MovingLineString'){
    this.viewer.scene.primitives.add(drawPathMovingLineString({
      temporalGeometry : mf,
      temporalProperty : property
    }));
  }
  else{
    LOG('this type is not implemented.');
  }
}

MFOC.prototype.showHOTSPOT = function(degree){
  var x_deg = degree.x,
  y_deg = degree.y,
  z_deg = degree.time;

  var mf_arr = this.features;

  this.min_max = this.findMinMaxGeometry(mf_arr);
  this.cube_data = [];
  this.hotspot_maxnum = 0;

  this.makeBasicCube(degree);

  for (var index = 0 ; index < mf_arr.length ; index++){
    var feature = mf_arr[index];

    if (feature.temporalGeometry.type == "MovingPoint"){
      this.drawHotSpotMovingPoint(feature.temporalGeometry, degree  );
    }
    else if(feature.temporalGeometry.type == "MovingPolygon"){

      this.drawHotSpotMovingPolygon(feature.temporalGeometry, degree);
    }
    else if(feature.temporalGeometry.type == "MovingLineString"){

    }
    else{
      console.log("nono", feature);
    }
  }

  var cube_prim = this.makeCube(degree);

  this.cube_data = this.primitives.add(cube_prim);

}

MFOC.prototype.getFeatureByName = function(name){
  for (var i = 0 ; i < this.feature.length ; i++){
    if (this.feature[i].properties.name == name){
      return this.feature[i];
    }
  }
  return -1;
}

MFOC.prototype.animate = function(options){
  var mf_arr;
  if (options != undefined){
    if (options.name == undefined){
      mf_arr = this.features;
    }
    else{
      mf_arr = [];
      var name_arr = [];
      if (!Array.isArray(options.name) ){
        name_arr.push(options.name);
      }
      else{
        name_arr = options.name;
      }

      for (var i = 0 ; i < name_arr.length ; i++){
        mf_arr.push(this.getFeatureByName(name_arr[i]));
      }
    }
  }
  else{
    mf_arr = this.features;
  }


  this.min_max = this.findMinMaxGeometry(mf_arr);
  var multiplier = 10000;
  var czml = [{
    "id" : "document",
    "name" : "polygon_highlight",
    "version" : "1.0"
  }];

  czml[0].clock = {
    "interval" : this.min_max.date[0].toISOString() +"/" + this.min_max.date[1].toISOString(),
    "currentTime" : this.min_max.date[0].toISOString(),
    "multiplier" : multiplier
  }

  for (var index = 0 ; index < mf_arr.length ; index++){
    var feature = mf_arr[index];
    if (feature.temporalGeometry.type == "MovingPoint"){
      czml = czml.concat(this.moveMovingPoint({
        temporalGeometry : feature.temporalGeometry,
        number : index
      }));
    }
    else if(feature.temporalGeometry.type == "MovingPolygon"){
      czml = czml.concat(this.moveMovingPolygon({
        temporalGeometry : feature.temporalGeometry,
        number : index
      }));
    }
    else if(feature.temporalGeometry.type == "MovingLineString"){
      czml = czml.concat(this.moveMovingLineString({
        temporalGeometry : feature.temporalGeometry,
        number : index
      }));
    }
    else{
      console.log("this type cannot be animated", feature);
    }
  }

  var load_czml = Cesium.CzmlDataSource.load(czml);
  viewer.dataSources.add(load_czml);
}

MFOC.prototype.changeMode = function(mode){
  if (mode == undefined){
    if (this.mode == '2D'){
      this.mode = '3D';
    }
    else{
      this.mode = '2D';
    }
  }
  else{
    this.mode = mode;
  }
}