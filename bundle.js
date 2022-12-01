window.onload = (ev) => {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
        .then(response => response.json())
        .then(data => {
            const dataset = data.data.map(item => [new Date(item[0]), item[1]]),
                w = window.innerWidth * 0.95,
                h = window.innerHeight * 0.80,
                padding = 60;

            const barWidth = (w - (2 * padding)) / dataset.length * 0.4;

            const xScale = d3.scaleTime()
                .range([padding - barWidth / 2, w - padding - barWidth / 2])
                .domain(d3.extent(dataset, function (d) { return d[0]; }))

            const xAxis = d3.axisBottom(xScale)
                .ticks(d3.timeYear.every(1))
                .tickFormat(d => d.getFullYear() % 5 === 0 ? d.getFullYear() : null);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d[1])])
                .range([h - padding, padding]);

            const yAxis = d3.axisLeft(yScale)
                .ticks(10 * 5)
                .tickFormat(d => d % 2000 === 0 ? d : null);

            let svg = d3.select("div")
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
                .attr("x", d => xScale(d[0]))
                .attr("y", d => yScale(d[1]))
                .attr("width", barWidth)
                .attr("height", d => h - yScale(d[1]) - padding)
                .append("title")
                .text(d => d);

            svg.append("g")
                .attr('id', 'x-axis')
                .attr("transform", "translate(0 ," + (h - padding) + ")")
                .call(xAxis);

            svg.append("g")
                .attr('id', 'y-axis')
                .attr("transform", "translate(" + (padding - barWidth/2) + ", 0)")
                .call(yAxis)
                .append("text")
                .text(data.data.name)
                .attr("transform", "rotate(-90)");


        });




};