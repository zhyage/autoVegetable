$(document).ready(function() {
      var margin = {
            top: 30,
            right: 20,
            bottom: 30,
            left: 50
      };
      width = 600 - margin.left - margin.right;
      height = 270 - margin.top - margin.bottom;
      var parseDate = d3.time.format("%d-%b-%y").parse;
      var x = d3.time.scale().range([0, width]);
      var y = d3.scale.linear().range([height, 0]);
      var y2 = d3.scale.linear().range([height, 0]);
      var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10);
      var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);
      var y2Axis = d3.svg.axis().scale(y2).orient("right").ticks(1);
      //?
      var valueline = d3.svg.line()
            .x(function(d) {
                  return x(d.date);
            })
            .y(function(d) {
                  return y(d.close);
            });

      var soilmoistureline = d3.svg.line()
            .interpolate("linear")
            .x(function(d) {
                  return x(d.date)
            })
            .y(function(d) {
                  return y(d.value)
            });

      var moistureline = d3.svg.line()
            .interpolate("linear")
            .x(function(d) {
                  return x(d.date)
            })
            .y(function(d) {
                  return y(d.value)
            });  
            
      var tempertureline = d3.svg.line()
            .interpolate("linear")
            .x(function(d) {
                  return x(d.date)
            })
            .y(function(d) {
                  return y(d.value)
            });

      var valveline = d3.svg.line()
            .interpolate("step-after")
            .x(function(d) {
                  return x(d.date)
            })
            .y(function(d) {
                  return y2(d.value)
            });


      var svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      //Get the data
      /*d3.tsv("data/data.tsv", function(error, data) {
            data.forEach(function(d) {
                  d.date = parseDate(d.date);
                  d.close = +d.close;
            });
                  //Scale(规模) the range of the data
            x.domain(d3.extent(data, function(d) {
                  return d.date;
            }));
            y.domain([0, d3.max(data, function(d) {
                  return d.close;
            })]);
            //Add the valueline path
            svg.append("path")
                  .attr("d", valueline(data));
            //Add the X Axis
            svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);
            //Add the Y Axis
            svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis);
      });*/

      d3.json("data/collectFileSave.json", (error, data)=>{
            var soilmoistureData = []
            var moistureData = []
            var tempertureData = []
            var valveData = []
            _.each(data, (board)=>{
                  console.info("board : ", board)
                  var equipList = board.equipList
                  var soilmoistureEquip = _.find(equipList, (equip)=>{
                        return equip.equipId == 3
                  })
                  var temperureEquip = _.find(equipList, (equip)=>{
                        return equip.equipId == 1
                  })
                  var moistureEquip = _.find(equipList, (equip)=>{
                        return equip.equipId == 2
                  })
                  var valveEquip = _.find(equipList, (equip)=>{
                        return equip.equipId == 5
                  })
                  soilmoistureData = soilmoistureEquip.valueList
                  moistureData = moistureEquip.valueList
                  tempertureData = temperureEquip.valueList
                  valveData = valveEquip.valueList
            })
            _.each(soilmoistureData, (value)=>{
                  console.info("soilmoisture updateTime : ", value.updateTime, "vaule : ", value.value)
                  var kk = new Date(value.updateTime)
                  console.info("kk : ", kk.toString('dddd, MMMM ,yyyy'))
            })
            soilmoistureData.forEach(function(d){
                  d.date = +d.updateTime
                  d.value = +d.value
            })

            moistureData.forEach((d)=>{
                  d.date = +d.updateTime
                  d.value = +d.value
            })

            tempertureData.forEach((d)=>{
                  d.date = +d.updateTime
                  d.value = +d.value
            })

            valveData.forEach((d)=>{
                  d.date = +d.updateTime
                  d.value = +d.value
            })

            x.domain(d3.extent(soilmoistureData, function(d) {
                  d.date = +d.updateTime
                  return d.date;
            }));
            y.domain([0, d3.max(soilmoistureData, function(d) {
                  return d.value;
            })]);

            y2.domain([0, d3.max(valveData, function(d) {
                  return d.value;
            })]);

            //Add the valueline path
            svg.append("path")
                  .attr("d", soilmoistureline(soilmoistureData));

            svg.append("path")
                  .style("stroke", "red")
                  .attr("d", moistureline(moistureData));
                  
            svg.append("path")
                  .style("stroke", "yellow")
                  .attr("d", tempertureline(tempertureData));    

            svg.append("path")
                  .style("stroke", "green")
                  .attr("d", valveline(valveData)); 

            //Add the X Axis
            svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);
            //Add the Y Axis
            svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis);
            svg.append("g")
                  .attr("class", "y axis")
                  .attr("transform", "translate(" + width + ", 0)")
                  .style("fill", "red")
                  .call(y2Axis);
      })

      function columDataSelected(e) {
            if (this.checked) {
                  alert("checked " + this.name)
            } else {
                  alert("unchecked " + this.name)
            }
      }

      function attachCheckboxHandlers() {
            var el = document.getElementById('actionList')
            var tops = el.getElementsByTagName('input')
            _.each(tops, (top) => {
                        if (top.type === 'checkbox') {
                              top.onclick = columDataSelected
                        }
                  })
      }

    attachCheckboxHandlers()
})