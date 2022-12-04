const drawBarChart = (ev) => {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
        .then(response => response.json())
        .then(data => {
            const dataset = data.data,
                w = window.innerWidth * 0.85,
                h = window.innerHeight * 0.70,
                padding = { top: 10, bottom: 50, left: 50, right: 20 };

            const barWidth = (w - (padding.left + padding.right)) / dataset.length * 1;

            const xScale = d3.scaleTime()
                .range([padding.left, w - padding.right])
                .domain(d3.extent(dataset, function (d) { return new Date(d[0]); }));

            console.log(dataset[0][0]);
            console.log(xScale(new Date(dataset[0][0])));

            const xAxis = d3.axisBottom(xScale);
            /* .ticks(d3.timeYear.every(1))
            .tickFormat(d => {
                return d.getFullYear() % 5 === 0 ? d.getFullYear() : null;
            }); */

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d[1])])
                .range([h - padding.bottom, padding.top]);

            const yAxis = d3.axisLeft(yScale);
            /* .ticks(10 * 5)
            .tickFormat(d => d % 2000 === 0 ? d : null); */

            d3.select("div.container")
                .append("h1")
                .attr("id", "title")
                .text('United States GDP');

            let svg = d3.select("div.container")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            svg.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("data-date", d => d[0])
                .attr("data-gdp", d => d[1])
                .attr("x", d => xScale(new Date(d[0])))
                .attr("y", d => yScale(d[1]))
                .attr("width", barWidth)
                .attr("height", d => h - yScale(d[1]) - padding.bottom)
                .on('mouseover', function (e) {
                    let date = new Date(d3.select(this).attr("data-date"));
                    d3.select("div#tooltip")
                        .style("visibility", "visible")
                        .attr("data-date", d3.select(this).attr("data-date"))
                        .style("left", (e.clientX - 100) + "px")
                        .style("top", (e.clientY - 100) + "px");
                    d3.select("div#tooltip-x")
                        .text(date.getFullYear() + " Q" + Math.ceil((date.getMonth() + 3) / 12 * 4));
                    d3.select("div#tooltip-y")
                        .text(d3.format("$.1f")(d3.select(this).attr("data-gdp")) + " Billion");
                })
                .on('mouseout', function (e) {
                    d3.select("div#tooltip").style("visibility", "hidden");
                });

            svg.append("g")
                .attr('id', 'x-axis')
                .attr("transform", "translate(0 ," + (h - padding.bottom) + ")")
                .call(xAxis);

            svg.append("g")
                .attr('id', 'y-axis')
                .attr("transform", "translate(" + padding.left + ", 0)")
                .call(yAxis)
                .append("text")
                .text(data.name.split(',')[0])
                .attr("class", "axisName")
                .attr("x", -padding.left)
                .attr("y", padding.top * 1.6)
                .attr("transform", "rotate(-90)");

            d3.select("div.container")
                .append("p")
                .text("For more info, visit: ")
                .append("a")
                .attr("href", 'http://www.bea.gov/national/pdf/nipaguid.pdf')
                .attr("target", '_blank')
                .text('http://www.bea.gov/national/pdf/nipaguid.pdf');

            document.querySelector("#please-wait").remove();
        });
};

document.onreadystatechange = (ev) => {
    if (document.readyState === "complete")
        drawBarChart(ev);
}