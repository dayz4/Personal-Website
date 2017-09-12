// Sunburst design by John Stasko
// Uses D3's Partition Layout

// svg dimensions
var radius = Math.min(screen.width/2 - 300, screen.height/2 - 150);
	width = radius*2,
	height = radius*2;

var doubleclick = false,
	tripleclick = false;

var timer = null,
	timer2 = null;

var prev = null;

var stickyCrosswalk = false;

var s1Root = s1Data["http://asn.jesandco.org/resources/D10003FB"];
var t1Root = t1Data["http://asn.jesandco.org/resources/D10003B9"];
var s2Root = s2Data["http://asn.jesandco.org/resources/D10003FC"];
var t2Root = t2Data["http://asn.jesandco.org/resources/D100029D"];
var t3Root = t3Data["http://asn.jesandco.org/resources/D1000124"];
var t4Root = t4Data["http://asn.jesandco.org/resources/D1000379"];

// create the svg containers
var s1Svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("class", "s1svg")
	.append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var t1Svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("class", "t1svg")
	.append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var t2Svg = d3.select("body").append("svg")
	.attr("width", 0)
	.attr("height", 0)
	.style("clear", "both")
	.style("margin", "auto")
	.attr("class", "t2svg")
	.append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var s2Svg = d3.select("body").append("svg")
	.attr("width", 0)
	.attr("height", 0)
	.style("clear", "both")
	.attr("class", "s2svg")
	.append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var t3Svg = d3.select("body").append("svg")
	.attr("width", 0)
	.attr("height", 0)
	.attr("class", "t3svg")
	.append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var t4Svg = d3.select("body").append("svg")
	.attr("width", 0)
	.attr("height", 0)
	// .style("clear", "right")
	.attr("class", "t4svg")
	.append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var partition = d3.layout.partition()
	.size([2 * Math.PI, radius * radius - 10])
	.children(children_accessor)
	.value(function(node) {
		if (node._children) return 3;
		else return 1;
	})
	.sort(sort);

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

var tooltip = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0)
	.style("background", "silver");

var crosswalks = d3.select("body").append("div")
	.attr("class", "crosswalks")
	.style("left", screen.width - 390 + "px")
	.style("top", 10 + "px")
	.style("opacity", 0)
	.style("background", "silver")
	.style("width", "350px")
	.style("margin", "5px")
	.style("font-size", "14px");

var visibleGraphs = ["s1", "t1"];
var visibleRoots = [s1Root, t1Root];
var visibleURIs = ["s1URI", "t1URI"];
var visibleSvgs = [s1Svg, t1Svg];
var visibleData = [s1Data, t1Data];
var visibleCrosses = ["s1crosswalked", "t1crosswalked"];

var graphs = ["s1", "s2", "t1", "t2", "t3", "t4"];

for (graph in graphs) {
	var id = "#" + graphs[graph];
	d3.select(id).on("click", function() {
		var name = this.id;
		if (this.checked) {
			set_visibility(name, "add");
			d3.select("." + name + "svg").attr("width", width).attr("height", height);
		} else {
			set_visibility(name, "remove");
			d3.select("." + name + "svg").attr("width", 0).attr("height", 0);
			d3.select("." + name + "svg").selectAll("path").remove();
		}

		for (graph2 in visibleGraphs) {
			update(visibleRoots[graph2]);
		}
	});
}

for (graph in visibleGraphs) {
	update(visibleRoots[graph]);
}

function update(source){
	var graph = source.graph;
	var nodes = partition.nodes(source);
	var svg = "." + graph + "svg";
	var path = d3.select(svg).select("g").selectAll(".node")
      	.data(nodes);

	path.enter()
		.append("path")
		.attr("class", "node")
		.attr("id", function(d) {
			var id = d.id;
			return graph + "-" + String(id);
		})
      	.style("stroke", "#fff")
		.style("stroke-width", 0.8)
      	.style("fill", color)
		.on("mouseover", hover_on)
		.on("mouseout", hover_off)
		.on("mousemove", tt_pos)
		.on("click", click);

	path.attr("d", arc)
      	.style("fill", color);

	path.exit()
		.remove();
}

function children_accessor(node){
	if (node._children || node.children){
		return node.children;
	}
	var childrenArray = [];
	for (attribute in node){
		if (attribute == "http://purl.org/gem/qualifiers/hasChild"){
			for (child in node[attribute]){
				childrenArray.push(find_node(node[attribute][child].value));
			}
			break;
		}
	}
	return childrenArray;
}

function crosswalked_children(node, crosswalkedName) {
	var crosswalkArray = [];
	for (child in node._children) {
		var children = partition.nodes(node._children[child]);
		for (child2 in children) {
			for (graph in visibleCrosses) {
				if (children[child2][crosswalkedName]) {
					crosswalkArray.push([children[child2]]);
				}

				var descendants = partition.nodes(children[child2]);
				for (member in descendants) {
					if (descendants[member][crosswalkedName]) {
						crosswalkArray.push(descendants[member]);
					}
				}
			}
		}
	}
	return crosswalkArray;
}

function find_node(name){
	for (graph in visibleGraphs) {
		var data = visibleData[graph];
		for (element in data){
			if (element == name){
				return data[element];
			}
		}
	}
}

function color(node){
	if (!node.depth) {
		return "lightskyblue";
	}

	for (graph in visibleCrosses) {
		if (node[visibleCrosses[graph]]) {
			if (!node.sticky) {
				return (node._children) ? "orange": "gold";
			}
		} else if (crosswalked_children(node, visibleCrosses[graph]).length != 0) {
			return "darkkhaki";
		}
	}

	return (node._children) ? "rebeccapurple" : "purple";
}

function partner_color_on(node) {
	var partnerID;
	var partner;

	for (uri in visibleURIs) {
		if (node[visibleURIs[uri]]) {
			for (element in node[visibleURIs[uri]]) {
				partner = find_node(node[visibleURIs[uri]][element]);
				partnerID = "#" + visibleGraphs[uri] + "-" + String(partner.id);
				d3.select(partnerID).style("fill", "red");
			}
		}
	}
}

function partner_color_off(node) {
	var partnerID;
	var partner;

	for (uri in visibleURIs) {
		if (node[visibleURIs[uri]]) {
			for (element in node[visibleURIs[uri]]) {
				partner = find_node(node[visibleURIs[uri]][element]);
				if (!partner.sticky) {
					partnerID = "#" + visibleGraphs[uri] + "-" + String(partner.id);
					d3.select(partnerID).style("fill", "gold");
				}
			}
		}
	}
}

function hover_on(node) {
	if (!node.depth) {
		d3.select(this).style("fill", "slateblue");
	} else {
		d3.select(this).style("fill", "red");
		partner_color_on(node);
	}
	tooltip.style("opacity", 0.9)
		.style("width", null)
		.html(function() {
			if (!node.depth) {
				for (property in node) {
					if (property == "http://purl.org/dc/elements/1.1/title") {
						return node[property][0].value;
					}
				}
			}

			for (property in node) {
				if (property == "http://purl.org/ASN/schema/core/statementNotation") {
					var notation = node[property][0].value;
				}
				else if (property = "http://purl.org/dc/terms/description") {
					var description = node[property][0].value;
				}
			}
			if(notation) {
				return notation + "<br>" + description;
			} else{
				return description;
			}
		});

	var pixels = parseFloat(tooltip.style("width").substring(0, tooltip.style("width").length - 2));
	if (pixels > 250) {
		tooltip.style("width", "250px");
	}
	tt_pos();

	if (!stickyCrosswalk) {
		var info = "";
		crosswalks.html(function() {
			for (uri in visibleURIs) {
				if (node[visibleURIs[uri]]) {
					for (cross in node[visibleURIs[uri]]) {
						var partner = find_node(node[visibleURIs[uri]][cross]);
						for (property in partner) {
							if (property == "http://purl.org/ASN/schema/core/statementNotation") {
								var partnerNotation = partner[property][0].value;
							}
							else if (property = "http://purl.org/dc/terms/description") {
								var partnerDescription = partner[property][0].value;
							}
						}
						if (partnerNotation) {
							info = info + partnerNotation + "<br>" + partnerDescription + "<br><br>";
						} else if (partnerDescription) {
							info = info + partnerDescription + "<br><br>";
						}
					}
					return info;
				}
			}
		});
		if (info != "") {
			d3.select(".crosswalks").transition().style("opacity", 0.9);
		}
	}
}

function hover_off(node) {
	if (!node.sticky) {
		d3.select(this).style("fill", color(node));
	}
	partner_color_off(node);
	tooltip.style("opacity", 0);
	if (!stickyCrosswalk) {
		d3.select(".crosswalks").transition().style("opacity", 0);
	}
}

function tt_pos() {
	if (d3.event.pageX + 650 > document.body.offsetWidth) {		// extra 15px padding for scroll bar
		var w = parseFloat(tooltip.style("width").substring(0, tooltip.style("width").length - 2));
		tooltip.style("left", String(d3.event.pageX - w - 10) + "px");
		console.log(d3.event.pageX - tooltip.style("width"));
	} else {
		tooltip.style("left", String(d3.event.pageX + 15) + "px");
	}

	if (parseFloat(d3.event.pageY) + parseFloat(tooltip.style("height")) + 15 > document.body.offsetHeight) {
		tooltip.style("top", String(parseFloat(d3.event.pageY) - parseFloat(tooltip.style("height"))) + "px");
	} else {
		tooltip.style("top", String(d3.event.pageY + 10) + "px");
	}
}

function click(node){
	if (tripleclick) {
		clearTimeout(timer2);
		stick(node);
		tripleclick = false;
	}
	else if (doubleclick) {
		clearTimeout(timer);
		tripleclick = true;
		timer2 = setTimeout(function() {
			tripleclick = false;
			zoom(node);
		}, 200);
		doubleclick = false;
	}
	else {
		doubleclick = true;
		timer = setTimeout(function() {
			doubleclick = false;
			if (prev) {
				collapse(node, prev);
			} else {
				var root = visibleRoots[visibleGraphs.indexOf(node.graph)];
				collapse(node, root);
			}
		}, 200);
	}
}

function collapse(node, root) {
	if (node.children) {
		node._children = node.children;
		node.children = null;

	} else {
		node.children = node._children;
		node._children = null;
	}

	update(root);
}

// When zooming in, prev tracks the previous center node in order to set the
// appropriate node.prev for the new center node, and then it's set to the current
// center node for use in the next zoom.
// When zooming out, node.prev stores the node to zoom out to. prev is then set
// to node.prev since it is the new center node after the zoom out.
function zoom(node){
	if (node.zoomed) {
		update(node.prev);		// zoom out to the previous node;
		prev = node.prev;		// set prev to the node that you zoomed out to
		node.zoomed = false;
	} else {
		update(node);			// zoom to the clicked node
		node.zoomed = true;

		if (prev) {
			node.prev = prev;
		}
		else {
			var index = visibleGraphs.indexOf(node.graph);
			node.prev = visibleRoots[index];
		}
		prev = node;			// set prev to the node that you zoomed to
	}
}

function stick(node) {
	var partnerID;
	var partner;

	for (graph in visibleGraphs) {
		if (node[visibleCrosses[graph]]) {
			if (node.sticky) {
				node.sticky = false;
				for (uri in visibleURIs) {
					if (node[visibleURIs[uri]]) {
						for (element in node[visibleURIs[uri]]) {
							partner = find_node(node[visibleURIs[uri]][element]);
							partner.sticky = false;
						}
					}
				}
			} else if (!stickyCrosswalk) {
				node.sticky = true;
				for (uri in visibleURIs) {
					if (node[visibleURIs[uri]]) {
						for (element in node[visibleURIs[uri]]) {
							partner = find_node(node[visibleURIs[uri]][element]);
							partner.sticky = true;
						}
					}
				}
			}
			stickyCrosswalk = !stickyCrosswalk;
		}
	}
}

function sort(a, b) {
	for (property in a) {
		if (property == "http://purl.org/ASN/schema/core/statementNotation") {
			var first = a[property][0].value;
		}
	}

	for (property in b) {
		if (property == "http://purl.org/ASN/schema/core/statementNotation") {
			var second = b[property][0].value;
		}
	}

	if (first && second) {
		return (first > second) ? second : first;
	} else {
		return 0;
	}
}

function set_visibility(graph, action) {
	if (action == "add") {
		visibleGraphs.push(graph);
		visibleURIs.push(graph + "URI");
		visibleCrosses.push(graph + "crosswalked");
		if (graph == "s1") {
			visibleRoots.push(s1Root);
			visibleSvgs.push(s1Svg);
			visibleData.push(s1Data);
		} else if (graph == "t1") {
			visibleRoots.push(t1Root);
			visibleSvgs.push(t1Svg);
			visibleData.push(t1Data);
		} else if (graph == "s2") {
			visibleRoots.push(s2Root);
			visibleSvgs.push(s2Svg);
			visibleData.push(s2Data);
		} else if (graph == "t2") {
			visibleRoots.push(t2Root);
			visibleSvgs.push(t2Svg);
			visibleData.push(t2Data);
		} else if (graph == "t3") {
			visibleRoots.push(t3Root);
			visibleSvgs.push(t3Svg);
			visibleData.push(t3Data);
		} else {								// graph == "t4"
			visibleRoots.push(t4Root);
			visibleSvgs.push(t4Svg);
			visibleData.push(t4Data);
		}
	}
	else {
		var index = visibleGraphs.indexOf(graph);
		visibleGraphs.splice(index, 1);
		visibleRoots.splice(index, 1);
		visibleSvgs.splice(index, 1);
		visibleURIs.splice(index, 1);
		visibleData.splice(index, 1);
		visibleCrosses.splice(index, 1);
	}
}
