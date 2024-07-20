function loadS2() {
    const container = d3.select("#container");
    container.html(""); 

    container.append("h1").text("Team Account Followers");

    d3.csv("data/merged_data.csv").then(data => {
        const teamData = d3.nest()
            .key(d => d.Team)
            .rollup(v => d3.sum(v, d => d.Followers))
            .entries(data);

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .range([0, width])
            .padding(0.1)
            .domain(teamData.map(d => d.key));

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(teamData, d => d.value)]);

        svg.append("g")
            .selectAll(".bar")
            .data(teamData)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.key))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.value))
            .attr("height", d => height - y(d.value));

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
          .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .call(d3.axisLeft(y));

        container.append("button")
            .text("Next")
            .on("click", loadS3);
    });
}
