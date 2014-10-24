var w = 500,
    h = 500;

var colorscale = d3.scale.category10();



//Data

var data = {
  A: {"s":[1,4,2,3,4,5,3,2,2,5,5,4,3,5,4,2,2,2,5,5,3,4],"e":[2,3,3,2,4,4,2,2,5,1,4,2,3,2,2,1,1,5,3,2,1,3]},
  B: {"s":[2,3,4,3,4,1,5,1,4,4,5,5,3,5,3,4,2,1,5,2,5,5],"e":[4,4,5,5,4,2,2,2,3,4,3,1,2,2,5,5,2,4,4,2,5,3]},
  C: {"s":[2,2,4,1,5,1,4,2,3,4,2,4,3,3,4,1,4,3,2,1,5,3],"e":[5,2,1,5,5,1,3,4,5,1,5,4,1,1,5,4,2,1,4,2,5,2]},
  D: {"s":[2,1,3,4,1,3,1,2,2,2,3,4,3,1,3,1,3,4,3,4,2,1],"e":[2,3,5,5,5,5,4,5,2,1,3,3,2,2,3,3,4,4,1,4,3,1]}
};

var axes = ["Email", "Social Networks", "Internet Banking", "News Sportsites", "Search Engine", "View Shopping sites", "Paying Online", "Buy Online", "Stream Music", "Online Gaming", "Navigation", "App connected to TV program", "Offline Gaming", "Photo Video", "Reading", "Listen Music", "Watch TV", "TV Movies Streaming", "Listen Radio", "Sending Money", "Other", "Use less Once week"];

var dd = _.map(data, function(it) {
  // e.g. it = data.A
  var ret = {};
  _.each(it, function(v, k) {
    //e.g e = data.A.s

    ret[k] = _.map(v, function(j) {
      return {axis: axes[j], value: j}
    });
  });
  return ret;
});

var ddd = {};
_.forEach(data, function(i, k) {
  _.forEach(i, function(j, kk) {
    ddd[k + kk] = _.map(j, function(jj) {
      return { axis: axes[jj], value: jj };
    });
  });
});
var d = _.map(ddd, function(i) {
  return i;
});

//Legend titles
//var LegendOptions = ['Smartphone','Tablet'];
var LegendOptions = _.map(ddd, function(v, k) {
  return k;
});

//var d = [
//  [
//    {axis:"Email",value:0.59},
//    {axis:"Social Networks",value:0.56},
//    {axis:"Internet Banking",value:0.42},
//    {axis:"News Sportsites",value:0.34},
//    {axis:"Search Engine",value:0.48},
//    {axis:"View Shopping sites",value:0.14},
//    {axis:"Paying Online",value:0.11},
//    {axis:"Buy Online",value:0.05},
//    {axis:"Stream Music",value:0.07},
//    {axis:"Online Gaming",value:0.12},
//    {axis:"Navigation",value:0.27},
//    {axis:"App connected to TV program",value:0.03},
//    {axis:"Offline Gaming",value:0.12},
//    {axis:"Photo Video",value:0.4},
//    {axis:"Reading",value:0.03},
//    {axis:"Listen Music",value:0.22},
//    {axis:"Watch TV",value:0.03},
//    {axis:"TV Movies Streaming",value:0.03},
//    {axis:"Listen Radio",value:0.07},
//    {axis:"Sending Money",value:0.18},
//    {axis:"Other",value:0.07},
//    {axis:"Use less Once week",value:0.08}
//  ],[
//    {axis:"Email",value:0.48},
//    {axis:"Social Networks",value:0.41},
//    {axis:"Internet Banking",value:0.27},
//    {axis:"News Sportsites",value:0.28},
//    {axis:"Search Engine",value:0.46},
//    {axis:"View Shopping sites",value:0.29},
//    {axis:"Paying Online",value:0.11},
//    {axis:"Buy Online",value:0.14},
//    {axis:"Stream Music",value:0.05},
//    {axis:"Online Gaming",value:0.19},
//    {axis:"Navigation",value:0.14},
//    {axis:"App connected to TV program",value:0.06},
//    {axis:"Offline Gaming",value:0.24},
//    {axis:"Photo Video",value:0.17},
//    {axis:"Reading",value:0.15},
//    {axis:"Listen Music",value:0.12},
//    {axis:"Watch TV",value:0.1},
//    {axis:"TV Movies Streaming",value:0.14},
//    {axis:"Listen Radio",value:0.06},
//    {axis:"Sending Money",value:0.16},
//    {axis:"Other",value:0.07},
//    {axis:"Use less Once week",value:0.17}
//  ]
//];

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 5,
  levels: 5,
  ExtraWidthX: 300
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw("#chart", d, mycfg);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg = d3.select('#body')
    .selectAll('svg')
    .append('svg')
    .attr("width", w+300)
    .attr("height", h)

//Create the title for the legend
var text = svg.append("text")
    .attr("class", "title")
    .attr('transform', 'translate(90,0)')
    .attr("x", w - 70)
    .attr("y", 10)
    .attr("font-size", "12px")
    .attr("fill", "#404040")
    .text("What % of owners use a specific service in a week");

//Initiate Legend
var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(90,20)')
    ;
//Create colour squares
legend.selectAll('rect')
    .data(LegendOptions)
    .enter()
    .append("rect")
    .attr("x", w - 65 + 200)
    .attr("y", function(d, i){ return i * 20;})
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d, i){ return colorscale(i);})
    .on("mouseover", function(d, i) {
      d3.selectAll(".radar-chart-serie" + i).style("fill-opacity",.5);
    })
    .on("mouseout", function(d, i) {
      d3.selectAll(".radar-chart-serie" + i).style("fill-opacity",.1);
    });
;
//Create text next to squares
legend.selectAll('text')
    .data(LegendOptions)
    .enter()
    .append("text")
    .attr("x", w - 52 + 200)
    .attr("y", function(d, i){ return i * 20 + 9;})
    .attr("font-size", "11px")
    .attr("fill", "#737373")
    .text(function(d) { return d; })
    .on("mouseover", function(d, i) {
      d3.selectAll(".radar-chart-serie" + i).style("fill-opacity",.5);
    })
    .on("mouseout", function(d, i) {
      d3.selectAll(".radar-chart-serie" + i).style("fill-opacity",.1);
    });
;