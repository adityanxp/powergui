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

var count=1,cpu_chart,temp_chart,performance_chart,power_chart;
$(document).ready(function () {
    $.ajax({
            url: "http://" + window.location.host + "/network.php?val=9",
            cache: false,
            success: function(data){

            },
            error:function(data){
               // console.log("error"+data);
            }
        });
    
            performance_chart =  Highcharts.chart('circularGaugeContainer1', {
                chart: {
                    type: 'gauge',
                    alignTicks: false,
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    backgroundColor:'transparent'
                },
                exporting: { enabled: false },
        
                title: {
                    text: null
                },
                pane: {
                    size: '100%',
                        startAngle: -150,
                        endAngle: 150
                },
                yAxis: [{
                    min: 0,
                    max: 50000,
                    tickPosition: 'outside',
                    lineColor: '#933',
                    tickInterval: 5000,
                    lineWidth: 2,
                    minorTickPosition: 'outside',
                    tickColor: '#933',
                    minorTickColor: '#933',
                    tickLength: 5,
                    minorTickLength: 5,
                    labels: {
                        distance: 12,
                        rotation: 'auto',
                        format: '{value}',
                        style: {
                        color: "#000000",
                        font: '12px Arial, sans-serif'
                        }
                    },
                    offset: -20,
                    endOnTick: false
                }],
                credits: {
                    enabled: false
                },
        
                series: [{
                    name: 'Performance',
                    data: [0],
                    tooltip: {
                        valueSuffix: ' Iterations/sec'
                    }
                }]
    
            });
            power_chart =  Highcharts.chart('circularGaugeContainer', {
                chart: {
                    type: 'gauge',
                    alignTicks: false,
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    backgroundColor:'transparent'
                },
                exporting: { enabled: false },
        
                title: {
                    text: null
                },
                pane: {
                    size: '100%',
                        startAngle: -150,
                        endAngle: 150
                },
                yAxis: [{
                    min: 0,
                    max: 30,
                    tickPosition: 'outside',
                    lineColor: '#933',
                    tickInterval: 2,
                    lineWidth: 2,
                    minorTickPosition: 'outside',
                    tickColor: '#933',
                    minorTickColor: '#933',
                    tickLength: 5,
                    minorTickLength: 5,
                    labels: {
                        distance: 12,
                        rotation: 'auto',
                        format: '{value}',
                        style: {
                        color: "#000000",
                        font: '12px Arial, sans-serif'
                        }
                    },
                    offset: -20,
                    endOnTick: false
                }],
                credits: {
                    enabled: false
                },
        
                series: [{
                    name: 'Performance',
                    data: [0],
                    tooltip: {
                        valueSuffix: ' Iterations/sec'
                    }
                }]
    
            });
            cpu_chart =  Highcharts.chart('chart-container2', {
                chart: {
                type: 'solidgauge'
                },

                title: null,
                pane: {
                    center: ['50%', '85%'],
                    size: '100%',
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
            temp_chart =  Highcharts.chart('chart-container1', {
                chart: {
                type: 'solidgauge'
                },

                title: null,
                pane: {
                    center: ['50%', '85%'],
                    size: '100%',
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
                    $("#pageLoadModal").hide();
                    loadvalues();
                   


});
function getvalue()
{
    //$('#page_loader').show();
    var test_coremark1 = count; 
   
                if (test_coremark1 == "1")
                {
                    test = 1;
                    $('#coremarkmodal').show();
                }
                else if (test_coremark1 == "2")
                {
                    test = 2;
                    $('#dhrystonemodal').show();
                }
                $.ajax({
                    type: "POST",
                   // type: "GET",
                   // url: 'status.json',
                    url: 'status.php',
                    dataType: "json",
                    success: function (result)
                    {
                        
                        var res_status = result.status;
                        if (res_status == 'true')
                        {
                            $("#pageLoadModal").hide();
                            //-------------------------------------
                            $.ajax({
                                type: "POST",
                               // type: "GET",
                                //url: 'shell.json',
                                url: 'shell.php',
                                dataType: "json",
                                data: {val: test},
                                success: function (result)
                                {
                                    
                                    var res_status = result.status;
                                    if (res_status == 'true')
                                    {
                                        $("#freq").html(result.data.frequency );
                                        $(".power_watt").html(result.data.power );
                                        $("#it_id").text(result.data.iteration_per_sec);
                                        var perfo1 = result.data.iteration_per_sec;
                                        var frequency = result.data.frequency;
                                        var cpu_value = result.data.cpu_usage;
                                        var temp_value = result.data.temperature;
                                        var power = result.data.power;

                                        var point = cpu_chart.series[0].points[0];
                                        newVal = parseFloat(cpu_value);                                
                                        point.update(newVal);
                                        var point1 = temp_chart.series[0].points[0];
                                        newVal = parseFloat(temp_value);                                
                                        point1.update(newVal);
                                        var point2 = performance_chart.series[0].points[0];
                                        newVal = parseFloat(perfo1);                                
                                        point2.update(newVal);
                                        var point3 = power_chart.series[0].points[0];
                                        newVal = parseFloat(power);                                
                                        point3.update(newVal);
                                      
                                        
                                        if (test_coremark1 == "1")
                                        {
                                            $("#unit_id").html("Iterations/Sec");
                                            $('#coremarkmodal').hide();
                                        } else
                                        {
                                            $("#unit_id").html("DMIPS");
                                            $('#dhrystonemodal').hide();
                                        }
                                    } else
                                    {
                                        alert("false");
                                    }
                                    //$('#page_loader').hide();
                                },
                                error: function (result)
                                {
                                    alert("There is some issue in network");
                                }
                            });
                        } 
                        else
                        {
                            $('#coremarkmodal').hide();
                            $('#dhrystonemodal').hide();
                           $("#pageLoadModal").show();
                           setTimeout(
                            function()
                            {
                                window.location.reload();
                            }, 30000);
                        }
                    },
                    error: function (result)
                    {
                        $("#pageLoadModal").hide();
                        alert("There is some issue in network");
                    }
                });    
               
}
function corevalue()
{
    var core = $("#selcore").val();
    // $.ajax({
    //     type: "POST",
    //    // type: "GET",
    //    // url: 'status.json',
    //     url: 'status.php',
    //     dataType: "json",
    //     success: function (result)
    //     {
            
    //         var res_status = result.status;
    //         if (res_status == 'true')
    //         {
    //             $("#pageLoadModal").hide();
    		   $("#go").prop("disabled",true);
                //--------------
                $.ajax({
                    //type: "GET",
                    type: "POST",
                    url: 'core.php',
                    dataType: "json",
                    data: {core: core},
                    success: function (result)
                    {
            
                        var res_status = result.status;
                        if (res_status == 'true')
                        {
                            loadvalues();
                            for (var k=1 ; k<=16 ;k++)
                            {
                                $(".btn.core").removeClass("btn-success");
                            }
                            var i = $("#selcore").val();
                            for (var j=1 ; j<=i ;j++)
                            {
                                var p=j-1;
                                $("#core"+p).addClass("btn-success");
                            }
                            setTimeout(function(){
                                $("#go").prop("disabled",false);
                            },2500);
                        }
                        else
                        console.log("false");
                    },
                    error: function (result)
                    {
                        console.log("There is some issue in network");
                    }
                });
    //         } 
    //         else
    //         {
    //            $("#pageLoadModal").show();
    //            setTimeout(
    //             function()
    //             {
    //                 window.location.reload();
    //             }, 30000);
    //         }
    //     },
    //     error: function (result)
    //     {
    //         $("#pageLoadModal").hide();
    //         alert("There is some issue in network");
    //     }
    // });    
    
    
}
function setvalue(value)
{
    count=value;
    if(value == "1")
    {
        $("#coremark").addClass("btn-success");   
        $("#drystone").removeClass("btn-success");     
     //  $("#selcore").prop("disabled",false);
      //  $("#selcore").val("16");
      //  corevalue();
       // $("#go").prop("disabled",false);
        loadvalues();
        $("#unit_id").html("Iterations/Sec");
    }

    if(value == "2")
    {
        $("#drystone").addClass("btn-success");
        $("#coremark").removeClass("btn-success");
     //   $("#selcore").prop("disabled",false);
     //   $("#selcore").val("16");
      //  corevalue();
      //  $("#go").prop("disabled",false);
        loadvalues();
        $("#unit_id").html("DMIPS");
    }
    
}
function loadvalues()
{
    // $.ajax({
    //     type: "POST",
    //    // type: "GET",
    //    // url: 'status.json',
    //     url: 'status.php',
    //     dataType: "json",
    //     success: function (result)
    //     {
            
    //         var res_status = result.status;
    //         if (res_status == 'true')
    //         {
    //             $("#pageLoadModal").hide();
                //---------------------
    $("#go").prop("disabled",true);
                $.ajax({
                    //type: "GET",
                    type: "POST",
                    url: 'shell.php',
                    dataType: "json",
          data: {val: 3},
          success: function (result)
          {           
              var res_status = result.status;
              if (res_status == 'true')
              {
                  $(".power_watt").html(result.data.power );
                  $("#freq").html(result.data.frequency);
                  $("#it_id").text("0");
                  $("#selcore").removeClass("hidden");
                  $("#selcore").val(result.data.core_value);
                  for (var k=1 ; k<=16 ;k++)
                  {
                      $(".btn.core").removeClass("btn-success");
                  }
                  var i = $("#selcore").val();
                  for (var j=1 ; j<=i ;j++)
                  {
                      var p=j-1;
                      $("#core"+p).addClass("btn-success");
                  }

                    var point3 = power_chart.series[0].points[0];
                    newVal = parseFloat(result.data.power);                                
                    point3.update(newVal);

                    var point2 = performance_chart.series[0].points[0];
                    newVal = parseFloat(0);                                
                    point2.update(newVal);

                    var point = cpu_chart.series[0].points[0];
                    newVal = parseFloat(0);                                
                    point.update(newVal);
                    
                    var point1 = temp_chart.series[0].points[0];
                    newVal = parseFloat(result.data.temperature);                                
                    point1.update(newVal);

    		$("#go").prop("disabled",false);
              } else
              {
                  alert("false");
              }
          },
          error: function (result)
          {
              console.log("There is some issue in network");
          }
      });
    //         } 
    //         else
    //         {
    //            $("#pageLoadModal").show();
    //            setTimeout(
    //             function()
    //             {
    //                 window.location.reload();
    //             }, 30000);
    //         }
    //     },
    //     error: function (result)
    //     {
    //         $("#pageLoadModal").hide();
    //         alert("There is some issue in network");
    //     }
    // });
}
// function myFunction(event) {
//     debugger;
//     console.log("apple");debugger;
//     for(var i=1;i<3;i++)
//     {
//         $("#top"+i).removeClass("active");
//     }
//     debugger;
//     $(event.target).addClass("active");
//     debugger;
// }
