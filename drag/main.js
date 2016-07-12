// Nb. at the moment, I don't like the non-uniform scaling of this chart
       var dataset = [];

           for (var i = 0 ; i < 2; i++) {
                dataset.push([Math.random()*1200,Math.random()*1100]);
           }

       var h = 400;
       var w = 600; 
       var pad = 30;
       var setLines;
       
       // Scales

       var x_scale = d3.scaleLinear().domain([0,d3.max(dataset,d => d[0])])
                                     .range([pad,w-2*pad]);

       var y_scale = d3.scaleLinear().domain([0,d3.max(dataset,d => d[1])])
                                     .range([h-pad,pad]); 
/*
       var r_scale = d3.scale.linear().domain([0,d3.max(dataset,d => d[1])])
                                      .range([2,5]);
*/

       // Chart and data
       var bg = d3.rgb(196,228,255);
       var svg = d3.select("body").append("svg")
                                  .attr("id", "chart")
                                  .attr("width",w)
                                  .attr("height",h)
                                  .style("background-color",bg);

           svg.append("line").attr("id","touchY");
           svg.append("line").attr("id","touchX");
             
        svg.selectAll("line").style("stroke","black").attr("class","axis_readoff");

        setLines = (px,py) => {
               svg.select("#touchY").attr("x1",pad)
                                    .attr("y1",py)
                                    .attr("x2",px)
                                    .attr("y2",py);

               svg.select("#touchX").attr("x1",px)
                                    .attr("y1",py)
                                    .attr("x2",px)
                                    .attr("y2",h-pad);
                              }      

          var drag = d3.drag()
                .on("drag", function(d,i) {
                    var unitX = x_scale(1) - x_scale(0);
                    var unitY = y_scale(1) - y_scale(0);
                    
                    d[0] += d3.event.dx / unitX;
                    d[1] += d3.event.dy / unitY;
                    
                    var px = x_scale(d[0]);
                    var py = y_scale(d[1]);

                        d3.select(this)
                          .attr("cx",px)
                          .attr("cy",py);
                        
                        setLines(px,py);
                }); 
          
          var circles = svg.selectAll("circle").data(dataset)
                                  .enter()
                                  .append("circle")
                                  .attr("cx",d => x_scale(d[0]))
                                  .attr("cy",d => y_scale(d[1]))
                                  //.attr("r",d => r_scale(d[1]))
                                  .attr("r",6)
                                  .call(drag);
             /* 
              circles.on('click', function(data,index){
                                        console.log(data);
                                  });
             */

               svg.selectAll("text").data(dataset)
                                .enter()
                                .append("text")
                                .text(d => Math.round(d[0])+","+Math.round(d[1]))
                                .attr("x",d => x_scale(d[0]))
                                .attr("y",d => y_scale(d[1]))
                                .attr("font-family", "sans-serif")
                                .attr("font-size", "11px")
                                .attr("fill", "steelblue");

        // Axes
        
        // see also the tickFormat(), which is mentioned in the tutorial
        
        // this is version 4 syntax

        var xAxis = d3.axisBottom(x_scale).ticks(5);
        var yAxis = d3.axisLeft(y_scale).ticks(5);

            svg.append("g")
               .attr("class","axis")    // to help with styling 
               .attr("transform","translate(0,"+(h - pad)+")") // trans to bottom
               .call(xAxis);            // passes 'g' as param to xAxis

            svg.append("g")
               .attr("class","axis")    // to help with styling 
               .attr("transform","translate("+pad+",0)") // shift to right 
               .call(yAxis);
