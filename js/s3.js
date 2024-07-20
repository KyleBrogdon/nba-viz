import { teamColors } from './teamColors.js';
import { loadS4 } from './s4.js';
import { loadS2 } from './s2.js';


export function loadS3() {
    const container = d3.select("#container");
    container.html("");

    container.append("h1").text("NBA Team Wins vs Instagram Followers");

    d3.csv("data/teams.csv").then(data => {
        data.forEach(d => {
            d.Wins = +d.Wins;
            d.Followers = +d.Followers;
            console.log(`Team: ${d.Team}, Wins: ${d.Wins}, Followers: ${d.Followers}`);
        });

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
            .domain([0, d3.max(data, d => d.Wins)]);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, d => d.Followers)]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll("circle")
            .data(data)
          .enter().append("circle")
            .attr("cx", d => {
                const cx = x(d.Wins);
                console.log(`Team: ${d.Team}, Wins: ${d.Wins}, CX: ${cx}`); 
                return cx;
            })
            .attr("cy", d => {
                const cy = y(d.Followers);
                console.log(`Team: ${d.Team}, Followers: ${d.Followers}, CY: ${cy}`); 
                return cy;
            })
            .attr("r", 5)
            .style("fill", d => {
                const color = teamColors[d.Team] || "#69b3a2";
                console.log(`Team: ${d.Team}, Color: ${color}`); 
                return color;
            });

        svg.append("text")
            .attr("transform", `translate(${width / 2},${height + margin.bottom - 40})`)
            .style("text-anchor", "middle")
            .text("Team Wins");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 60)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Instagram Followers");

        container.append("button")
            .text("Previous")
            .on("click", loadS2);

        container.append("button")
            .text("Next")
            .on("click", loadS4);
    }).catch(error => console.log("Error loading data for S3: ", error));
}