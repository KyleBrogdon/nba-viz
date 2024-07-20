import { teamColors } from './teamColors.js';
import { loadS1 } from './s1.js';
import { loadS3 } from './s3.js';

export function loadS2() {
    console.log("loadS2 called");

    const container = d3.select("#container");
    container.html("");

    container.append("h1").text("NBA Team Instagram Followers");

    Promise.all([
        d3.csv("data/teams.csv"),
        d3.csv("data/merged_players_bpm.csv")
    ]).then(([teamsData, playersData]) => {
        const mostFollowedPlayers = {};

        playersData.forEach(d => {
            if (!mostFollowedPlayers[d.Team] || mostFollowedPlayers[d.Team].Followers < +d.Followers) {
                mostFollowedPlayers[d.Team] = {
                    player: d.player,
                    followers: +d.Followers
                };
            }
        });

        teamsData.forEach(d => {
            d.Followers = +d.Followers;
            d.MostFollowedPlayer = mostFollowedPlayers[d.Team]?.player || "N/A";
            d.MostFollowedPlayerFollowers = mostFollowedPlayers[d.Team]?.followers || 0;
            console.log(`Team: ${d.Team}, Followers: ${d.Followers}, Most Followed Player: ${d.MostFollowedPlayer}`);
        });

        teamsData.sort((a, b) => b.Followers - a.Followers);

        const margin = { top: 20, right: 20, bottom: 160, left: 100 };
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

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        const yAxis = svg.append("g")
            .call(d3.axisLeft(y));

        yAxis.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", `translate(-40, ${y(y.domain()[1])})`)
            .attr("dy", "-0.5em")
            .style("text-anchor", "end")
            .text(d3.max(teamsData, d => d.Followers).toLocaleString());

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("background-color", "gray")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("position", "absolute");

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
                    .style("fill-opacity", 0.7);

                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Team: ${d.Team}<br/>Followers: ${d.Followers.toLocaleString()}<br/>Most Followed Player: ${d.MostFollowedPlayer}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                d3.select(this).transition()
                    .duration(200)
                    .style("fill-opacity", 1);

                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

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