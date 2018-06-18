$( document ).ready(function() {
	generate();
});

var nodesurl = "http://164.132.225.138/~heplusv/HEv3CLIExtractors/files/20170326-tags-nodes-40_41_42_43_44_45_46_47_48.csv";
var relationsurl = "http://164.132.225.138/~heplusv/HEv3CLIExtractors/files/20170326-tags-links-40_41_42_43_44_45_46_47_48.csv";

var margin,width,height,color;
var treemap;
var div;

function generate(){
	margin = {top: 0, right: 0, bottom: 0, left: 0};
    width = $("#viz").width() - margin.left - margin.right;
    height = $("#viz").height() - margin.top - margin.bottom;
	color = d3.scaleOrdinal().range(d3.schemeCategory20c);

	treemap = d3.treemap().size([width, height]);

	div = d3.select("#viz").append("div")
	    .style("position", "relative")
	    .style("width", (width + margin.left + margin.right) + "px")
	    .style("height", (height + margin.top + margin.bottom) + "px")
	    .style("left", margin.left + "px")
	    .style("top", margin.top + "px");

	d3.csv("proxy.php?url=" + nodesurl,
		function(d){
			return {
				name: d.label,
				number: +d.weight,
				comfort: +d.comfort,
				energy: +d.energy,
				id: d.id
			};
		}, 
		function(error, data) {
  		if (error) throw error;
  		//console.log(data);

  		var data2 = { children: data  };

  		var nodes = d3.hierarchy(data2)
			.sum(function(d) { return d.number; });

		var tree = treemap(nodes);



		var node = div.datum(nodes).selectAll(".node")
			.data(tree.leaves())
			.enter().append("div")
				.attr("class", "node")
				.style("left", (d) => d.x0 + "px")
				.style("top", (d) => d.y0 + "px")
				.style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
				.style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
				.style("background", function(d){
											var c = "#0000FF";
											if(d.data.comfort<-20){
												c = "#FF0000";
											} else if(d.data.comfort>20){
												c = "#00FF00";
											} 
											return c;
									})
				.text((d) => d.data.name)
				.style("color", function(d){
											var c = "#FFFFFF";
											if(d.data.comfort<-20){
												c = "#FFFFFF";
											} else if(d.data.comfort>20){
												c = "#000000";
											} 
											return c;
									})
				.style("font-size", function(d){
											return (Math.min(d.data.number,25)) + "px";
									})
				.style("line-height", function(d){
											return (Math.min(d.data.number,25)) + "px";
									});

		// $( "input" ).change(function () {
		// 	var radio_value = $("input[name='mode']:checked").val();
		// 	var value = (radio_value === "weight")
		// 		? function(d) { return d.size; } 
		// 		: function(d) { return d.data[radio_value]; }; 
						
		// 	node.data(treemap.value(value).nodes)
		// 		.transition()
		// 		.duration(1500)
		// 		.call(position);
		// }).change();

		// $( "input" ).change(function () {
		// 	var radio_value = $("input[name='mode']:checked").val();
		// 	var funct,funct2;
		// 	var value;
		// 	if(radio_value=="weight"){
		// 		funct = function(a,b){
		// 			return a.number - b.number; 
		// 		};
		// 		funct2 = function(a){
		// 			return a.number; 
		// 		};
		// 		value = function(d){
		// 			return d.number;
		// 		};
		// 	} else if(radio_value=="comfort"){
		// 		funct = function(a,b){
		// 			return a.comfort - b.comfort; 
		// 		};
		// 		funct2 = function(a){
		// 			return a.comfort; 
		// 		};
		// 		value = function(d){
		// 			return d.comfort;
		// 		};
		// 	} else if(radio_value=="energy"){
		// 		funct = function(a,b){
		// 			return a.energy - b.energy; 
		// 		};
		// 		funct2 = function(a){
		// 			return a.energy; 
		// 		};
		// 		value = function(d){
		// 			return d.energy;
		// 		};
		// 	}

		// 	// nodes
		// 	// 	.sort(funct)
		// 	// 	.sum(funct2);

		// 	// console.log(tree);

		// 	node.data(tree.value(value).nodes)
		// 		.transition()
		// 		.duration(1500)
		// 		.call(position);

		// }).change();

  	});

}


function position() {

  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; })
	  .style("background",function(d) { return color2((d.dx * d.dy)/d.real_size);});
}