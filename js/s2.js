function loadS2() {
    console.log("loadS2 called");

    const container = d3.select("#container");
    container.html("");

    container.append("h1").text("NBA Team Instagram Followers");

    d3.csv("data/teams.csv").then(data => {
        data.forEach(d => {
            d.Followers = +d.Followers;
            if (isNaN(d.Followers)) {
                console.error(`Invalid follower count for ${d.Team}: ${d.Followers}`);
            } else {
                console.log(`Team: ${d.Team}, Followers: ${d.Followers}`);
            }
        });


        data.sort((a, b) => d3.descending(a.Followers, b.Followers));

        const margin = { top: 20, right: 20, bottom: 150, left: 120 }; 
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .range([0, width])
            .padding(0.2)
            .domain(data.map(d => d.Team));

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, d => d.Followers)]);

        svg.append("g")
            .selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.Team))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.Followers))
            .attr("height", d => height - y(d.Followers))
            .attr("fill", "#69b3a2");

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
          .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("transform", `translate(${width / 2},${height + margin.bottom - 40})`)
            .style("text-anchor", "middle")
            .text("Team");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40) 
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Instagram Followers");

        container.append("button")
            .text("Previous")
            .on("click", loadS1);

        container.append("button")
            .text("Next")
            .on("click", loadS3);
    }).catch(error => console.log("Error loading data for S2: ", error));
}