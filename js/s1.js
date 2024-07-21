import { loadS2 } from './s2.js';

export function loadS1() {
    const container = d3.select("#container");
    container.html("");

    container.append("h1").text("NBA Team and Player Success Compared To Social Media popularity");

    container.append("img")
        .attr("src", "data/cover.jpg")
        .attr("alt", "Cover Image")
        .attr("width", "70%") 
        .attr("height", "auto"); 

    container.append("p").text("This interactive slideshow will compare the most popular NBA Teams and Players on social media (using Instagram) with both team and individual success. Primary metrics used are team wins, team instagram followers, player instagram followers, and Box Plus-Minus (BPM). BPM is a box score-based metric for evaluating basketball players' quality and contribution to the team.");

    container.append("button")
        .text("Next")
        .on("click", loadS2);
}
