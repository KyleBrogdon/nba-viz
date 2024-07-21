import { teamColors } from './teamColors.js';
import { loadS3 } from './s3.js';
import { loadS1 } from './s1.js';

export function loadS4() {
    const container = d3.select("#container");
    container.html("");

    container.append("h1").text("Player BPM vs Individual Instagram Followers");

    d3.csv("data/merged_players_bpm.csv").then(data => {
        data.forEach(d => {
            d.BPM = +d.BPM;
            d.Followers = +d.Followers;
            console.log(`Player: ${d.player}, BPM: ${d.BPM}, Followers: ${d.Followers}`);
            if (d.player === "Nikola Jokic") {
                console.log("Nikola Jokic found:", d);
            }
        });

        const margin = { top: 50, right: 20, bottom: 80, left: 150 };
        const width = 1400 - margin.left - margin.right;
        const height = 900 - margin.top - margin.bottom;

        const svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLog()
            .range([0, width])
            .domain([d3.min(data, d => d.Followers), d3.max(data, d => d.Followers)]);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([d3.min(data, d => d.BPM), d3.max(data, d => d.BPM)]);

        const xAxis = svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format(".0s")))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");

        const yAxis = svg.append("g")
            .call(d3.axisLeft(y));

        yAxis.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", `translate(-10, -10)`)
            .style("text-anchor", "end")
            .text(d3.max(data, d => d.BPM).toLocaleString());

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
            .attr("cy", d => y(d.BPM))
            .attr("r", 12)
            .style("fill", d => {
                const color = teamColors[d.Team]?.color || "#69b3a2";
                return color;
            })
            .on("mouseover", function(event, d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 17);

                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Player: ${d.player}<br/>BPM: ${d.BPM}<br/>Followers: ${d.Followers}`)
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
            .text("Player Instagram Followers (Log Scale)");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Player BPM");

        
        container.append("div")
                .attr("class", "footnote")
                .append("p")
                .text("ANNOTATION: Generally speaking, the more popular the player, the more they contribute to their team's success / display individual talent. There are some significant outliers, such as Jokic with over 13 BPM while only having ~300k followers, but the clustering on the bottom left of the image shows that lesser impactful players have less of a media presence. Hover over any data point for more details. Click return to see this study again.");

        container.append("button")
            .text("Previous")
            .on("click", loadS3);

        container.append("button")
            .text("Return")
            .on("click", loadS1);
    }).catch(error => console.log("Error loading data for S4: ", error));
}
