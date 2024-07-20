function loadS1() {
    const container = d3.select("#container");
    container.html("");

    container.append("h1").text("Introduction to BPM and Popularity Metric");

    container.append("p").text("Box Plus-Minus (BPM) is a box score-based metric for evaluating basketball players' quality and contribution to the team. Instagram followers indicate the popularity of players on social media.");

    container.append("button")
        .text("Next")
        .on("click", loadS2);
}
