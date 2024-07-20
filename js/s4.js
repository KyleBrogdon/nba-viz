import { teamColors } from './teamColors.js';
import { loadS3 } from './s3.js';
import { loadS1 } from './s1.js';

export function loadS4() {
    const container = d3.select("#container");
    container.html("");

    container.append("h1").text("NBA Player BPM vs Instagram Followers");

    d3.csv("data/merged_players_bpm.csv").then(data => {
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
            .domain([d3.min(data, d => +d.BPM), d3.max(data, d => +d.BPM)]);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, d => +d.followers)]);

        const color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(data.map(d => d.team));

        svg.append("g")
            .selectAll("circle")
            .data(data)
          .enter().append("circle")
            .attr("cx", d => x(d.BPM))
            .attr("cy", d => y(d.followers))
            .attr("r", 5)
            .attr("fill", d => teamColors[d.Team])
            .on("mouseover", function(event, d) {
                const [x, y] = d3.pointer(event);
                d3.select("#tooltip")
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`)
                    .select("#value")
                    .text(`${d.player}, ${d.team}, BPM: ${d.BPM}, Followers: ${d.followers}`);
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

        svg.append("text")
            .attr("transform", `translate(${width / 2},${height + margin.bottom - 10})`)
            .style("text-anchor", "middle")
            .text("BPM");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Instagram Followers");

        container.append("div")
            .attr("id", "tooltip")
            .attr("class", "hidden")
            .append("p")
            .attr("id", "value");

        container.append("button")
            .text("Previous")
            .on("click", loadS3);

        container.append("button")
            .text("Next")
            .on("click", loadS1);
    }).catch(error => console.log("Error loading data for S4: ", error));
}