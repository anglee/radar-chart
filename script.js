var w = 500,
    h = 500;

var colorscale = d3.scale.category10();
//var colorscale = function(i) {
//  return ["#AA3939", "#AA7239", "#AA8C39", "#AAA239",
//  "#84A136", "#2D882D", "#265B6A", "#323776"][i];
//};



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
var viewModel = [];
_.forEach(data, function(i, k) {
  _.forEach(i, function(j, kk) {
    ddd[k + kk] = _.map(j, function(jj) {
      return { axis: axes[jj], value: jj };
    });
    viewModel.push({
      name: k,
      type: kk,
      visible: true
    });
  });
});
var d = _.map(ddd, function(i) {
  return i;
});

//Legend titles
//var LegendOptions = ['Smartphone','Tablet'];
var LegendOptions = _.keys(ddd);
var individualOptions = _.keys(data);
var typeOptions = _.keys(data[individualOptions[0]]);

var allOptions = ["all"];

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
//var text = svg.append("text")
//    .attr("class", "title")
//    .attr('transform', 'translate(90,0)')
//    .attr("x", w - 70)
//    .attr("y", 10)
//    .attr("font-size", "12px")
//    .attr("fill", "#404040")
//    .text("What % of owners use a specific service in a week");

//Initiate Legend
var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(90,30)');

var typelegend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(90,5)');

var individuallegend = svg.append("g")
    .attr("class", "legend")
    .attr("height", 100)
    .attr("width", 200)
    .attr('transform', 'translate(50,30)');

var alllegend = svg.append("g")
    .attr("class", "legend")
    .attr("height", 100)
    .attr("width", 200)
    .attr('transform', 'translate(50,5)');

var hlx = w;
var hlw = 200;
var hly = 17;
var hl = svg.append("line")
    .attr("x1", hlx)
    .attr("y1", hly)
    .attr("x2", hlx + hlw)
    .attr("y2", hly)
    .style("stroke-width", "1px")
    .style("stroke", "#000000")
    .attr('transform', 'translate(50,5)');

var vlx = w + 47;
var vlh = 100;
var vly = 0;
var vl = svg.append("line")
    .attr("x1", vlx)
    .attr("y1", vly)
    .attr("x2", vlx)
    .attr("y2", vly + vlh)
    .style("stroke-width", "1px")
    .style("stroke", "#000000")
    .attr('transform', 'translate(50,5)');


var getFillColor = function(items) {
  if (_.all(items, function(it) {
    return it.visible === true;
  })) {
    return "#000000"
  };
  if (_.all(items, function(it) {
    return it.visible === false;
  })) {
    return "#FFFFFF"
  };
  return "#909090";
};

var refresh = function() {
  _.forEach(viewModel, function(series, i) {
    if (series.visible) {
      if (series.inFocus) {
        d3.selectAll("polygon.radar-chart-serie" + i).transition(200).style("fill-opacity",.5).style("stroke-opacity", 0.75);
      } else {
        d3.selectAll("polygon.radar-chart-serie" + i).transition(200).style("fill-opacity",.1).style("stroke-opacity", 0.5);
      }
      d3.selectAll("circle.radar-chart-serie" + i).transition(200).style("fill-opacity",0.9).style("stroke-opacity", 1);
    } else {
      d3.selectAll(".radar-chart-serie" + i).transition(200).style("fill-opacity",.0).style("stroke-opacity", "0.0");
    }
  });
  d3.selectAll("rect.legendrect").style("fill", function(d, i) {
    if (viewModel[i].visible) {
      return colorscale(i);
    } else {
      return "#F0F0F0";
    }
  });

  d3.selectAll("rect.typerect").style("fill", function(d, i) {
    var type = typeOptions[i];
    var ofType = _.filter(viewModel, function(it) {
      return it.type == type;
    });
    return getFillColor(ofType);
  });

  d3.selectAll("rect.namerect").style("fill", function(d, i) {
    var name = individualOptions[i];
    var ofName = _.filter(viewModel, function(it) {
      return it.name == name;
    });
    return getFillColor(ofName);
  });

  d3.selectAll("rect.allrect").style("fill", function(d, i) {
    return getFillColor(viewModel);
  });
};

var setItemsInFocus = function(items, inFocus) {
  _.each(items, function(it) {
    it.inFocus = inFocus;
  });
  refresh();
};

var setItemsVisibility = function(items) {
  if (_.all(items, function(it) { return it.visible === true; })) {
    _.each(items, function(it) {
      it.visible = !it.visible;
    });
  } else if (_.all(items, function(it) { return it.visible === false; })) {
    _.each(items, function(it) {
      it.visible = !it.visible;
    });
  } else {
    if (_.countBy(items, function(it) {
      return it.visible ? "visible" : "invisible";
    })["visible"] > items.length / 2) {
      _.each(items, function(it) {
        it.visible = false;
      });
    } else {
      _.each(items, function(it) {
        it.visible = true;
      });
    }
  };
  refresh();
};

//Create colour squares
legend.selectAll('rect')
    .data(LegendOptions)
    .enter()
    .append("rect")
    .attr("class", "legendrect clickable")
    .attr("x", function(d, i) {
      var ii = i % 2;
      return w - 65 + 80 * (1 + ii);
    })
    .attr("y", function(d, i) {
      var ii = Math.floor(i / 2);
      return ii * 20;
    })
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d, i){
      return colorscale(i);
    })
    .style("stroke-width", "1px")
    .style("stroke", function(d, i) {
      return colorscale(i);
    })
    .on("mouseover", function(d, i) {
      setItemsInFocus([viewModel[i]], true);
    })
    .on("mouseout", function(d, i) {
      setItemsInFocus([viewModel[i]], false);
    })
    .on("click", function(d, i) {
      setItemsVisibility([viewModel[i]]);
    });

//Create text next to squares
legend.selectAll('text')
    .data(LegendOptions)
    .enter()
    .append("text")
    .attr("class", "clickable")
    .attr("x", function(d, i) {
      var ii = i % 2;
      return w - 52 + 80 * (1 + ii);
    })
    .attr("y", function(d, i) {
      var ii = Math.floor(i / 2);
      return ii * 20 + 9;
    })
    .attr("font-size", "11px")
    .attr("fill", "#737373")
    .text(function(d) { return d; })
    .on("mouseover", function(d, i) {
      setItemsInFocus([viewModel[i]], true);
    })
    .on("mouseout", function(d, i) {
      setItemsInFocus([viewModel[i]], false);
    })
    .on("click", function(d, i) {
      setItemsVisibility([viewModel[i]]);
    });
var getItemsOfType = function(type) {
  return _.filter(viewModel, function(it) {
    return it.type == type;
  });
};
typelegend.selectAll('rect')
    .data(typeOptions)
    .enter()
    .append("rect")
    .attr("class", "typerect clickable")
    .attr("x", function(d, i) {
      var ii = i % 2;
      return w - 65 + 80 * (1 + ii);
    })
    .attr("y", function(d, i) {
      return 0;
    })
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d, i){
      return "#101010";
    })
    .style("stroke-width", "1px")
    .style("stroke", function(d, i) {
      return "#000000";
    })
    .on("mouseover", function(d, i) {
      setItemsInFocus(getItemsOfType(typeOptions[i]), true);
    })
    .on("mouseout", function(d, i) {
      setItemsInFocus(getItemsOfType(typeOptions[i]), false);
    })
    .on("click", function(d, i) {
      setItemsVisibility(getItemsOfType(typeOptions[i]));
    });
typelegend.selectAll('text')
    .data(typeOptions)
    .enter()
    .append("text")
    .attr("class", "clickable")
    .attr("x", function(d, i) {
      var ii = i % 2;
      return w - 52 + 80 * (1 + ii);
    })
    .attr("y", function(d, i) {
      return 9;
    })
    .attr("font-size", "11px")
    .attr("fill", "#737373")
    .text(function(d) { return d; })
    .on("mouseover", function(d, i) {
      setItemsInFocus(getItemsOfType(typeOptions[i]), true);
    })
    .on("mouseout", function(d, i) {
      setItemsInFocus(getItemsOfType(typeOptions[i]), false);
    })
    .on("click", function(d, i) {
      setItemsVisibility(getItemsOfType(typeOptions[i]));
    });
var getItemsOfName = function(name) {
  return _.filter(viewModel, function(it) {
    return it.name == name;
  });
};
individuallegend.selectAll('rect')
    .data(individualOptions)
    .enter()
    .append("rect")
    .attr("class", "namerect clickable")
    .attr("x", function(d, i) {
      return w - 65 + 80;
    })
    .attr("y", function(d, i) {
      return i * 20;
    })
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d, i){
      return "#101010";
    })
    .style("stroke-width", "1px")
    .style("stroke", function(d, i) {
      return "#000000";
    })
    .on("mouseover", function(d, i) {
      setItemsInFocus(getItemsOfName(individualOptions[i]), true);
    })
    .on("mouseout", function(d, i) {
      setItemsInFocus(getItemsOfName(individualOptions[i]), false);
    })
    .on("click", function(d, i) {
      setItemsVisibility(getItemsOfName(individualOptions[i]));
    });
individuallegend.selectAll('text')
    .data(individualOptions)
    .enter()
    .append("text")
    .attr("class", "clickable")
    .attr("x", function(d, i) {
      return w - 52 + 80;
    })
    .attr("y", function(d, i) {
      return i * 20 + 9;
    })
    .attr("font-size", "11px")
    .attr("fill", "#737373")
    .text(function(d) { return d; })
    .on("mouseover", function(d, i) {
      setItemsInFocus(getItemsOfName(individualOptions[i]), true);
    })
    .on("mouseout", function(d, i) {
      setItemsInFocus(getItemsOfName(individualOptions[i]), false);
    })
    .on("click", function(d, i) {
      setItemsVisibility(getItemsOfName(individualOptions[i]));
    });


alllegend.selectAll('rect')
    .data(allOptions)
    .enter()
    .append("rect")
    .attr("class", "allrect clickable")
    .attr("x", function(d, i) {
      var ii = i % 2;
      return w - 65 + 80 * (1 + ii);
    })
    .attr("y", function(d, i) {
      return 0;
    })
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d, i){
      return "#101010";
    })
    .style("stroke-width", "1px")
    .style("stroke", function(d, i) {
      return "#000000";
    })
    .on("mouseover", function(d, i) {
      setItemsInFocus(viewModel, true);
    })
    .on("mouseout", function(d, i) {
      setItemsInFocus(viewModel, false);
    })
    .on("click", function(d, i) {
      setItemsVisibility(viewModel);
    });
alllegend.selectAll('text')
    .data(allOptions)
    .enter()
    .append("text")
    .attr("class", "clickable")
    .attr("x", function(d, i) {
      var ii = i % 2;
      return w - 52 + 80 * (1 + ii);
    })
    .attr("y", function(d, i) {
      return 9;
    })
    .attr("font-size", "11px")
    .attr("fill", "#737373")
    .text(function(d) { return d; })
    .on("mouseover", function(d, i) {
      setItemsInFocus(viewModel, true);
    })
    .on("mouseout", function(d, i) {
      setItemsInFocus(viewModel, false);
    })
    .on("click", function(d, i) {
      setItemsVisibility(viewModel);
    });


refresh();