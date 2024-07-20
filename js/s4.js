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
            console.log(`Player: ${d.Player}, BPM: ${d.BPM}, Followers: ${d.Followers}`);
        });
        // const filteredData = data.filter(d => !isNaN(d.BPM) && !isNaN(d.Followers));

        const margin = { top: 20, right: 20, bottom: 150, left: 150 };
        const width = 1400 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .range([0, width])
            .domain([d3.min(filteredData, d => d.BPM), d3.max(filteredData, d => d.BPM)]);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(filteredData, d => d.Followers)]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll("circle")
            .data(filteredData)
            .enter().append("circle")
            .attr("cx", d => {
                const cx = x(d.BPM);
                console.log(`Player: ${d.Player}, BPM: ${d.BPM}, CX: ${cx}`); // Debugging: Check x positioning
                return cx;
            })
            .attr("cy", d => {
                const cy = y(d.Followers);
                console.log(`Player: ${d.Player}, Followers: ${d.Followers}, CY: ${cy}`); 
                return cy;
            })
            .attr("r", 5)
            .style("fill", d => {
                const color = teamColors[d.Team] || "#69b3a2";
                console.log(`Player: ${d.Player}, Team: ${d.Team}, Color: ${color}`); 
                return color;
            })
            .on("mouseover", function(event, d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 10);

                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Player: ${d.Player}<br/>Team: ${d.Team}<br/>BPM: ${d.BPM}<br/>Followers: ${d.Followers}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 5); 

                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append("text")
            .attr("transform", `translate(${width / 2},${height + margin.bottom - 40})`)
            .style("text-anchor", "middle")
            .text("Player BPM");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 60)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Instagram Followers");

        container.append("button")
            .text("Previous")
            .on("click", loadS3);

        container.append("button")
            .text("Next")
            .on("click", loadS1);
    }).catch(error => console.log("Error loading data for S4: ", error));
}