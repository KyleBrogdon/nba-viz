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
            const margin = { top: 30, right: 20, bottom: 220, left: 150 };
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

                svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Team Instagram Followers");

            svg.append("text")
                .attr("transform", `translate(${width / 2},${height + margin.bottom - 100})`)
                .style("text-anchor", "middle")
                .text("Teams");

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
                .style("fill", d => {
                    const color = teamColors[d.Team].color || "#69b3a2";
                    console.log(`Team: ${d.Team}, Color: ${color}`); // Debugging: Check color assignment
                    return color;
                })
                .on("mouseover", function(event, d) {
                    d3.select(this).transition()
                        .duration(200)
                        .style("fill", d => {
                            const color = teamColors[d.Team].color ? d3.rgb(teamColors[d.Team]).darker(1) : "#69b3a2";
                            return color;
                        });
                        

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
                    .style("fill", d => {
                        const color = teamColors[d.Team].color || "#69b3a2";
                        return color;
                    });

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

            container.append("div")
                .attr("class", "footnote")
                .append("p")
                .text("The Warriors, Lakers, and Cavaliers are the only teams > 15 million followers, with most other teams in a relatively normal distribution from 10 million and below. On the next slide you'll see if current team success is directly corrolated with popularity.");
        }).catch(error => console.log("Error loading merged players data for S2: ", error));
    }).catch(error => console.log("Error loading data for S2: ", error));
}