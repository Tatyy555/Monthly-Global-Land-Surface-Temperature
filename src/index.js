const fetchDataAndDraw = async () => {
  // Fetching data
  const res = await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  );
  let fetchedData = await res.json();
  // console.log(fetchedData)
  // console.log(fetchedData.monthlyVariance)

  // Arrange data
  let data = [];
  fetchedData.monthlyVariance.map((d) => {
    // console.log(d)
    let tmp = {};
    tmp["Year"] = parseInt(d["year"]);
    tmp["Month"] = parseInt(d["month"] - 1);
    tmp["Variance"] = parseFloat(d["variance"]).toFixed(1);
    tmp["Temperature"] = parseFloat(
      fetchedData.baseTemperature - d["variance"]
    ).toFixed(1);
    data.push(tmp);
  });
  console.log(data);

  // Set the size
  let height = 370;
  let width = 750;
  let padding = 60;
  let svg = d3.select("svg").attr("width", width).attr("height", height);

  let xAxisScale = d3
    .scaleLinear()
    .range([padding, width - padding])
    .domain([
      d3.min(data, (d) => {
        return d["Year"];
      }),
      d3.max(data, (d) => {
        return d["Year"] + 1;
      }),
    ]);
  svg
    .append("g")
    .call(d3.axisBottom(xAxisScale).tickFormat(d3.format("d")))
    .attr("id", "x-axis")
    .attr("transform", "translate(30," + (height - padding) + ")");

  let yAxisScale = d3
    .scaleTime()
    .range([padding, height - padding])
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)]);
  svg
    .append("g")
    .call(d3.axisLeft(yAxisScale).tickFormat(d3.timeFormat("%B")))
    .attr("id", "y-axis")
    .attr("transform", "translate(" + (30 + padding) + ",0)");

  // Build color scale
  let myColor = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => {
        return parseFloat(d["Variance"]);
      }),
      d3.max(data, (d) => {
        return d["Variance"];
      }),
    ])
    .range(["white", "red"]);

  // Make tooltip
  let tooltip = d3.select("#tooltip").style("opacity", 0);
  var mouseover = function (d) {
    tooltip.style("opacity", 1);
  };
  var mousemove = function (d) {
    tooltip
      .html(
        `${d["Year"]}-${new Date(0, d["Month"], 0, 0, 0, 0, 0).toLocaleString(
          "en-US",
          { month: "short" }
        )}<br>${d["Temperature"]}°C<br>${d["Variance"]}°C`
      )
      .attr("data-year", d["Year"])
      .style("left", d3.mouse(this)[0] - 250 + "px")
      .style("top", d3.mouse(this)[1] - 450 + "px");
  };
  var mouseleave = function (d) {
    tooltip.style("opacity", 0);
  };

  // Add the squares
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("fill", (d) => {
      return myColor(d["Variance"]);
    })
    .attr("data-month", (d) => {
      return d["Month"];
    })
    .attr("data-year", (d) => {
      return d["Year"];
    })
    .attr("data-temp", (d) => {
      return d["Temperature"];
    })
    .attr("height", (height - 2 * padding) / 12)
    .attr(
      "width",
      (width - 2 * padding) /
        (d3.max(data, (d) => d["Year"]) - d3.min(data, (d) => d["Year"]))
    )
    .attr("x", (d) => {
      return xAxisScale(d["Year"]);
    })
    .attr("y", (d) => {
      return yAxisScale(new Date(0, d["Month"], 0, 0, 0, 0, 0));
    })
    .attr("transform", "translate(" + 31 + ",0)")
    // Add Tooltip effect
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  // Set the size for legend
  let height2 = 60;
  let width2 = 750;
  let padding2 = 60;
  let svg2 = d3.select("#legend").attr("width", width2).attr("height", height2);

  let xAxisScale2 = d3
    .scaleLinear()
    .range([padding2 * 2, width2 - padding2])
    .domain([
      d3.min(data, (d) => {
        return parseFloat(d["Variance"]);
      }),
      1.6 +
        d3.max(data, (d) => {
          return parseFloat(d["Variance"]);
        }),
    ]);
  svg2
    .append("g")
    .call(d3.axisBottom(xAxisScale2))
    .attr("id", "x-axis2")
    .attr("transform", "translate(0," + (height2 - 30) + ")");

  // let yAxisScale2 = d3
  //   .scaleLinear()
  //   .range([0, padding2])
  //   .domain(1);
  svg2
    .append("g")
    // .call(d3.axisLeft(yAxisScale2))
    .attr("id", "y-axis2")
    .attr("transform", "translate(" + padding2 + ",0)");

  // Add the squares
  svg2
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("fill", (d) => {
      return myColor(d["Variance"]);
    })
    .attr("height", height2 / 2)
    .attr("width", width2 / 10)
    .attr("x", (d) => {
      return xAxisScale2(d["Variance"]);
    })
    .attr("y", (d) => {
      return 0;
    });
};

fetchDataAndDraw();
