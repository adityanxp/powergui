/* Copyright 2019 NXP

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holders nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS  AND CONTRIBUTORS
``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE REGENTS OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

var ax,ay,az,mx,my,mz,interval11 , interval12,sensor_state ,chart_cpu,chart1;
var arr1 = [];var arr2 = [];var arr3 = [];

function corechange(e)
{
    $.ajax({
        url: "http://" + window.location.host + "/sensor/sensor_demo.php?val=5&core="+e.target.value,
        cache: false,
        dataType: "json",
        success: function(data){
            if(data.status == true || data.status == "true")
            {               
                if(e.target.value == 4)
                {
                    $("#sensorlist").append(new Option("30","30"));
                    $("#sensorlist").append(new Option("40","40"));
                }
                else
                {
                    //$("#sensorlist option[value='20']").removeAttr("selected");
                    $("#sensorlist option[value='20']").remove();
                    $("#sensorlist option[value='30']").remove();
                    $("#sensorlist option[value='40']").remove();
                    $("#sensorlist").append(new Option("20","20"));
                    $("#sensorlist option[value='20']").attr("selected","selected");
                    for (i=21 ; i<41 ;i++)
                    {
                        $("#selcore option[value="+i+"]").remove();
                    }

                }

                
                sensorchange();

               // $("#sensorlist").prop("disabled",false);
           }
        },
        error:function(error)
        {
            console.log(error);
            $("#graphA").text("No Data Available");
            drawAccelerometerX(0);
            drawAccelerometerY(0);
            drawAccelerometerZ(0);
        }
    });
    
}

function sensorchange()
{
    $.ajax({
        url: "http://" + window.location.host + "/sensor/sensor_demo.php?val=6&total_sensor="+$('#sensorlist').val(),
        cache: false,
        dataType: "json",
        success: function(data){
            if(data.status == true || data.status == "true")
            {
                for (i=11 ; i<41 ;i++)
                {
                    $("#selcore option[value="+i+"]").remove();
                }
                if($('#sensorlist').val() == 20)
                {
                    for(i=11 ; i<21 ;i++)
                    $("#selcore").append(new Option(i,i));
                }
                else if($('#sensorlist').val() == 30)
                {
                    for(i=11 ; i<31 ;i++)
                    $("#selcore").append(new Option(i,i));
                }
                else if($('#sensorlist').val() == 40)
                {
                    for(i=11 ; i<41 ;i++)
                    $("#selcore").append(new Option(i,i));
                }

               // $("#selcore").prop("disabled",false);
                // $("#graphA").text("");
                // drawGraph();
                // computeBLEGraphValues();
            }            
        },
        error:function(error)
        {
            console.log(error);
            $("#graphA").text("No Data Available");
              drawAccelerometerX(0);
              drawAccelerometerY(0);
              drawAccelerometerZ(0);
        }
    });
    
    
}

function socketConnection(){
    $.ajax({
        url: "http://" + window.location.host + "/sensor/sensor_demo.php?val=1&sensor="+$("#selcore").val(),
        cache: false,
        success: function(data){
        updateRecords(data);
        console.log(data);
        }
    });
}
//-------------------------------------
function updateRecords(data){
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

    var arr1 = data.split("$");
    if (arr1[1] == false || arr1[1] == "false")
    {
        $("#device_moved").show();
        $("#device_mess").text(arr1[2]);
    }
    else
    {
        $("#device_moved").hide();
        var arr = arr1[0].split(" ");
        //var a = arr[k].split(" ");
        ax = arr[1];
        ay = arr[2];
        az = arr[3];
        
        /* accelerometerX */
        var chartAccelerometerX = $('#accelerometerX').highcharts();
        var pointAccelerometerX = chartAccelerometerX.series[0].points[0]; 
        var pax = parseFloat(ax);      
        pointAccelerometerX.update(pax);
        
        /* accelerometerY */
        var chartAccelerometerY = $('#accelerometerY').highcharts();
        var pointAccelerometerY = chartAccelerometerY.series[0].points[0]; 
        var pay = parseFloat(ay);      
        pointAccelerometerY.update(pay);

        /* accelerometerZ */
        var chartAccelerometerZ = $('#accelerometerZ').highcharts();
        var pointAccelerometerZ = chartAccelerometerZ.series[0].points[0]; 
        var paz = parseFloat(az);      
        pointAccelerometerZ.update(paz);
        
        var result1 = parseFloat(ax);
        var result2 = parseFloat(ay);    
        var result3 = parseFloat(az);
                    // add the point
        var series = chart1.series[0],
        shift = series.data.length > 20; // shift if the series is 
                    // longer than 20
        chart1.series[0].addPoint(result1, true , shift);
                    // add the point
        var series = chart1.series[1],
        shift = series.data.length > 20;
        chart1.series[1].addPoint(result2, true,shift);
                    // add the point
        var series = chart1.series[2],
        shift = series.data.length > 20;
        chart1.series[2].addPoint(result3, true,shift); 
                    //update x-axis 
        chart1.xAxis[0].categories.push(time);
        chart1.update({
                xAxis: {
                    categories: chart1.xAxis[0].categories
                        },
                });      

        //$("#pageLoadModal").hide();
    }
}
//-------------------------------------
function computeBLEGraphValues(){
    $("#pageLoadModal").show();
    var AX,AY,AZ;
    $.ajax({
        url: "http://" + window.location.host + "/sensor/sensor_demo.php?val=1&sensor="+$("#selcore").val(),
        cache: false,
        success: function(data){
            var dt = new Date();
            var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

            var arr1 = data.split("$");
            if (arr1[1] == false || arr1[1] == "false")
            {
                $("#device_moved").show();
                $("#device_mess").text(arr1[2]);
            }
            else
            {
                $("#device_moved").hide();
                var arr = arr1[0].split(" ");
                //var a = arr[k].split(" ");
                ax = arr[1];
                ay = arr[2];
                az = arr[3];
                
                /* accelerometerX */
                var chartAccelerometerX = $('#accelerometerX').highcharts();
                var pointAccelerometerX = chartAccelerometerX.series[0].points[0]; 
                var pax = parseFloat(ax);      
                pointAccelerometerX.update(pax);
                
                /* accelerometerY */
                var chartAccelerometerY = $('#accelerometerY').highcharts();
                var pointAccelerometerY = chartAccelerometerY.series[0].points[0]; 
                var pay = parseFloat(ay);      
                pointAccelerometerY.update(pay);

                /* accelerometerZ */
                var chartAccelerometerZ = $('#accelerometerZ').highcharts();
                var pointAccelerometerZ = chartAccelerometerZ.series[0].points[0]; 
                var paz = parseFloat(az);      
                pointAccelerometerZ.update(paz);
                
                var result1 = parseFloat(ax);
                var result2 = parseFloat(ay);    
                var result3 = parseFloat(az);
                            // add the point
                var series = chart1.series[0],
                shift = series.data.length > 20; // shift if the series is 
                            // longer than 20
                chart1.series[0].addPoint(result1, true , shift);
                            // add the point
                var series = chart1.series[1],
                shift = series.data.length > 20;
                chart1.series[1].addPoint(result2, true,shift);
                            // add the point
                var series = chart1.series[2],
                shift = series.data.length > 20;
                chart1.series[2].addPoint(result3, true,shift); 
                            //update x-axis 
                chart1.xAxis[0].categories.push(time);
                chart1.update({
                        xAxis: {
                            categories: chart1.xAxis[0].categories
                                },
                        });      

                //$("#pageLoadModal").hide();
            }
        
            interval12 = setInterval(function()
            {
                socketConnection();
            },1000);
        }        
      });
}

function drawAccelerometerX(data){
    var result = parseFloat(data);
    $('#accelerometerX').highcharts({   
        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
    
        title: {
            text: "X-Axis",
            align: 'center',
            verticalAlign: 'bottom'
        },
        exporting: { enabled: false },
        credits: { enabled: false },
    
        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },
    
        // the value axis
        yAxis: {
            min: -20,
            max: 20,
    
            minorTickInterval: 'auto',
            minorTickWidth: 0,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',
    
            tickPixelInterval: 20,
            tickWidth: 0,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: null
            },
            plotBands: [{
                from: -20,
                to: 20,
                color: '#E5AA50' // green
            }]
            // , {
            //     from: 0,
            //     to: 20,
            //     color: '#E5AA50' // yellow
            // }]
            // , {
            //     from: 500,
            //     to: 1000,
            //     color: '#16D6D9' // red
            // }]
        },
    
        series: [{
            name: 'Speed',
            data: [result],
            tooltip: {
                valueSuffix: ''
            }
        }]
    
    });
}
function drawAccelerometerY(data){
    var result = parseFloat(data);
    $('#accelerometerY').highcharts({ 
        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
    
        title: {
            text: "Y-Axis",
            align: 'center',
            verticalAlign: 'bottom'
        },
        exporting: { enabled: false },
        credits: { enabled: false },
        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },
    
        // the value axis
        yAxis: {
            min: -20,
            max: 20,
    
            minorTickInterval: 'auto',
            minorTickWidth: 0,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',
    
            tickPixelInterval: 20,
            tickWidth: 0,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: null
            },
            plotBands: [{
                from: -20,
                to: 20,
                color: '#16D6D9  ' // green
            }]
        },
    
        series: [{
            name: 'Speed',
            data: [result],
            tooltip: {
                valueSuffix: ''
            }
        }]
    
    });
}
function drawAccelerometerZ(data){
    var result = parseFloat(data);
        $('#accelerometerZ').highcharts({   
        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
    
        title: {
            text: "Z-Axis",
            align: 'center',
            verticalAlign: 'bottom'
        },
        exporting: { enabled: false },
        credits: { enabled: false },
        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },
    
        // the value axis
        yAxis: {
            min: -20,
            max: 20,
    
            minorTickInterval: 'auto',
            minorTickWidth: 0,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',
    
            tickPixelInterval: 20,
            tickWidth: 0,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: null
            },
            plotBands: [{
                from: -20,
                to: 20,
                color: '#D75883' // green
            }]
        },
    
        series: [{
            name: 'Speed',
            data: [result],
            tooltip: {
                valueSuffix: ''
            }
        }]
    
    });
}

function computetableValues(){
     $("#pageLoadModal").show();
      $.ajax({
          url: "http://" + window.location.host + "/sensor/sensor_demo.php?val=2",
         // url: "http://" + window.location.host + "/apple.txt",
          cache: false,
          success: function(data){
             $("#tablesoc").empty();     
             arr = data.split("$");
  
                   for (var k = 0; k < arr.length ,k<$('#sensorlist').val(); k++){
                      if(k==$('#sensorlist').val())
                      break;  
                      else
                      {
                          var a = arr[k].split(" ");
                               ax = a[1];
                               ay = a[2];
                               az = a[3];
                            var j = k;
                            var p = ++j;
                           $("#tablesoc").append("<tr><th>sensor"+p+"</th><th>"+ax+"</th><th>"+ay+"</th><th>"+az+"</th></tr>");
                           
                      }
                          
                    }
                    interval11 = setInterval(() => {
                        computetableValues1()
                      }, 1000);
          }   ,
          error:function(data){
              clearInterval(interval11);
          } 
  
        });
  }
  function computetableValues1(){
    
    $.ajax({
        url: "http://" + window.location.host + "/sensor/sensor_demo.php?val=2",
       // url: "http://" + window.location.host + "/apple.txt",
        cache: false,
        success: function(data){
           
                arr = data.split("$");

                 for (var k = 0; k < arr.length ,k<50; k++){
                    if(k==50)
                    break;  
                    else
                    {
                         var a = arr[k].split(" ");
                               ax = a[1];
                               ay = a[2];
                               az = a[3];
                            
                    var x = document.getElementById("tablesoc").rows[k].cells;
                    x[1].innerHTML =  ax; 
                    x[2].innerHTML = ay; 
                    x[3].innerHTML = az; 

                    }
                        
                            }
        }   ,
        error:function(data){
            clearInterval(interval11);
        } 

      });
}
function hide_table()
{
    clearInterval(interval11);
    $('#all_details').hide();
}

function drawGraph()
{
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    chart1 = Highcharts.chart('graphA', {
        title: {
            text: ''
    },
    exporting: { enabled: false },
    credits: {
        enabled: false
    },
    legend: {
        itemStyle: {
            cursor : "auto"
        }
    },
    plotOptions: {
        series: {
            events: {
                legendItemClick: function () {
                    
                        return false;
                }
            }
        }
    },
    xAxis: {
        type: 'datetime',
        categories: [time],
        title:{
            text:"Time",
            style: {
                color: 'black',
                //fontStyle:'italic',
                //fontWeight: 'bold',
                fontSize:'15px'
            }
        },
        lineColor: 'skyblue',
        lineWidth: 1
    },
    yAxis: {
        title:{
            text:"Accelerometer Values",
            style: {
               // fontStyle:'italic',
                color: 'black',
                //fontWeight: 'bold',
                fontSize:'15px'
            }
        },
        tooltip:{
            title:"Accelerometer"
        },
        lineColor: 'skyblue',
        lineWidth: 1,
        max: 20,
        min: -20
    },
    tooltip: {
        formatter: function () {
            var s = '<b>' + this.x + '</b>';

            $.each(this.points, function () {
                s += '<br/>' + this.series.name + ': ' +
                    this.y ;
            });

            return s;
        },
        shared: true
    },
    series: [{
        name: 'X-axis',
        color: '#E5AA50',
        data: []

    },{
        name: 'Y-axis',
        color: '#16D6D9 ',
        data: []

    }, {
        name: 'Z-axis',
        color: '#D75883',
        data: []
    }]
 });
}

function start_sensor()
{
    $.ajax({
        url: "http://" + window.location.host + "/sensor/sensor_demo.php?val=3",
        cache: false,
        success: function(data){           
        },
        error:function(data){
           // console.log("error"+data);
        }
    });

    setTimeout(() => {
        $("#start").prop("disabled",true);
        $("#stop").prop("disabled",false);
        $(".sensor_start").prop("disabled",false);
       // $("#sensorlist").prop("disabled",true);
       // $("#selcore").prop("disabled",true);
       sensorState();
        sensor_state = setInterval(function()
        {
            sensorState();
        },5000);
        $("#graphA").text("");
        drawGraph();
        computeBLEGraphValues();
    }, 500);

}

function stop_sensor()
{
    clearInterval(interval12);
    clearInterval(sensor_state);
    $.ajax({
        url: "http://" + window.location.host + "/sensor/sensor_demo.php?val=4",
        cache: false,
        success: function(data){
            $("#start").prop("disabled",false);
            $("#stop").prop("disabled",true);
            $("#sensorlist").prop("disabled",true);
           // $("#selcore").prop("disabled",true);
           // $(".sensor_start").prop("disabled",true);
            $("#graphA").text("No Data Available");

            clearInterval(sensorState);
            $("#fridge-state").text('');

            var chartAccelerometerX = $('#accelerometerX').highcharts();
            var pointAccelerometerX = chartAccelerometerX.series[0].points[0]; 
            pointAccelerometerX.update(0);
            
            /* accelerometerY */
            var chartAccelerometerY = $('#accelerometerY').highcharts();
            var pointAccelerometerY = chartAccelerometerY.series[0].points[0]; 
            pointAccelerometerY.update(0);
        
            /* accelerometerZ */
            var chartAccelerometerZ = $('#accelerometerZ').highcharts();
            var pointAccelerometerZ = chartAccelerometerZ.series[0].points[0]; 
            pointAccelerometerZ.update(0);
            // drawAccelerometerX(0);
            // drawAccelerometerY(0);
            // drawAccelerometerZ(0);
        },
        error:function(data){
           // console.log("error"+data);
        }
    });
}

function sensorState(){
    $.ajax({
        url: "http://" + window.location.host + "/sensor/sensor_demo.php?val=7",
        cache: false,
        success: function(data){
            
            $("#fridge-state").text('');
            var arr = data.split("$");

            var door = 'open';
            var j= arr.length - 1 ;
            for(i=0 ; i< j ; i++)
            $("#fridge-state").append('<li><div class="fridge-icon ' + door + '"><span class="badge">' + arr[i] + '</span></div></li>');
            
        
            // interval12 = setInterval(function()
            // {
            //     socketConnection();
            // },500);
        }        
      });
}

function drawCPU()
{
    chart_cpu =  Highcharts.chart('cpu_detail', {
        chart: {
        type: 'solidgauge'
        },

        title: null,
        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }, min: 0,
            max: 100,
            // title: {
            //     text: 'Speed'
            // }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            //name: 'Speed',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                    '<span style="font-size:12px;color:silver"></span></div>'
            },
            // tooltip: {
            //     valueSuffix: ' km/h'
            // }
        }]
    });
}
function getCPU()
{
    var url = window.location.origin;
    $.ajax({
        url: url + ':19999/api/v1/data?chart=system.cpu&format=array&points=360&group=average&options=absolute|jsonwrap|nonzero&after=-360&_=1514353930176',
        cache: false,
        success: function(data){
            
            point = chart_cpu.series[0].points[0];
            inc = data.result[0];
            newVal = inc.toFixed(2);
            newVal = parseFloat(newVal);
    
            point.update(newVal);
        }        
      });
}