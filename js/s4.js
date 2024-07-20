function loadS4() {
    const container = d3.select("#container");
    container.html("");

    container.append("h1").text("Player BPM vs. Instagram Followers");

    d3.csv("data/merged_data.csv").then(data => {
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
            .domain([0, d3.max(data, d => +d.Followers)]);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([d3.min(data, d => +d.BPM), d3.max(data, d => +d.BPM)]);

        svg.append("g")
            .selectAll("circle")
            .data(data)
          .enter().append("circle")
            .attr("cx", d => x(d.Followers))
            .attr("cy", d => y(d.BPM))
            .attr("r", 5)
            .attr("fill", d => teamColor(d.Team))
            .on("mouseover", function(event, d) {
                const [x, y] = d3.pointer(event);
                d3.select("#tooltip")
                    .style("left", `${x + 10}px`)
                    .style("top", `${y + 10}px`)
                    .select("#value")
                    .text(`${d.Player}, ${d.Team}, BPM: ${d.BPM}, Followers: ${d.Followers}`);
                d3.select("#tooltip").classed("hidden", false);
            })
            .on("mouseout", function() {
                d3.select("#tooltip").classed("hidden", true);
            });

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        
        container.append("div")
            .attr("id", "tooltip")
            .attr("class", "hidden")
            .append("p")
            .attr("id", "value");
    });
}

function teamColor(team) {
    const colors = {
        "Lakers": "purple",
        "Warriors": "blue",
        
    };
    return colors[team] || "gray";
}
