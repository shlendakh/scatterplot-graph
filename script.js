// Load data and create the scatterplot
document.addEventListener('DOMContentLoaded', function() {
    const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
    
    d3.json(url).then(data => {
      const margin = { top: 60, right: 20, bottom: 60, left: 60 };
      const width = 800 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;
      
      const x = d3.scaleTime()
        .domain([d3.min(data, d => new Date(d.Year - 1, 0, 1)), d3.max(data, d => new Date(d.Year + 1, 0, 1))])
        .range([0, width]);
  
      const y = d3.scaleTime()
        .domain([d3.min(data, d => new Date(1970, 0, 1, 0, 0, d.Seconds - 10)), d3.max(data, d => new Date(1970, 0, 1, 0, 0, d.Seconds + 10))])
        .range([height, 0]);
  
      const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y"));
      const yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S"));
  
      const svg = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
      svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
  
      svg.append("g")
        .attr("id", "y-axis")
        .call(yAxis);
  
      svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(new Date(d.Year, 0, 1)))
        .attr("cy", d => y(new Date(1970, 0, 1, 0, 0, d.Seconds)))
        .attr("r", 5)
        .attr("fill", d => d.Doping ? "red" : "green")
        .attr("data-xvalue", d => new Date(d.Year, 0, 1))
        .attr("data-yvalue", d => new Date(1970, 0, 1, 0, 0, d.Seconds))
        .on("mouseover", function(event, d) {
          const tooltip = d3.select("#tooltip");
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}<br>${d.Doping ? d.Doping : 'No doping allegations'}`)
            .attr("data-year", d.Year)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
          d3.select("#tooltip").transition().duration(500).style("opacity", 0);
        });
    });
  });
  