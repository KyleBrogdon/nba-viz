import { teamColors } from './teamColors.js';
import { loadS4 } from './s4.js';
import { loadS2 } from './s2.js';

export function loadS3() {
    const container = d3.select("#container");
    container.html("");

    container.append("h1").text("Team Wins vs Team Instagram Followers");

    d3.csv("data/teams.csv").then(data => {
        data.forEach(d => {
            d.Wins = +d.Wins;
            d.Followers = +d.Followers;
            console.log(`Team: ${d.Team}, Wins: ${d.Wins}, Followers: ${d.Followers}`);
        });

        const margin = { top: 50, right: 20, bottom: 150, left: 150 };
        const width = 1400 - margin.left - margin.right;
        const height = 900 - margin.top - margin.bottom;

        const svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(data, d => d.Followers)]);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, d => d.Wins)]);

        const xAxis = svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format(".0s")));

        const yAxis = svg.append("g")
            .call(d3.axisLeft(y));

        yAxis.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", `translate(-10, -10)`)
            .style("text-anchor", "end")
            .text(d3.max(data, d => d.Wins).toLocaleString());

        xAxis.append("text")
            .attr("class", "x-axis-label")
            .attr("transform", `translate(${width}, 40)`)
            .style("text-anchor", "end")
            .text(d3.max(data, d => d.Followers).toLocaleString());

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", d => x(d.Followers))
            .attr("cy", d => y(d.Wins))
            .attr("r", 14)
            .style("fill", d => teamColors[d.Team] || "#69b3a2")
            .on("mouseover", function(event, d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 20);

                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Team: ${d.Team}<br/>Wins: ${d.Wins}<br/>Followers: ${d.Followers}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 14);

                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append("text")
            .attr("transform", `translate(${width / 2},${height + margin.bottom - 40})`)
            .style("text-anchor", "middle")
            .text("Team Instagram Followers");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Team Wins");

        container.append("button")
            .text("Previous")
            .on("click", loadS2);

        container.append("button")
            .text("Next")
            .on("click", loadS4);
    }).catch(error => console.log("Error loading data for S3: ", error));
}
