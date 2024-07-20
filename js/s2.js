import { teamColors } from './teamColors.js';
import { loadS3 } from './s3.js';

export function loadS2() {
    const container = d3.select("#container");
    container.html("");

    container.append("h1").text("Instagram Followers Per Team");

    d3.csv("data/teams.csv").then(data => {
        const mergedPlayers = d3.csv("data/merged_players.csv");

        data.forEach(d => {
            d.Followers = +d.Followers;
        });

        data.sort((a, b) => b.Followers - a.Followers);

        const margin = { top: 50, right: 20, bottom: 150, left: 150 };
        const width = 1400 - margin.left - margin.right;
        const height = 900 - margin.top - margin.bottom;

        const svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .range([0, width])
            .padding(0.1)
            .domain(data.map(d => d.Team));

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, d => d.Followers)]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");

        svg.append("g")
            .call(d3.axisLeft(y));

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.Team))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.Followers))
            .attr("height", d => height - y(d.Followers))
            .style("fill", d => teamColors[d.Team] || "#69b3a2")
            .on("mouseover", function(event, d) {
                d3.select(this).transition()
                    .duration(200)
                    .style("fill", d3.rgb(teamColors[d.Team]).darker(2));

                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                const player = mergedPlayers.find(p => p.Team === d.Team);
                tooltip.html(`Team: ${d.Team}<br/>Followers: ${d.Followers.toLocaleString()}<br/>Most Followed Player: ${player ? player.Player : 'N/A'}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                d3.select(this).transition()
                    .duration(200)
                    .style("fill", teamColors[d.Team] || "#69b3a2");

                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Team Instagram Followers");

        svg.append("text")
            .attr("x", -margin.left + 10)
            .attr("y", y(d3.max(data, d => d.Followers)) - 10)
            .attr("text-anchor", "start")
            .text(d3.max(data, d => d.Followers).toLocaleString());

        container.append("button")
            .text("Previous")
            .on("click", loadS1);

        container.append("button")
            .text("Next")
            .on("click", loadS3);
    }).catch(error => console.log("Error loading data for S2: ", error));
}
