function loadS3() {
    const container = d3.select("#container");
    container.html("");

    container.append("h1").text("NBA Team Wins vs Instagram Followers");

    d3.csv("data/teams.csv").then(data => {
        const margin = { top: 20, right: 20, bottom: 50, left: 60 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(data, d => +d.wins)]);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, d => +d.followers)]);

        const color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(data.map(d => d.team));

        svg.append("g")
            .selectAll("circle")
            .data(data)
          .enter().append("circle")
            .attr("cx", d => x(d.wins))
            .attr("cy", d => y(d.followers))
            .attr("r", 5)
            .attr("fill", d => color(d.team));

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")));

        svg.append("g")
            .call(d3.axisLeft(y));

        container.append("button")
            .text("Previous")
            .on("click", loadS2);

        container.append("button")
            .text("Next")
            .on("click", loadS4);
    });
}