function loadS3() {
    const container = d3.select("#container");
    container.html("");

    container.append("h1").text("Team Followers vs. Team Wins");

    d3.csv("data/merged_data.csv").then(data => {
        const teamData = d3.nest()
            .key(d => d.Team)
            .rollup(v => ({
                followers: d3.sum(v, d => d.Followers),
                wins: d3.mean(v, d => d.Wins)
            }))
            .entries(data);

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(teamData, d => d.value.followers)]);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(teamData, d => d.value.wins)]);

        svg.append("g")
            .selectAll("circle")
            .data(teamData)
          .enter().append("circle")
            .attr("cx", d => x(d.value.followers))
            .attr("cy", d => y(d.value.wins))
            .attr("r", 5)
            .attr("fill", "steelblue");

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        container.append("button")
            .text("Next")
            .on("click", loadS4);
    });
}
