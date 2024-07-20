import { teamColors } from './teamColors.js';
import { loadS3 } from './s3.js';
import { loadS1 } from './s1.js';

export function loadS2() {
    const container = d3.select("#container");
    container.html("");

    container.append("h1").text("Instagram Followers Per Team");

    d3.csv("data/teams.csv").then(teamsData => {
        teamsData.forEach(d => {
            d.Followers = +d.Followers;
        });

        teamsData.sort((a, b) => b.Followers - a.Followers);

        d3.csv("data/merged_players_bpm.csv").then(mergedPlayers => {
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
                .domain(teamsData.map(d => d.Team));

            const y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(teamsData, d => d.Followers)]);

            const xAxis = svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");

            const yAxis = svg.append("g")
                .call(d3.axisLeft(y));

            yAxis.append("text")
                .attr("class", "y-axis-label")
                .attr("transform", `translate(-10, -10)`)
                .style("text-anchor", "end")
                .text(d3.max(teamsData, d => d.Followers).toLocaleString());

            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            svg.selectAll(".bar")
                .data(teamsData)
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
                        .style("fill", d => teamColors[d.Team] ? d3.rgb(teamColors[d.Team]).darker(1) : "#69b3a2");

                    const player = mergedPlayers.find(p => p.Team === d.Team);
                    const mostFollowedPlayer = player ? player.player : "N/A";

                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(`Team: ${d.Team}<br/>Followers: ${d.Followers}<br/>Most Followed Player: ${mostFollowedPlayer}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    d3.select(this).transition()
                        .duration(200)
                        .style("fill", d => teamColors[d.Team] || "#69b3a2");

                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            container.append("button")
                .text("Previous")
                .on("click", loadS1);

            container.append("button")
                .text("Next")
                .on("click", loadS3);
        }).catch(error => console.log("Error loading merged players data for S2: ", error));
    }).catch(error => console.log("Error loading data for S2: ", error));
}