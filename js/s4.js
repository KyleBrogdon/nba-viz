import { teamColors } from './teamColors.js';
import { loadS3 } from './s3.js';
import { loadS1 } from './s1.js';

export function loadS4() {
    const container = d3.select("#container");
    container.html(""); 

    container.append("h1").text("NBA Player BPM vs Instagram Followers");

    d3.csv("data/merged_players_bpm.csv").then(data => {
        data.forEach(d => {
            d.BPM = +d.BPM; 
            d.Followers = +d.Followers; 
            console.log(`player: ${d.player}, BPM: ${d.BPM}, Followers: ${d.Followers}`);
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
            .domain([d3.min(data, d => d.BPM), d3.max(data, d => d.BPM)]);

        const xAxis = svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format(".2s")));

        xAxis.selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        xAxis.append("text")
            .attr("class", "x-axis-label")
            .attr("transform", `translate(${width}, 40)`)
            .style("text-anchor", "end")
            .text(d3.max(data, d => d.Followers).toLocaleString());

        const yAxis = svg.append("g")
            .call(d3.axisLeft(y).ticks(10).tickFormat(d3.format("d")));

        yAxis.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", `translate(-10, -10)`)
            .style("text-anchor", "end")
            .text(d3.max(data, d => d.BPM).toLocaleString());

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("background-color", "gray")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("position", "absolute");

        svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", d => x(d.Followers))
            .attr("cy", d => y(d.BPM))
            .attr("r", 10)
            .style("fill", d => teamColors[d.Team] || "#69b3a2")
            .on("mouseover", function(event, d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 15);

                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Player: ${d.player}<br/>BPM: ${d.BPM}<br/>Followers: ${d.Followers.toLocaleString()}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 10);

                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append("text")
            .attr("transform", `translate(${width / 2},${height + margin.bottom - 40})`)
            .style("text-anchor", "middle")
            .text("Instagram Followers");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Player BPM");

        container.append("button")
            .text("Previous")
            .on("click", loadS3);
    }).catch(error => console.log("Error loading data for S4: ", error));
}