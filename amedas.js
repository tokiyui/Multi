let params = new URLSearchParams(window.location.search);
//let map = L.map('map');
let map = L.map('map',{zoomControl:false});
//L.control.zoom({position:'topright'}).addTo(map);
let amedasTable = -1, class10sPolygons=-1, relm = -1, class30sPolygons = {}
let layers = {}
layers['municipal'] = L.tileLayer('https://www.jma.go.jp/tile/jma/base/{z}/{x}/{y}.png', { maxNativeZoom:11, maxZoom:18, minZoom:4, nativeZoomDelta:1, crossOrigin:"anonymous", noWrap:true, opacity:1, attribution: "<a href='https://www.jma.go.jp/jma/kishou/info/coment.html' target='_blank'>気象庁地図タイル(地理院タイルを加工して利用)等</a>", pane:"paneM1"});
let targetLayer = { "areaGrayDetail":{}}
const qcJson = { "0":{"status":"正常","mark":""}, "1":{"status":"準正常","mark":")"}, "2":{"status":"疑問","mark":"#"}, "3":{"status":"利用不適","mark":"#","overwrite":"#"}, "4":{"status":"資料不足","mark":"]"}, "5":{"status":"計画欠測","mark":"-","overwrite":"-"}, "6":{"status":"未受信/障害欠測","mark":"×","overwrite":"×"}, "7":{"status":"未実施","mark":"","overwrite":"・"}}
const amedasElem = {"precipitation10m":"10分間降水量", "precipitation1h":"1時間降水量", "precipitation3h":"3時間降水量", "precipitation24h":"24時間降水量", "wind":"風向・風速", "temp":"気温", "sun1h":"1時間日照時間", "sun10m":"10分間日照時間", "snow":"積雪深", "snow6h":"6時間降雪量", "snow12h":"12時間降雪量", "snow24h":"24時間降雪量", "humidity":"湿度", "visibility":"視程", "weather":"天気(自動観測)", "normalPressure":"気圧", "obsStation":"地点名", "normalTemp":"海面更正気温", "dewPointTemp":"露点温度", "waterVaporPressure":"水蒸気圧", "waterVaporAmount":"水蒸気量", "dewPointDepression":"湿数", "mixingRatio":"混合比", "specificHumidity":"比湿", "humidityDeficit":"飽差", "equivPotTemp":"相当温位", "pressure":"現地気圧", "autoRainSnow10m":"降ったら雨雪(10分)", "autoRainSnow1h":"降ったら雨雪(1時間)", "null":"(なし)" };
const weathers = ["晴れ","くもり","煙霧","霧","降水","霧雨","着氷性の霧雨","雨","着氷性の雨","みぞれ","雪","凍雨","霧雪","しゅう雨","しゅう雪","ひょう","雷"];
const autoRainSnows = {"0":"晴れ","1":"くもり","2":"煙霧","3":"霧","4":"降水","5":"霧雨","6":"着氷性の霧雨","7":"雨","8":"着氷性の雨","9":"みぞれ","10":"雪","11":"凍雨","12":"霧雪","13":"しゅう雨","14":"しゅう雪","15":"ひょう","16":"雷","rain":"降ったら雨","rainsnow":"降ったらみぞれ","snow":"降ったら雪"};
//const obsStations = {"2":{"type":"気象台・特別地域気象観測所等","elems":"気温・降水量・風向風速・日照時間・湿度・気圧","color":"#ff4b00","shape":"●"},"3":{"type":"気象台・特別地域気象観測所等","elems":"気温・降水量・風向風速・日照時間・積雪深・湿度・気圧","color":"#ff4b00","shape":"■"},"4":{"type":"地域気象観測所（アメダス）","elems":"気温・降水量・風向風速・日照時間（推計）・湿度","color":"#f6aa00","shape":"●"},"5":{"type":"地域気象観測所（アメダス）","elems":"気温・降水量・風向風速・日照時間（推計）・積雪深・湿度","color":"#f6aa00","shape":"■"},"6":{"type":"地域気象観測所（アメダス）","elems":"気温・降水量・風向風速・日照時間・積雪深","color":"#03af7a","shape":"▲"},"7":{"type":"地域気象観測所（アメダス）","elems":"気温・降水量・風向風速・日照時間（推計）","color":"#03af7a","shape":"●"},"8":{"type":"地域気象観測所（アメダス）","elems":"気温・降水量・風向風速・日照時間（推計）・積雪深","color":"#03af7a","shape":"■"},"9":{"type":"地域気象観測所（アメダス）","elems":"気温・降水量・風向風速","color":"#4dc4ff","shape":"●"},"10":{"type":"地域気象観測所（アメダス）","elems":"気温・降水量・風向風速・積雪深","color":"#4dc4ff","shape":"■"},"11":{"type":"地域気象観測所（アメダス）","elems":"降水量","color":"#005aff","shape":"●"},"12":{"type":"地域気象観測所（アメダス）","elems":"降水量・積雪深","color":"#005aff","shape":"■"},"13":{"type":"父島気象観測所・南鳥島気象観測所","elems":"気温・降水量・風向風速・日照時間・湿度・気圧","color":"#990099","shape":"■"},"14":{"type":"富士山特別地域気象観測所","elems":"気温・日照時間・湿度・気圧","color":"#804000","shape":"■"},"15":{"type":"その他の気象観測所","elems":"","color":"#c8c8cb","shape":"■"}}
const obsStations = {"2":{"type":"気象台等(雪なし)","elems":"","color":"#ff4b00","shape":"●"},"3":{"type":"気象台等(雪あり)","elems":"","color":"#ff4b00","shape":"■"},"4":{"type":"アメダス(気温・雨・風・日照(推計)・湿度)","elems":"","color":"#f6aa00","shape":"●"},"5":{"type":"アメダス(気温・雨・風・日照(推計)・雪・湿度)","elems":"","color":"#f6aa00","shape":"■"},"6":{"type":"つくば(気温・雨・風・日照・雪)","elems":"","color":"#03af7a","shape":"▲"},"7":{"type":"アメダス(気温・雨・風・日照(推計))","elems":"","color":"#03af7a","shape":"●"},"8":{"type":"アメダス(気温・雨・風・日照(推計)・雪)","elems":"","color":"#03af7a","shape":"■"},"9":{"type":"アメダス(気温・雨・風)","elems":"","color":"#4dc4ff","shape":"●"},"10":{"type":"アメダス(気温・雨・風・雪)","elems":"","color":"#4dc4ff","shape":"■"},"11":{"type":"アメダス(雨)","elems":"","color":"#005aff","shape":"●"},"12":{"type":"アメダス(雨・雪)","elems":"","color":"#005aff","shape":"■"},"13":{"type":"父島・南鳥島","elems":"","color":"#990099","shape":"■"},"14":{"type":"富士山","elems":"","color":"#804000","shape":"■"},"15":{"type":"その他(秩父別)","elems":"","color":"#c8c8cb","shape":"■"}}
const minZoom = 4, maxZoom = 18;
const gsiAttr = '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>';
const layerGray = L.tileLayer('https://www.jma.go.jp/tile/jma/base/{z}/{x}/{y}.png', { maxNativeZoom:11, maxZoom:18, minZoom:4, attribution: '<a href="https://www.jma.go.jp/jma/kishou/info/coment.html" target="_blank">気象庁</a>', pane:"paneM4"});
const layerGreen = L.tileLayer('https://www.jma.go.jp/tile/jma/green-cities/{z}/{x}/{y}.png', { maxNativeZoom:10, maxZoom:18, minZoom:4, attribution: '<a href="https://www.jma.go.jp/jma/kishou/info/coment.html" target="_blank">気象庁</a>', pane:"paneM4"});
const layerWhite = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png', { maxNativeZoom:14, maxZoom:18, minZoom:4, attribution:gsiAttr, pane:"paneM4"});
const layerShade = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png', { maxNativeZoom:16, maxZoom:18, minZoom:4, attribution:gsiAttr, pane:"paneM4"});
const layerGsi = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', { maxNativeZoom:18, maxZoom:18, minZoom:4, attribution:gsiAttr, pane:"paneM4"});
const layerPale = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', { maxNativeZoom:18, maxZoom:18, minZoom:4, attribution:gsiAttr, pane:"paneM4"});
const layerEnglish = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/english/{z}/{x}/{y}.png', { maxNativeZoom:11, maxZoom:18, minZoom:4, attribution:gsiAttr, pane:"paneM4"});
const layerPhoto = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg', { maxNativeZoom:18, maxZoom:18, minZoom:4, attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">Landsat8画像（GSI,TSIC,GEO Grid/AIST）, Landsat8画像（courtesy of the U.S. Geological Survey）, 海底地形（GEBCO） | Images on 世界衛星モザイク画像 obtained from site https://lpdaac.usgs.gov/data_access maintained by the NASA Land Processes Distributed Active Archive Center (LP DAAC), USGS/Earth Resources Observation and Science (EROS) Center, Sioux Falls, South Dakota, (Year). Source of image data product. | 地理院タイル</a>', pane:"paneM4"});
const layerLcm = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/lcm25k_2012/{z}/{x}/{y}.png', { maxNativeZoom:16, maxZoom:18, minZoom:4, attribution:gsiAttr, pane:"paneM4"});
const layerColor = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png', { maxNativeZoom:15, maxZoom:18, minZoom:4, attribution:gsiAttr, pane:"paneM4"});
const layerRed = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/sekishoku/{z}/{x}/{y}.png', { maxNativeZoom:14, maxZoom:18, minZoom:4, attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">(株)アジア航測 | 地理院タイル</a>', pane:"paneM4"});
const layerGsj = L.tileLayer('https://gbank.gsj.jp/seamless/v2/api/1.2/tiles/{z}/{y}/{x}.png', { maxNativeZoom:13, maxZoom:18, minZoom:4, attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">産総研 | 地理院タイル</a>', pane:"paneM4"});
const layerOsm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxNativeZoom:18, maxZoom:18, minZoom:4, attribution:'c <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>', pane:"paneM4"});

var callEvery10min = function(){
  every10min();
}
setInterval(callEvery10min, 590 * 1000);

function every10min(){
  if( document.getElementById('autoRefresh').checked){
    getTime();
  }
}

// [閾値(これ未満の時),色,縁取り]
const colors = {
  "temp":[ [-40,"#ff2800"], [-35,"#ff9900"], [-30,"#faf500"], [-25,"#6c0078"], [-20,"#92449e"], [-15,"#b27ebe"], [-10,"#ccaed9"], [-5,"#e2d5ef"], [0,"#f2f2ff"], [5,"#0041ff"], [10,"#0096ff"], [15,"#b9ebff"], [20,"#ffffc3"], [25,"#faf500"], [30,"#ff9900"], [35,"#ff2800"], [40,"#b40068"], [Infinity,"#6c0078"]],
  "normalTemp":[ [-40,"#ff2800"], [-35,"#ff9900"], [-30,"#faf500"], [-25,"#6c0078"], [-20,"#92449e"], [-15,"#b27ebe"], [-10,"#ccaed9"], [-5,"#e2d5ef"], [0,"#f2f2ff"], [5,"#0041ff"], [10,"#0096ff"], [15,"#b9ebff"], [20,"#ffffc3"], [25,"#faf500"], [30,"#ff9900"], [35,"#ff2800"], [40,"#b40068"], [Infinity,"#6c0078"]],
  "dewPointTemp":[ [-40,"#ff2800"], [-35,"#ff9900"], [-30,"#faf500"], [-25,"#6c0078"], [-20,"#92449e"], [-15,"#b27ebe"], [-10,"#ccaed9"], [-5,"#e2d5ef"], [0,"#f2f2ff"], [5,"#0041ff"], [10,"#0096ff"], [15,"#b9ebff"], [20,"#ffffc3"], [25,"#faf500"], [30,"#ff9900"], [35,"#ff2800"], [40,"#b40068"], [Infinity,"#6c0078"]],
  "dewPointDepression":[ [0,"#011f7d"], [1,"#004b96"], [2,"#00729a"], [3,"#1fc2d3"], [6,"#80f8e7"], [12,"#fffff0"], [18,"#ffc846"], [24,"#e78707"], [30,"#ab4a01"], [36,"#761100"], [Infinity,"#540600"]],
  "humidityDeficit":[ [0,"#011f7d"], [1,"#004b96"], [2,"#00729a"], [3,"#1fc2d3"], [6,"#80f8e7"], [12,"#fffff0"], [18,"#ffc846"], [24,"#e78707"], [30,"#ab4a01"], [36,"#761100"], [Infinity,"#540600"]],
  "waterVaporPressure":[ [5,"#540600"], [10,"#761100"], [15,"#ab4a01"], [20,"#e78707"], [25,"#ffc846"], [30,"#fffff0"], [35,"#80f8e7"], [40,"#1fc2d3"], [45,"#00729a"], [50,"#004b96"], [Infinity,"#011f7d"]],
  "waterVaporAmount":[ [5,"#540600"], [10,"#761100"], [15,"#ab4a01"], [20,"#e78707"], [25,"#ffc846"], [30,"#fffff0"], [35,"#80f8e7"], [40,"#1fc2d3"], [45,"#00729a"], [50,"#004b96"], [Infinity,"#011f7d"]],
  "equivPotTemp":[ [255,"#ff2800"], [264,"#ff9900"], [273,"#faf500"], [282,"#6c0078"], [291,"#92449e"], [300,"#b27ebe"], [309,"#ccaed9"], [318,"#e2d5ef"], [327,"#f2f2ff"], [336,"#0041ff"], [345,"#0096ff"], [354,"#b9ebff"], [363,"#ffffc3"], [372,"#faf500"], [381,"#ff9900"], [390,"#ff2800"], [399,"#b40068"], [Infinity,"#6c0078"]],
  "precipitation10m":[ [1,"#f2f2ff"], [5,"#a0d2ff"], [10,"#218cff"], [20,"#0041ff"], [30,"#faf500"], [50,"#ff9900"], [80,"#ff2800"], [110,"#b40068"], [Infinity,"#6c0078"]],
  "precipitation1h":[ [1,"#f2f2ff"], [3,"#a0d2ff"], [5,"#218cff"], [10,"#0041ff"], [15,"#faf500"], [20,"#ff9900"], [30,"#ff2800"], [40,"#b40068"], [Infinity,"#6c0078"]],
  "precipitation3h":[ [20,"#f2f2ff"], [40,"#a0d2ff"], [60,"#218cff"], [80,"#0041ff"], [100,"#faf500"], [120,"#ff9900"], [150,"#ff2800"], [200,"#b40068"], [Infinity,"#6c0078"]],
  "precipitation24h":[ [50,"#f2f2ff"], [80,"#a0d2ff"], [100,"#218cff"], [150,"#0041ff"], [200,"#faf500"], [250,"#ff9900"], [300,"#ff2800"], [400,"#b40068"], [Infinity,"#6c0078"]],
  "wind":[ [5,"#f2f2ff"], [10,"#0041ff"], [15,"#faf500"], [20,"#ff9900"], [25,"#ff2800"], [35,"#b40068"], [Infinity,"#6c0078"]],
  "sun1h":[ [0.2,"#0041ff"], [0.4,"#a0d2ff"], [0.6,"#ffff96"], [0.8,"#faf500"], [1,"#ff9900"], [Infinity,"#ff2800"]],
  "sun10m":[ [2,"#0041ff"], [4,"#a0d2ff"], [6,"#ffff96"], [8,"#faf500"], [10,"#ff9900"], [Infinity,"#ff2800"]],
  "snow":[ [1,"#f2f2ff"], [5,"#a0d2ff"], [20,"#218cff"], [50,"#0041ff"], [100,"#faf500"], [150,"#ff9900"], [200,"#ff2800"], [300,"#b40068"], [Infinity,"#6c0078"]],
  "snow6h":[ [1,"#f2f2ff"], [5,"#a0d2ff"], [10,"#218cff"], [15,"#0041ff"], [20,"#faf500"], [30,"#ff9900"], [40,"#ff2800"], [50,"#b40068"], [Infinity,"#6c0078"]],
  "snow12h":[ [1,"#f2f2ff"], [5,"#a0d2ff"], [10,"#218cff"], [20,"#0041ff"], [30,"#faf500"], [40,"#ff9900"], [50,"#ff2800"], [80,"#b40068"], [Infinity,"#6c0078"]],
  "snow24h":[ [1,"#f2f2ff"], [10,"#a0d2ff"], [20,"#218cff"], [30,"#0041ff"], [40,"#faf500"], [50,"#ff9900"], [70,"#ff2800"], [100,"#b40068"], [Infinity,"#6c0078"]],
  "humidity":[ [10,"#540600"], [20,"#761100"], [30,"#ab4a01"], [40,"#e78707"], [50,"#ffc846"], [60,"#fffff0"], [70,"#80f8e7"], [80,"#1fc2d3"], [90,"#00729a"], [100,"#004b96"], [Infinity,"#011f7d"]],
  "visibility":[ [0.3,"#b40068"], [1,"#ff2800"], [2,"#ff9900"], [5,"#faf500"], [10,"#b9ebff"], [20,"#0096ff"], [Infinity,"#0041ff"]],
  "normalPressure":[ [940,"#6c0078"], [950,"#b40068"], [960,"#ff2800"], [970,"#ff9900"], [980,"#faf500"], [990,"#ffff96"], [1000,"#fffff0"], [1010,"#b9ebff"], [1020,"#0096ff"], [1030,"#0041ff"], [Infinity,"#002080"]],
  "pressure":[ [940,"#6c0078"], [950,"#b40068"], [960,"#ff2800"], [970,"#ff9900"], [980,"#faf500"], [990,"#ffff96"], [1000,"#fffff0"], [1010,"#b9ebff"], [1020,"#0096ff"], [1030,"#0041ff"], [Infinity,"#002080"]],
  "mixingRatio":[ [3,"#761100"], [6,"#ab4a01"], [9,"#e78707"], [12,"#ffc846"], [15,"#fffff0"], [18,"80f8e7"], [21,"#1fc2d3"], [24,"#00729a"], [27,"#004b96"], [30,"#011f7d"], [Infinity,"#540600"]],
  "specificHumidity":[ [3,"#761100"], [6,"#ab4a01"], [9,"#e78707"], [12,"#ffc846"], [15,"#fffff0"], [18,"80f8e7"], [21,"#1fc2d3"], [24,"#00729a"], [27,"#004b96"], [30,"#011f7d"], [Infinity,"#540600"]],
  "weather":[ [Infinity,"#ffffff"]],
  "obsStation":[ [Infinity,"#ffffff"]],
  "null":[ [Infinity,"#ffffff"]]
}

getAmedasTable();

function getAmedasTable(){
  fetch("https://www.jma.go.jp/bosai/amedas/const/amedastable.json")
  .then((response) => response.json())
  .then((amedasTableResponse) => {
    amedasTable = amedasTableResponse;
    if( amedasTable!=-1 && class10sPolygons!=-1 && relm!=-1){
      mapInitialize();
    }
  });
  fetch("https://www.jma.go.jp/bosai/common/const/geojson/class15s.json")
  .then((response) => response.json())
  .then((class10sPolygonsResponse) => {
    class10sPolygons = class10sPolygonsResponse;
    if( amedasTable!=-1 && class10sPolygons!=-1 && relm!=-1){
      mapInitialize();
    }
  });
  fetch("https://www.jma.go.jp/bosai/common/const/relm.json")
  .then((response) => response.json())
  .then((relmResponse) => {
    relm = relmResponse;
    if( amedasTable!=-1 && class10sPolygons!=-1 && relm!=-1){
      mapInitialize();
    }
  });
}

function mapInitialize(){
  // front <-- 0(value) -1(liden) -2(sat) -3(radar) -4(map) -5(grayMap) --> back
  const panes = {"paneM1":-10,"paneM2":-20,"paneM3":-30,"paneM4":-40,"paneM5":-50}
  for( let pane in panes){
    map.createPane(pane).style.zIndex = panes[pane];
  }
  const gsiAttr = '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>';
  const gsiUrl = 'https://cyberjapandata.gsi.go.jp/xyz/';
  L.control.layers({
    "灰地図":layerGray, "緑地図":layerGreen.addTo(map), "白地図":layerWhite, "陰影起伏":layerShade, "地理院":layerGsi, "淡色":layerPale, "英語":layerEnglish, "写真":layerPhoto, "土地利用":layerLcm, "色別標高":layerColor, "赤色立体":layerRed, "地質":layerGsj, "OpenStreetMap":layerOsm
  }).addTo(map);
  let info = L.control({ position: "topleft"});
  info.onAdd = function (map) {
    this.divElem = L.DomUtil.create('div', 'info');
    this.divElem.id = "info";
    this.divElem.innerHTML = "読込中";
    return this.divElem;
  }
  info.addTo(map);
  L.control.zoom({position:'topleft'}).addTo(map);
  map.setView([35.3622222, 138.7313889], 5);
  let hash = new L.Hash(map);
  targetLayer['areaGray'] = L.layerGroup();
  for( let i in class10sPolygons['features']){
//    let grayStyle = { stroke:true, color:"#c8c8cb", weight:1, opacity: 1, fillColor:"#c8c8cb", fillOpacity:1, pane:"paneM5"}
//    let grayStyle = { stroke:true, color:"#b4b4b7", weight:1, opacity: 1, fillColor:"#b4b4b7", fillOpacity:1, pane:"paneM5"}
    let grayStyle = { stroke:true, color:"#949497", weight:1, fillColor:"#949497", fillOpacity:1, pane:"paneM5"}
    targetLayer['areaGray'].addLayer( L.geoJSON(class10sPolygons['features'][i], { style: grayStyle}));
  }
  menuInitialize();
}

function menuInitialize(){
  let select = document.getElementById("elem");
  for( let elem in amedasElem){
    let option = document.createElement("option");
    option.text = amedasElem[elem];
    option.value = elem;
    select.appendChild(option);
  }
  if( params.get('elem')!=null){ try{ document.getElementById('elem').value=params.get('elem')}catch(e){}}
  if( params.get('autoRefresh')=='false'){ document.getElementById('autoRefresh').checked = false}
  if( params.get('overlay')=='true'){ document.getElementById('overlay').checked = true}
  if( params.get('overElem')!=null){ document.getElementById('overElem').value=params.get('overElem')}
  if( params.get('liden')=='true'){ document.getElementById('liden').checked = true}
  if( params.get('displayMunicipal')=='true'){ document.getElementById('displayMunicipal').checked = true}
  if( params.get('menuOpen')=='false'){ try{ document.getElementById('menu').open=false;}catch(e){}}
  if( params.get('targDatetime')!=null && !(document.getElementById('autoRefresh').checked)){
    document.getElementById('targDatetime').value=params.get('targDatetime');
    getTime();
  }else{
    getTime();
  }
}

function getTime( myCommand=""){
  let targetTimes = {"target":-1,"amedasLatest":-1,"lidenLatest":-1}
  
  fetch("https://www.jma.go.jp/bosai/amedas/data/latest_time.txt?__time__=" + Date.now())
  .then((response) => response.text())
  .then((latestTimeResponse) => {
    targetTimes['amedasLatest'] = new Date( latestTimeResponse);
    if( (document.getElementById('targDatetime').value=="" || (document.getElementById("autoRefresh").checked) && myCommand != "preventRefresh") || myCommand=="refresh"){
      document.getElementById('targDatetime').value = dateFormat( targetTimes['amedasLatest'], 'y-m-dTh:n');
    }
    let targDatetime = document.getElementById('targDatetime').value;
    targetTimes['target'] = new Date( targDatetime);
    getAmedas( targetTimes);
    if( document.getElementById("overlay").checked){
      getOverlay( targetTimes);
    }
    fetch("https://www.jma.go.jp/bosai/jmatile/data/nowc/targetTimes_N3.json?__time__=" + Date.now())
    .then((response) => response.json())
    .then((latestLidenResponse) => {
      const lidenTimes = latestLidenResponse;
      for( let i=0; i<lidenTimes.length; i++){
        for( let elem of lidenTimes[i]['elements']){
          if( elem == "liden"){
            targetTimes['lidenLatest'] = new Date(lidenTimes[i]['validtime'].substring(0,4), lidenTimes[i]['validtime'].substring(4,6)-1, lidenTimes[i]['validtime'].substring(6,8), lidenTimes[i]['validtime'].substring(8,10)*1 + 9, lidenTimes[i]['validtime'].substring(10,12));
          }
        }
        if( targetTimes['lidenLatest']!=-1){ break;}
      }
      if( document.getElementById("liden").checked){
        getLiden( targetTimes);
      }
    });
  });
}

function chgTime( timeDiff){
  let targDatetime = document.getElementById('targDatetime').value;
  targDateTime = new Date( targDatetime);
  targDateTime.setMinutes( targDateTime.getMinutes() + timeDiff);
  document.getElementById('targDatetime').value = dateFormat( targDateTime, 'y-m-dTh:n');
}

function getAmedas( targetTimes){
  let amedasTime = new Date();
  if( targetTimes['target'].getTime() < targetTimes['amedasLatest'].getTime()){
    amedasTime = new Date( targetTimes['target'].getFullYear(), targetTimes['target'].getMonth(), targetTimes['target'].getDate(), targetTimes['target'].getHours(), targetTimes['target'].getMinutes());
  }else{
    amedasTime = new Date( targetTimes['amedasLatest'].getFullYear(), targetTimes['amedasLatest'].getMonth(), targetTimes['amedasLatest'].getDate(), targetTimes['amedasLatest'].getHours(), targetTimes['amedasLatest'].getMinutes());
  }
  let elem = document.getElementById("elem").value;
  if( elem=="snow" || elem=="snow6h" || elem=="snow12h" || elem=="snow24h" || elem=="weather"){
    amedasTime.setMinutes(0);
  }
  fetch("https://www.jma.go.jp/bosai/amedas/data/map/" + dateFormat(amedasTime, 'ymdhns') + ".json")
  .then((response) => response.json())
  .then((amedas) => displayAmedas( amedas, amedasTime, elem));
}

function displayAmedas( amedas, amedasTime, elem){
  // 独自追加要素の計算
  for( let obsCode in amedas){
    if( amedas[obsCode]['temp']!=undefined){
      let t = amedas[obsCode]['temp'][0], tQc = amedas[obsCode]['temp'][1];
      amedas[obsCode]['normalTemp'] = [ Math.round((t + amedasTable[obsCode]['alt']*0.005)*10)/10, tQc];
      if( amedas[obsCode]['humidity']!=undefined && amedas[obsCode]['temp']!=undefined){
        let h = Math.max(0.1,amedas[obsCode]['humidity'][0]), hQc = amedas[obsCode]['humidity'][1];
        let T = t + 273.15;
        let es = 6.112 * Math.exp(17.67*(T-273.15)/(T-29.65));
        let e = es * h / 100;
        let a = 217*e/T;
        let hd = 217*(es-e)/T;
//        let TD = (29.65*Math.log(e/6.112) - 17.67*273.15) / (Math.log(e/6.112)-17.67);
        let TD = (29.65*(T-29.65)*Math.log(h/100) + 17.67*(29.65-273.15)*T) / ((T-29.65)*Math.log(h/100) + 17.67*(29.65-273.15));
//        console.log( t, h, es, e, td);
        amedas[obsCode]['dewPointTemp'] = [ Math.round((TD-273.15)*10)/10, Math.max(tQc, hQc)];
        amedas[obsCode]['dewPointDepression'] = [ t - Math.round((TD-273.15)*10)/10, Math.max(tQc, hQc)];
        amedas[obsCode]['waterVaporPressure'] = [ e, Math.max(tQc, hQc)];
        amedas[obsCode]['waterVaporAmount'] = [ a, Math.max(tQc, hQc)];
        amedas[obsCode]['humidityDeficit'] = [ hd, Math.max(tQc, hQc)];
        if( amedas[obsCode]['pressure']!=undefined){
          let p = amedas[obsCode]['pressure'][0], pQc = amedas[obsCode]['pressure'][1];
          let tlcl = 1/(1/(TD-56)+Math.log(T/TD)/800) + 56;
          let x = 0.622 * e / (p-e);
          let s = 0.622 * e / (p-(1-0.622)*e);
          let ept = T*Math.pow(1000/(p-e),0.2854)*Math.pow(T/tlcl,0.28*x)*Math.exp((3036/tlcl-1.78)*x*(1+0.448*x));
          amedas[obsCode]['equivPotTemp'] = [ Math.round(ept), Math.max(tQc, hQc, pQc)];
          amedas[obsCode]['mixingRatio'] = [ x*1000, Math.max(tQc, hQc, pQc)];
          amedas[obsCode]['specificHumidity'] = [ s*1000, Math.max(tQc, hQc, pQc)];
        }
        
        let autoRainSnow = "rainsnow", autoRainSnowQc = Math.max(tQc,hQc);
        const autoRainSnowThresholds = {"special":{"snow":{"T":-9.434,"H":88.585},"rain":{"T":-9.331,"H":121.928}},"hokkaido":{"snow":{"T":-10,"H":102},"rain":{"T":-10,"H":117}},"tohoku":{"snow":{"T":-10,"H":100},"rain":{"T":-10,"H":116}},"kantoukoushin":{"snow":{"T":-10,"H":100},"rain":{"T":-10,"H":116}},"hokuriku":{"snow":{"T":-10,"H":104},"rain":{"T":-10,"H":121}},"toukai":{"snow":{"T":-10,"H":102},"rain":{"T":-11,"H":116}},"kinki":{"snow":{"T":-10,"H":105},"rain":{"T":-10,"H":115}},"chugoku":{"snow":{"T":-10,"H":102},"rain":{"T":-10,"H":115}},"shikoku":{"snow":{"T":-10,"H":100},"rain":{"T":-10,"H":110}},"kyushuhokubu":{"snow":{"T":-9,"H":103},"rain":{"T":-9,"H":112}},"kyushunambuinan":{"snow":{"T":-10,"H":107},"rain":{"T":-10,"H":117}}};
        const autoRainSnowAreas = {"1":"hokkaido","2":"hokkaido","3":"tohoku","4":"kantoukoushin","50":"toukai","51":"toukai","52":"toukai","53":"toukai","54":"hokuriku","55":"hokuriku","56":"hokuriku","57":"hokuriku","60":"kinki","61":"kinki","62":"kinki","63":"kinki","64":"kinki","65":"kinki","66":"chugoku","67":"chugoku","68":"chugoku","69":"chugoku","7":"shikoku","81":"kyushuhokubu","82":"kyushuhokubu","83":"kyushuhokubu","84":"kyushuhokubu","85":"kyushuhokubu","86":"kyushuhokubu","87":"kyushunambuinan","88":"kyushunambuinan","9":"kyushunambuinan"};
        let autoRainSnowArea = "special";
        for( let areaCodePrefix in autoRainSnowAreas){
          if( amedasTable[obsCode]['type']=="B"){
            break;
          }
          if( areaCodePrefix == obsCode.substring(0,areaCodePrefix.length)){
            autoRainSnowArea = autoRainSnowAreas[areaCodePrefix];
            break;
          }
        }
        if( autoRainSnowThresholds[autoRainSnowArea]['snow']['T']*t+autoRainSnowThresholds[autoRainSnowArea]['snow']['H']>h ){
          autoRainSnow = "snow";
        }else if( autoRainSnowThresholds[autoRainSnowArea]['rain']['T']*t+autoRainSnowThresholds[autoRainSnowArea]['rain']['H']<h ){
          autoRainSnow = "rain";
        }
        if( amedas[obsCode]['weather']!=undefined && (amedas[obsCode]['weather'][0]==7 || amedas[obsCode]['weather'][0]==9 || amedas[obsCode]['weather'][0]==10)){
          amedas[obsCode]['autoRainSnow10m'] = amedas[obsCode]['weather'];
          amedas[obsCode]['autoRainSnow1h'] = amedas[obsCode]['weather'];
        }else{
          if( amedas[obsCode]['precipitation10m']!=undefined && amedas[obsCode]['precipitation10m'][0] >= 0.5){
            if( autoRainSnow == "snow"){
              amedas[obsCode]['autoRainSnow10m'] = [10, autoRainSnowQc];
            }else if( autoRainSnow == "rainsnow"){
              amedas[obsCode]['autoRainSnow10m'] = [9, autoRainSnowQc];
            }else if( autoRainSnow == "rain"){
              amedas[obsCode]['autoRainSnow10m'] = [7, autoRainSnowQc];
            }
          }else{
            amedas[obsCode]['autoRainSnow10m'] = [autoRainSnow, autoRainSnowQc];
          }
          if( amedas[obsCode]['precipitation1h']!=undefined && amedas[obsCode]['precipitation1h'][0] >= 0.5){
            if( autoRainSnow == "snow"){
              amedas[obsCode]['autoRainSnow1h'] = [10, autoRainSnowQc];
            }else if( autoRainSnow == "rainsnow"){
              amedas[obsCode]['autoRainSnow1h'] = [9, autoRainSnowQc];
            }else if( autoRainSnow == "rain"){
              amedas[obsCode]['autoRainSnow1h'] = [7, autoRainSnowQc];
            }
          }else{
            amedas[obsCode]['autoRainSnow1h'] = [autoRainSnow, autoRainSnowQc];
          }
        }
      }
    }
  }
  console.log( amedas);
  
  // 表示
  for( let zoom=minZoom; zoom<=maxZoom; zoom++){
    try{ map.removeLayer(targetLayer['arrow'][zoom]);}catch(e){}
  }
  try{ map.removeLayer(targetLayer['val']);}catch(e){}
  try{ map.removeLayer(targetLayer['icon']);}catch(e){}
  try{ map.removeLayer(targetLayer['name']);}catch(e){}
  try{ targetLayer['arrow'] = {}}catch(e){}
  try{ targetLayer['val'] = {}}catch(e){}
  try{ targetLayer['icon'] = {}}catch(e){}
  try{ targetLayer['name'] = {}}catch(e){}
  let amedasTimeStr = dateFormat( new Date(amedasTime), 'ymdhns');
  if( layers[amedasTimeStr] == undefined){
    layers[amedasTimeStr] = {}
  }
  if( layers[amedasTimeStr][elem] == undefined){
    layers[amedasTimeStr][elem] = {}
  }
  layers[amedasTimeStr][elem]['arrow'] = {}
  for( let zoom=minZoom; zoom<=maxZoom; zoom++){
    layers[amedasTimeStr][elem]['arrow'][zoom] = L.layerGroup();
  }
  layers[amedasTimeStr][elem]['val'] = L.layerGroup();
  layers[amedasTimeStr][elem]['icon'] = L.layerGroup();
  layers[amedasTimeStr][elem]['name'] = L.layerGroup();
  for( let obsCode in amedas){
    if( amedas[obsCode][elem] != undefined && amedas[obsCode][elem][1] != null){
      let val = "val ", symbol = "";
      if( (elem=="sun1h" || elem=="sun10m") && amedasTable[obsCode]['elems'][4] == 2){
        val = "val_s ";
        estimate = "";
      }
      let obsVal = L.divIcon({ html:"<a href='./amedasTable.html?station=" + obsCode + "' style='text-decoration:none; color:" + valColor(amedas[obsCode][elem][0],amedas[obsCode][elem][1],elem)[0] + "' title='" + amedasTable[obsCode]['kjName'] + "(" + amedasTable[obsCode]['knName'] + ")'>" + valQc(amedas[obsCode][elem][0],amedas[obsCode][elem][1],elem,0,obsCode) + symbol + "</a>", iconSize:[80,30], iconAnchor:[40,10], className:"plain center bold " + val + valColor(amedas[obsCode][elem][0],amedas[obsCode][elem][1],elem)[1]});
      if( elem=="wind" && qcJson[amedas[obsCode][elem][1]]['overwrite']==undefined){
        obsVal = L.divIcon({ html:"<a href='./amedasTable.html?station=" + obsCode + "&format=table10min' style='text-decoration:none; color:" + valColor(amedas[obsCode][elem][0],amedas[obsCode][elem][1],elem)[0] + "' title='" + amedasTable[obsCode]['kjName'] + "(" + amedasTable[obsCode]['knName'] + ")'>" + valQc(amedas[obsCode][elem][0],amedas[obsCode][elem][1],elem,0,obsCode) + "</a>", iconSize:[80,30], iconAnchor:[40,-5], className:"plain center bold val "+valColor(amedas[obsCode][elem][0],amedas[obsCode][elem][1],elem)[1]});
      }
      let obsIcon = L.divIcon({
        html:"<a href='./amedasTable.html?station=" + obsCode + "&format=table10min' style='text-decoration:none; color:" + valColor(amedas[obsCode][elem][0],amedas[obsCode][elem][1],elem)[0] + "' title='" + amedasTable[obsCode]['kjName'] + "(" + amedasTable[obsCode]['knName'] + ")'>" + valQc(amedas[obsCode][elem][0],amedas[obsCode][elem][1],elem,1,obsCode) + "</a>",
        iconSize: [80,30],
        iconAnchor: [40,10],
        className:"plain center bold val fuchiblack"
      });
      let obsName = L.divIcon({ html:"<span style='color:white;'>" + amedasTable[obsCode]['kjName'] + "</span>", iconSize:[80,30], iconAnchor:[40,-10], className:"plain center bold fuchiblack"});
      if( elem=="wind" && qcJson[amedas[obsCode][elem][1]]['overwrite']==undefined){
        obsName = L.divIcon({ html:"<span style='color:white;'>" + amedasTable[obsCode]['kjName'] + "</span>", iconSize:[80,30], iconAnchor:[40,-25], className:"plain center bold fuchiblack"});
      }
      let obsValMarker = L.marker([amedasTable[obsCode]['lat'][0]+amedasTable[obsCode]['lat'][1]/60, amedasTable[obsCode]['lon'][0]+amedasTable[obsCode]['lon'][1]/60], {icon: obsVal});
      let obsNameMarker = L.marker([amedasTable[obsCode]['lat'][0]+amedasTable[obsCode]['lat'][1]/60, amedasTable[obsCode]['lon'][0]+amedasTable[obsCode]['lon'][1]/60], {icon: obsName});
      let obsIconMarker = L.marker([amedasTable[obsCode]['lat'][0]+amedasTable[obsCode]['lat'][1]/60, amedasTable[obsCode]['lon'][0]+amedasTable[obsCode]['lon'][1]/60], {icon: obsIcon});
      layers[amedasTimeStr][elem]['val'].addLayer( obsValMarker);
      layers[amedasTimeStr][elem]['name'].addLayer( obsNameMarker);
      layers[amedasTimeStr][elem]['icon'].addLayer( obsIconMarker);
      if( elem == 'wind'){
        for( let zoom=minZoom; zoom<=maxZoom; zoom++){
          let obsArrow = L.polygon(
            valArrow(amedas[obsCode]['windDirection'][0],amedas[obsCode]['windDirection'][1],amedasTable[obsCode]['lat'][0]+amedasTable[obsCode]['lat'][1]/60, amedasTable[obsCode]['lon'][0]+amedasTable[obsCode]['lon'][1]/60, zoom)
          ,{
            color: valColor(amedas[obsCode][elem][0],amedas[obsCode]['wind'][1],elem)[1],
            opacity: 1,
            fillColor: valColor(amedas[obsCode][elem][0],amedas[obsCode]['wind'][1],elem)[0],
            fillOpacity: 1
          });
          layers[amedasTimeStr][elem]['arrow'][zoom].addLayer( obsArrow);
        }
      }
    }else if( elem == "obsStation"){
      let obsType = amedasTable[obsCode]['type'];
      let obsElems = amedasTable[obsCode]['elems'];
      let obsColor = "#84919e";
      let obsShape = "●";
      if( obsElems[5]=="1"){
        obsShape = "■";
        obsElems = obsElems.substring(0,5) + "0" + obsElems.substring(6,8);
      }
      let obsSize = "val_s";
      let obsTypes={"A":{"size":"val","color":"#ff4b00"},"B":{"size":"val","color":"#ff4b00"},"C":{"01000000":{"color":"#005aff"},"11110000":{"color":"#4dc4ff"},"11112000":{"color":"#03af7a"},"11111000":{"color":"#03af7a","shape":"▲"},"11112010":{"color":"#f6aa00"}},"D":{"size":"val","color":"#990099"},"E":{"size":"val","color":"#990099"},"F":{"size":"val","color":"#804000"},"G":{"size":"val","color":"#c8c8cb"}}
      if( obsTypes[obsType]["size"]!=undefined){
        obsSize = obsTypes[obsType]["size"];
      }
      if( obsTypes[obsType]["color"]!=undefined){
        obsColor = obsTypes[obsType]["color"];
      }
      if( obsTypes[obsType][obsElems]!=undefined){
        if( obsTypes[obsType][obsElems]["color"]!=undefined){
          obsColor = obsTypes[obsType][obsElems]["color"];
        }
        if( obsTypes[obsType][obsElems]["shape"]!=undefined){
          obsShape = obsTypes[obsType][obsElems]["shape"];
        }
      }
      let obsIcon = L.divIcon({ html:"<a href='./amedasTable.html?station=" + obsCode + "&format=table10min' style='text-decoration:none; color:" + obsColor + ";'><span class='" + obsSize + "'>" + obsShape + "</a>", iconSize:[80,30], iconAnchor:[40,10], className:"plain center bold val fuchiblack"});
      let obsName = L.divIcon({ html:"<span style='color:white;'>" + amedasTable[obsCode]['kjName'] + "</span>", iconSize:[80,30], iconAnchor:[40,-11], className:"plain center bold fuchiblack"});
      if( elem == "obsStation"){
        obsName = L.divIcon({ html:"<div style='color:white;line-height:0.7rem;'>" + amedasTable[obsCode]['kjName'] + "<br><span style='font-size:70%;'>" + amedasTable[obsCode]['knName'] + "</span></div>", iconSize:[120,30], iconAnchor:[60,-13], className:"plain center bold fuchiblack"});
      }
      let obsValMarker = L.marker([amedasTable[obsCode]['lat'][0]+amedasTable[obsCode]['lat'][1]/60, amedasTable[obsCode]['lon'][0]+amedasTable[obsCode]['lon'][1]/60], {icon: obsIcon});
      let obsIconMarker = L.marker([amedasTable[obsCode]['lat'][0]+amedasTable[obsCode]['lat'][1]/60, amedasTable[obsCode]['lon'][0]+amedasTable[obsCode]['lon'][1]/60], {icon: obsIcon});
      let obsNameMarker = L.marker([amedasTable[obsCode]['lat'][0]+amedasTable[obsCode]['lat'][1]/60, amedasTable[obsCode]['lon'][0]+amedasTable[obsCode]['lon'][1]/60], {icon: obsName});
      layers[amedasTimeStr][elem]['val'].addLayer( obsValMarker);
      layers[amedasTimeStr][elem]['name'].addLayer( obsNameMarker);
      layers[amedasTimeStr][elem]['icon'].addLayer( obsIconMarker);
    }
  }
  targetLayer['val'] = layers[amedasTimeStr][elem]['val'];
  targetLayer['name'] = layers[amedasTimeStr][elem]['name'];
  targetLayer['icon'] = layers[amedasTimeStr][elem]['icon'];
  if( elem == 'wind'){
    targetLayer['arrow'] = layers[amedasTimeStr]['wind']['arrow'];
  }
  map.addLayer( targetLayer['val']);
  map.addLayer( targetLayer['name']);
  map.addLayer( targetLayer['icon']);
  if( elem == 'wind'){
    map.addLayer( targetLayer['arrow'][map.getZoom()]);
  }
  controlLayers();
  displayHanrei( elem);
  let elemJa = amedasElem[elem];
  if( elem == "obsStation"){
    document.getElementById('info').innerHTML = "地点名";
  }else if( elem.indexOf('precipitation')!=-1 || ( elem.indexOf('snow')!=-1 && elem!='snow')){
    document.getElementById('info').innerHTML = dateFormat( amedasTime, 'y年m月d日 h時n分までの') + elemJa;
  }else if( elem=="null"){
    document.getElementById('info').innerHTML = dateFormat( amedasTime, 'y年m月d日 h時n分');
  }else{
    document.getElementById('info').innerHTML = dateFormat( amedasTime, 'y年m月d日 h時n分の') + elemJa;
  }
}

function getOverlay( targetTimes){
  let targDatetime = new Date( targetTimes['target'].getFullYear(), targetTimes['target'].getMonth(), targetTimes['target'].getDate(), targetTimes['target'].getHours(), targetTimes['target'].getMinutes());
  let overElem = document.getElementById("overElem").value;
  let targDatetimeUtc = new Date( targDatetime.getFullYear(), targDatetime.getMonth(), targDatetime.getDate(), targDatetime.getHours()-9, targDatetime.getMinutes(), targDatetime.getSeconds());
  let targDatetimeUtc10m = new Date( targDatetime.getFullYear(), targDatetime.getMonth(), targDatetime.getDate(), targDatetime.getHours()-9, targDatetime.getMinutes() - targDatetime.getMinutes()%10);
  let targDatetimeUtc1h = new Date( targDatetime.getFullYear(), targDatetime.getMonth(), targDatetime.getDate(), targDatetime.getHours()-9);
  let overElems = {"rad":{"c0":"jmatile","c1":"nowc","c2":dateFormat(targDatetimeUtc,'ymdhns'),"c3":"none","c5":"surf","c6":"hrpns","c10":"png","maxNativeZoom":10},"r1":{"c0":"jmatile","c1":"rasrf","c2":dateFormat(targDatetimeUtc10m,'ymdhns'),"c3":"immed","c5":"surf","c6":"rasrf","c10":"png","maxNativeZoom":10},"r3":{"c0":"jmatile","c1":"rasrf","c2":dateFormat(targDatetimeUtc10m,'ymdhns'),"c3":"immed","c5":"surf","c6":"rasrf03h","c10":"png","maxNativeZoom":10},"r24":{"c0":"jmatile","c1":"rasrf","c2":dateFormat(targDatetimeUtc10m,'ymdhns'),"c3":"immed","c5":"surf","c6":"rasrf24h","c10":"png","maxNativeZoom":10},"sd":{"c0":"jmatile","c1":"snow","c2":dateFormat(targDatetimeUtc1h,'ymdhns'),"c3":"none","c5":"surf","c6":"snowd","c10":"png","maxNativeZoom":10},"s3":{"c0":"jmatile","c1":"snow","c2":dateFormat(targDatetimeUtc1h,'ymdhns'),"c3":"none","c5":"surf","c6":"snowf03h","c10":"png","maxNativeZoom":10},"s6":{"c0":"jmatile","c1":"snow","c2":dateFormat(targDatetimeUtc1h,'ymdhns'),"c3":"none","c5":"surf","c6":"snowf06h","c10":"png","maxNativeZoom":10},"s12":{"c0":"jmatile","c1":"snow","c2":dateFormat(targDatetimeUtc1h,'ymdhns'),"c3":"none","c5":"surf","c6":"snowf12h","c10":"png","maxNativeZoom":10},"s24":{"c0":"jmatile","c1":"snow","c2":dateFormat(targDatetimeUtc1h,'ymdhns'),"c3":"none","c5":"surf","c6":"snowf24h","c10":"png","maxNativeZoom":10},"s48":{"c0":"jmatile","c1":"snow","c2":dateFormat(targDatetimeUtc1h,'ymdhns'),"c3":"none","c5":"surf","c6":"snowf48h","c10":"png","maxNativeZoom":10},"s72":{"c0":"jmatile","c1":"snow","c2":dateFormat(targDatetimeUtc1h,'ymdhns'),"c3":"none","c5":"surf","c6":"snowf72h","c10":"png","maxNativeZoom":10},"sat_ir":{"c0":"himawari","c1":"satimg","c2":dateFormat(targDatetimeUtc10m,'ymdhns'),"c3":"jp","c5":"B13","c6":"TBB","c10":"jpg","maxNativeZoom":7},"sat_vis":{"c0":"himawari","c1":"satimg","c2":dateFormat(targDatetimeUtc10m,'ymdhns'),"c3":"jp","c5":"B03","c6":"ALBD","c10":"jpg","maxNativeZoom":7},"sat_vap":{"c0":"himawari","c1":"satimg","c2":dateFormat(targDatetimeUtc10m,'ymdhns'),"c3":"jp","c5":"B08","c6":"TBB","c10":"jpg","maxNativeZoom":7},"sat_tru":{"c0":"himawari","c1":"satimg","c2":dateFormat(targDatetimeUtc10m,'ymdhns'),"c3":"jp","c5":"REP","c6":"ETC","c10":"jpg","maxNativeZoom":7},"sat_str":{"c0":"himawari","c1":"satimg","c2":dateFormat(targDatetimeUtc10m,'ymdhns'),"c3":"jp","c5":"SND","c6":"ETC","c10":"jpg","maxNativeZoom":7},"sat_day":{"c0":"himawari","c1":"satimg","c2":dateFormat(targDatetimeUtc10m,'ymdhns'),"c3":"jp","c5":"DMS","c6":"ETC","c10":"jpg","maxNativeZoom":7},"sat_nig":{"c0":"himawari","c1":"satimg","c2":dateFormat(targDatetimeUtc10m,'ymdhns'),"c3":"jp","c5":"NGT","c6":"ETC","c10":"jpg","maxNativeZoom":7},"sat_nat":{"c0":"himawari","c1":"satimg","c2":dateFormat(targDatetimeUtc10m,'ymdhns'),"c3":"jp","c5":"DNC","c6":"ETC","c10":"jpg","maxNativeZoom":7},"sat_sno":{"c0":"himawari","c1":"satimg","c2":dateFormat(targDatetimeUtc10m,'ymdhns'),"c3":"jp","c5":"DSL","c6":"ETC","c10":"jpg","maxNativeZoom":7}}

  let radConfigs = { maxNativeZoom:10, maxZoom:18, minZoom:4, nativeZoomDelta:2, pane:"paneM3"}
  if( overElem.indexOf("sat_")==0){
    radConfigs['nativeZoomDelta']=1;
    radConfigs['maxNativeZoom']=6;
  }
  if( layers[dateFormat(targDatetime)] == undefined){
    layers[dateFormat(targDatetime)] = {}
  }
  layers[dateFormat(targDatetime)][overElem] = L.tileLayer('https://www.jma.go.jp/bosai/' + overElems[overElem]["c0"] + '/data/' + overElems[overElem]["c1"] + '/' + overElems[overElem]["c2"] + '/' + overElems[overElem]["c3"] + '/' + overElems[overElem]["c2"] + '/' + overElems[overElem]["c5"] + '/' + overElems[overElem]["c6"] + '/{z}/{x}/{y}.' + overElems[overElem]["c10"], radConfigs);
  if( overElem.indexOf("sat_")==0){
    layers[dateFormat(targDatetime)][overElem+'_wide'] = L.tileLayer('https://www.jma.go.jp/bosai/' + overElems[overElem]["c0"] + '/data/' + overElems[overElem]["c1"] + '/' + overElems[overElem]["c2"] + '/fd/' + overElems[overElem]["c2"] + '/' + overElems[overElem]["c5"] + '/' + overElems[overElem]["c6"] + '/{z}/{x}/{y}.' + overElems[overElem]["c10"], radConfigs);
  }
  const satmapWideConfigs = { maxNativeZoom:5, maxZoom:18, minZoom:4, nativeZoomDelta:2, pane:"paneM2"};
  const satmapConfigs = { maxNativeZoom:11, maxZoom:18, minZoom:4, pane:"paneM2"};
  layers['satmap_wide'] = L.tileLayer('https://www.jma.go.jp/tile/jma/sat/{z}/{x}/{y}.png', satmapWideConfigs);
  layers['satmap'] = L.tileLayer('https://www.jma.go.jp/tile/jma/base/{z}/{x}/{y}.png', satmapConfigs);
  
  if( document.getElementById("overlay").checked){
    try{ map.removeLayer( targetLayer['ovr1']);}catch(e){}
    try{ map.removeLayer( targetLayer['ovr1_wide']);}catch(e){}
    try{ map.removeLayer( targetLayer['ovr2']);}catch(e){}
    try{ map.removeLayer( targetLayer['ovr2_wide']);}catch(e){}
    if( overElem.indexOf("sat_")==-1){
      targetLayer['ovr2'] = layers[dateFormat(targDatetime)][overElem];
    }else{
      targetLayer['ovr1'] = layers['satmap'];
      targetLayer['ovr1_wide'] = layers['satmap_wide'];
      targetLayer['ovr2'] = layers[dateFormat(targDatetime)][overElem];
      targetLayer['ovr2_wide'] = layers[dateFormat(targDatetime)][overElem+'_wide'];
    }
    if( overElem.indexOf("sat_")==-1){ 
      map.addLayer( targetLayer['ovr2']);
    }else{
      if( map.getZoom() <= 8){
        map.addLayer( targetLayer['ovr1_wide']);
      }else{
        map.addLayer( targetLayer['ovr1']);
      }
      if( map.getZoom() <= 6){
        map.addLayer( targetLayer['ovr2_wide']);
      }else{
        map.addLayer( targetLayer['ovr2']);
      }
    }
    controlOpacity();
  }
}

function getLiden( targetTimes){
  let lidenTime = new Date();
  if( targetTimes['lidenLatest'].getTime() - targetTimes['target'].getTime() > 10*60*1000){
    lidenTime = new Date( targetTimes['target'].getFullYear(), targetTimes['target'].getMonth(), targetTimes['target'].getDate(), targetTimes['target'].getHours()-9, targetTimes['target'].getMinutes());
  }else{
    lidenTime = new Date( targetTimes['lidenLatest'].getFullYear(), targetTimes['lidenLatest'].getMonth(), targetTimes['lidenLatest'].getDate(), targetTimes['lidenLatest'].getHours()-9, targetTimes['lidenLatest'].getMinutes());
  }
  console.log( "amedas:" + dateFormat(targetTimes['target'],'D日h:n'));
  console.log( "latestLiden:" + dateFormat(targetTimes['lidenLatest'],'D日h:n'));
  console.log( "displayLiden:" + dateFormat(lidenTime,'D日h:n'));
  fetch("https://www.jma.go.jp/bosai/jmatile/data/nowc/" + dateFormat(lidenTime, 'ymdhns') + "/none/" + dateFormat(lidenTime, 'ymdhns') + "/surf/liden/data.geojson?id=liden")
  .then((response) => response.json())
  .then((liden) => displayLiden( liden, lidenTime));
}

function displayLiden( liden, lidenTime){
  console.log( liden);
  try{ map.removeLayer(targetLayer['liden']);}catch(e){}
  try{ targetLayer['liden'] = {}}catch(e){}
  let lidenTimeStr = dateFormat( new Date(lidenTime), 'ymdhns');
  if( layers[lidenTimeStr] == undefined){
    layers[lidenTimeStr] = {}
  }
  layers[lidenTimeStr] = L.layerGroup();
  for( let feature of liden['features']){
    let obsTime = (feature['properties']['obstimeJST']).substring(11,19);
    let lidenHtml = "";
    if( feature['properties']['type'] == 4){
      lidenHtml = "<span title='" + obsTime + " 対地'>☈</span>";
    }else{
      lidenHtml = "<span title='" + obsTime + " 雲間'>Ｔ</span>";
    }
    let lidenIcon = L.divIcon({
      html:lidenHtml, iconSize:[80,30], iconAnchor:[40,10], className:"plain center bold val_l fuchiblack liden"
    });
    let lidenIconMarker = L.marker([feature['geometry']['coordinates'][1], feature['geometry']['coordinates'][0]], {icon: lidenIcon});
    layers[lidenTimeStr].addLayer( lidenIconMarker);
  }
  targetLayer['liden'] = layers[lidenTimeStr];
  map.addLayer( targetLayer['liden']);
  controlLayers( map.getZoom());
}

function displayHanrei(elem){
  let hanrei2 = L.control({ position: "topright" });
  hanrei2.onAdd = function (map) {
    this.divElem = L.DomUtil.create('details', 'hanrei');
    this.divElem.id = "hanrei2";
    this.divElem.innerHTML = "<summary>凡例</summary>";
    return this.divElem;
  }
  if( document.getElementById('hanrei2') == undefined){
    hanrei2.addTo(map);
  }
  let hanrei2Str = "";
  hanrei2Str = hanrei2Str + "<summary>凡例</summary>";
  hanrei2Str = hanrei2Str + "<table class='hanrei'>";
  if( elem!="weather" && elem!="autoRainSnow10m" && elem!="autoRainSnow1h" && elem!="obsStation" && elem!="null"){
    hanrei2Str = hanrei2Str + "<tr><td>" + colors[elem][colors[elem].length-2][0] + "～</td><td style='background:" + colors[elem][colors[elem].length-1][1] + "'>　</td></tr>";
    for( let i=colors[elem].length-2; i>=1; i--){
      hanrei2Str = hanrei2Str + "<tr><td>" + colors[elem][i-1][0] + "～" + colors[elem][i][0] + "</td><td style='background:" + colors[elem][i][1] + "'>　</td></tr>";
    }
    hanrei2Str = hanrei2Str + "<tr><td>～" + colors[elem][0][0] + "</td><td style='background:" + colors[elem][0][1] + "'>　</td></tr>";
  }else if( elem=="weather"){
    for( let i in weathers){
      hanrei2Str = hanrei2Str + "<tr><td>" + weathers[i] + "</td><td><img src='./images/" + i + ".png' style='height:20px;'></img></td></tr>";
    }
  }else if( elem=="autoRainSnow10m" || elem=="autoRainSnow1h"){
    for( let i in autoRainSnows){
      hanrei2Str = hanrei2Str + "<tr><td>" + autoRainSnows[i] + "</td><td><img src='./images/" + i + ".png' style='height:20px;'></img></td></tr>";
    }
  }else if( elem=="obsStation"){
    for( let i in obsStations){
      hanrei2Str = hanrei2Str + "<tr><td style='text-align:center;'><span class='fuchiblack' style='color:" + obsStations[i]['color'] + "'>" + obsStations[i]['shape'] + "</td><td style='text-align:left;'>" + obsStations[i]['type'] + "</td><td style='text-align:left;'>" + obsStations[i]['elems'] + "</td></tr>";
    }
  }else if( elem=="null"){
    hanrei2Str = hanrei2Str + "(なし)";
  }
  hanrei2Str = hanrei2Str + "</table>";
  document.getElementById("hanrei2").innerHTML = hanrei2Str;
}

// ズームレベル変更時
map.on('zoomend', function(){
  controlLayers();
});

// ベースレイヤー変更時
map.on('baselayerchange', function(){
  controlLayers();
});

// 移動イベント
map.on('move', function () {
  let linkHash = location.hash.substring(1); // zoom/lat/lon
  let openUrl = "";
  document.getElementById("link_gsi").href = "http://maps.gsi.go.jp/#" + linkHash;
  document.getElementById("link_osm").href = "https://www.openstreetmap.org/#map=" + linkHash;
  document.getElementById("link_yho").href = "https://map.yahoo.co.jp/?lat=" + linkHash.split('/')[1] + "&lon=" + linkHash.split('/')[2] + "&zoom=" + (linkHash.split('/')[0]);
  document.getElementById("link_gle").href = "https://www.google.co.jp/maps/@" + linkHash.split('/')[1] + "," + linkHash.split('/')[2] + "," + linkHash.split('/')[0] + "z";
  document.getElementById("link_jma").href = "https://www.jma.go.jp/bosai/map.html#" + linkHash + "/&elem=" + document.getElementById('elem').value + "&contents=amedas";
  controlGrays();
});

function controlLayers(){
  let zoom = map.getZoom();
  let elem = document.getElementById('elem').value;
  let isGray = map.hasLayer(layerGray);
  if( (elem.substring(0,4)!='snow' && elem!='visibility' && elem!='normalPressure' && elem!='weather' && zoom<=8) || zoom<=7){ 
    try{ map.removeLayer(targetLayer['name']);}catch(e){}
  }else{ 
    try{ map.addLayer(targetLayer['name']);}catch(e){}
  }
  if( 8<=zoom){ 
    try{ map.removeLayer( targetLayer['areaGray']);}catch(e){}
    for( let i in targetLayer['areaGrayDetail']){
      try{ map.addLayer( targetLayer['areaGrayDetail'][i]);}catch(e){}
    }
  }else{ 
    if( isGray){
      try{ map.addLayer( targetLayer['areaGray']);}catch(e){}
    }else{
      try{ map.removeLayer( targetLayer['areaGray']);}catch(e){}
    }
    for( let i in targetLayer['areaGrayDetail']){
      try{ map.removeLayer( targetLayer['areaGrayDetail'][i]);}catch(e){}
    }
  }
  if( ( elem!='visibility' && elem!='normalPressure' && zoom<8) || zoom<7){
    try{ map.removeLayer(targetLayer['val']); map.addLayer(targetLayer['icon']);}catch(e){}
  }else{
    try{ map.addLayer(targetLayer['val']); map.removeLayer(targetLayer['icon']);}catch(e){}
  }
  for( let i=minZoom; i<=maxZoom; i++){
    try{ map.removeLayer( targetLayer['arrow'][i]);}catch(e){}
  }
  try{
    if( elem == 'wind'){ map.addLayer( targetLayer['arrow'][zoom]);}
  }catch(e){}
  if(document.getElementById("overlay").checked){
    console.log( document.getElementById('overElem').value)
    if( document.getElementById('overElem').value.indexOf("sat_")==-1){
      try{ map.addLayer( targetLayer['ovr2']);}catch(e){}
    }else{
      if( 8<=zoom){
        try{ map.addLayer( targetLayer['ovr1']);}catch(e){}
        try{ map.removeLayer( targetLayer['ovr1_wide']);}catch(e){}
      }else{
        try{ map.removeLayer( targetLayer['ovr1']);}catch(e){}
        try{ map.addLayer( targetLayer['ovr1_wide']);}catch(e){}
      }
      if( 6<=zoom){
        try{ map.addLayer( targetLayer['ovr2']);}catch(e){}
        try{ map.removeLayer( targetLayer['ovr2_wide']);}catch(e){}
      }else{
        try{ map.removeLayer( targetLayer['ovr2']);}catch(e){}
        try{ map.addLayer( targetLayer['ovr2_wide']);}catch(e){}
      }
    }
  }else{
    try{ map.removeLayer( targetLayer['ovr1']);}catch(e){}
    try{ map.removeLayer( targetLayer['ovr1_wide']);}catch(e){}
    try{ map.removeLayer( targetLayer['ovr2']);}catch(e){}
    try{ map.removeLayer( targetLayer['ovr2_wide']);}catch(e){}
  }
  if(document.getElementById("liden").checked){
    try{ map.addLayer( targetLayer['liden']);}catch(e){}
  }else{
    try{ map.removeLayer( targetLayer['liden']);}catch(e){}
  }
  if( document.getElementById("overlayMunicipal").checked){
    try{ map.addLayer( layers['municipal']);}catch(e){}
  }else{
    try{ map.removeLayer(layers['municipal']);}catch(e){}
  }
}

function controlGrays(){
  let zoom = map.getZoom();
  let bounds = map.getBounds();
  if( 8<=zoom){
    for( let i in relm){
      if( (relm[i]['sw'][0]<=bounds['_northEast']['lat'] && bounds['_southWest']['lat']<=relm[i]['ne'][0]) && (relm[i]['sw'][1]<=bounds['_northEast']['lng'] && bounds['_southWest']['lng']<=relm[i]['ne'][1])){
        if( targetLayer['areaGrayDetail'][i] == undefined){
          targetLayer['areaGrayDetail'][i] = L.layerGroup();
          
          
          fetch("https://www.jma.go.jp/bosai/common/const/geojson/landslides_" + [i] + ".json")
          .then((response) => response.json())
          .then((class30sPolygonsResponse) => {
            class30sPolygons[i] = class30sPolygonsResponse;
            for( let j in class30sPolygons[i]['features']){
//              let grayStyle = { stroke:true, color:"#c8c8cb", weight:1, opacity: 1, fillColor:"#c8c8cb", fillOpacity:1, pane:"paneM5"}
//              let grayStyle = { stroke:true, color:"#b4b4b7", weight:1, opacity: 1, fillColor:"#b4b4b7", fillOpacity:1, pane:"paneM5"}
              let grayStyle = { stroke:true, color:"#949497", weight:1, fillColor:"#949497", fillOpacity:1, pane:"paneM5"}
              targetLayer['areaGrayDetail'][i].addLayer( L.geoJSON(class30sPolygons[i]['features'][j], { style: grayStyle}));
            }
            controlLayers();
          });
        }
      }
    }
  }
}

// キークリックイベント
document.addEventListener('keydown', (event) => {
  var keyName = event.key;

  if ( event.key == "ArrowLeft") {
    event.preventDefault();
    chgTime(-10);
    getTime("preventRefresh");
  }else if ( event.key == "ArrowRight") {
    event.preventDefault();
    chgTime(+10);
    getTime("preventRefresh");
  }
});


function controlOpacity(){
  let overlayOpacity = document.getElementById("overlayOpacity").value;
  targetLayer['ovr2'].setOpacity(overlayOpacity);
  if( targetLayer['ovr2_wide']!=undefined){ targetLayer['ovr2_wide'].setOpacity(overlayOpacity);}
}

function jump(){
  let targDatetime = document.getElementById("targDatetime").value;
  let elem = document.getElementById("elem").value;
  let overElem = document.getElementById("overElem").value;
  let overElems = {"precipitation10m":"rad","precipitation1h":"r1","precipitation3h":"r3","precipitation24h":"r24","snow":"sd","snow6h":"s6","snow12h":"s12","snow24h":"s24"}
  if( overElems[elem]!=undefined){
    overElem = overElems[elem];
  }
  let autoRefresh="false", overlay="false", liden="false", menuOpen="false", displayMunicipal="false";
  if( document.getElementById("autoRefresh").checked){ autoRefresh = "true"}
  if( document.getElementById("overlay").checked){ overlay = "true"}
  if( document.getElementById("liden").checked){ liden = "true"}
  if( document.getElementById("menu").open){ menuOpen = "true"}
  if( document.getElementById("overlayMunicipal").checked){ displayMunicipal = "true"}
  let hash = location.hash;
  let url = "./amedas.html?elem=" + elem + "&autoRefresh=" + autoRefresh + "&overlay=" + overlay + "&overElem=" + overElem + "&liden=" + liden + "&displayMunicipal=" + displayMunicipal + "&menuOpen=" + menuOpen;
  if( autoRefresh == "false"){
    url = url + "&targDatetime=" + targDatetime;
  }
  history.replaceState("","",url+hash);
}

function valColor( val, qc, elem){
  let color = "#ffffff", fuchiColor = "black";
  if( elem == "visibility"){
    val = val / 1000;
  }
  try{
    if( qcJson[qc]['overwrite'] != undefined){
      color = "#ffffff";
    }else{
      for( let col of colors[elem]){
        if( val < col[0]){
          color = col[1];
          if( parseInt(color.substring(1,3),16) + parseInt(color.substring(3,5),16) + parseInt(color.substring(5,7),16) < 408){
            fuchiColor = "white";
          }else{
            fuchiColor = "black";
          }
          break;
        }
      }
    }
  }catch(e){
//    console.log( "val:" + val + " qc:" + qc + " elem:" + elem);
  }
  return [color, "fuchi"+fuchiColor];
}

function valQc( val, qc, elem, square=0, obsCode){
  let digit = 1;
  if( elem=="humidity" || elem=="weather" || elem=="autoRainSnow10m" || elem=="autoRainSnow1h" || elem.indexOf("snow")!=-1 || elem=="sun10m" || elem=="equivPotTemp"){
    digit = 0;
  }else if( elem=="visibility"){
    digit = 2;
  }
  if( elem == "visibility"){
    val = val / 1000;
  }
  if( qcJson[qc]['overwrite'] != undefined){
    val = qcJson[qc]['overwrite'];
  }else if( elem!="weather" && elem!="autoRainSnow10m" && elem!="autoRainSnow1h"){
    if( square == 0){
      if( val != 0){
        val = val.toFixed(digit) + qcJson[qc]['mark'];
      }else{
        val = "0" + qcJson[qc]['mark'];
      }
    }else{
      if( ( elem.indexOf("precipitation")!=-1 && val==0) || ( elem.indexOf("snow")!=-1 && val==0) || elem=='wind'){
        val = "";
      }else if( ( elem=="sun1h" || elem=="sun10m") && amedasTable[obsCode]!=undefined && amedasTable[obsCode]['elems'][4]=="2"){
        val = "・";
      }else{
        val = "■";
      }
    }
  }else{
    val = "<img src='./images/" + val + ".png' style='height:20px;'>";
//    if( weathers[val] != undefined){
//      val = weathers[val];
//    }
  }
  return val;
}

function valArrow( val, qc, lat, lon, zoom){
//  let size = 0.03 * 1000 / zoom**3;
  let size = 20 / 2**zoom;
  if( zoom < 9){
    size = size * (zoom+1) /10;
  }
  lat = lat + size/3;
  if( qcJson[qc]['overwrite'] != undefined){
    val = [[lat,lon]];
  }else{
    let deg = ( 450 - val * 22.5) % 360;
    let rad = deg * Math.PI / 180;
    let lat1, lat2, lat3, lon1, lon2, lon3;
    lat1 = lat + Math.sin(-rad) * size;
    lon1 = lon - Math.cos(-rad) * size;
    lat2 = lat + Math.sin(-rad + Math.PI*2.2/3) * size;
    lon2 = lon - Math.cos(-rad + Math.PI*2.2/3) * size;
    lat3 = lat + Math.sin(-rad + Math.PI*3.8/3) * size;
    lon3 = lon - Math.cos(-rad + Math.PI*3.8/3) * size;
    val = [ [lat1, lon1],[lat2,lon2],[lat,lon],[lat3,lon3]];
  }
  return val;
}

function dateFormat( d, f='ymdhns', is24=false){
  const j=["日","月","火","水","木","金","土"];const e=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  if(is24&&d.getHours()==0){d.setDate(d.getDate()-1);f=f.replace(/h/g,"24").replace(/H/g,24);}
  f=f.replace(/y/g,("000"+d.getFullYear()).slice(-4)).replace(/Y/g,d.getFullYear()).replace(/m/g,("0"+(d.getMonth()+1)).slice(-2)).replace(/M/g,d.getMonth()+1).replace(/d/g,("0"+d.getDate()).slice(-2)).replace(/D/g,d.getDate());
  f=f.replace(/w/g,j[d.getDay()]).replace(/W/g,e[d.getDay()]);
  f=f.replace(/h/g,("0"+d.getHours()).slice(-2)).replace(/H/g,d.getHours()).replace(/n/g,("0"+d.getMinutes()).slice(-2)).replace(/N/g,d.getMinutes()).replace(/s/g,("0"+d.getSeconds()).slice(-2)).replace(/S/g,d.getSeconds());
  return f;
}

function Mathlog( number, base){
  return Math.log(number) / Math.log(base);
}

