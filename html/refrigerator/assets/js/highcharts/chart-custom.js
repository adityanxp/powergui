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

var tempCharts = function (ITTemp, ETTemp) {
    Highcharts.chart('tempChart', {
        chart: {
            type: 'line',
            events: {
                load: function () {
                    if(ITTemp.length > 20 ){
                    this.xAxis[0].setExtremes(
                        ITTemp.length - 20,
                        ITTemp.length -1
                    );
                }
                }
            }
        },
        title: {
            text: 'Average Temperature'
        },
        subtitle: {
            //text: 'Source: WorldClimate.com'
        },
        scrollbar: {
            enabled: ITTemp.length > 20 ? true : null,
        },
        xAxis: {
            type: 'datetime',
            max: ITTemp.length > 20 ? 20 : null,

            categories: (function () {
                var timeArray = [],
                    timeGap = 0,
                    startdate = moment(),
                    timeInterval = 30,
					todayDate = parseInt(startdate.format('DD'));

                for (var i = 0; i < ITTemp.length; i++) {
                    startdate = moment();
                    startdate = startdate.subtract(timeGap, "seconds");
					startdate = startdate.format('DD-MMM h:mm:ss A');
                    timeArray.push(startdate);
                    timeGap += timeInterval;
                }
			
                timeArray = timeArray.reverse();
                return timeArray;
            })()

        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            min: 0

        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        series: [{
            name: 'Internal Temperature',
            data: ITTemp
        }, {
            name: 'External Temperature',
            data: ETTemp
        }]
    });
}
var fridgeData = [],
    fridgeNo = 1,
    fridgeTime = 2;
var handleData = function (res) {
    // return getFridgeData().then(function(data1){
    var data = [],
        i = 4;
    for (i = 4; i <= res.length; i += 5) {
        if (i <= res.length) {
            data.push(
                res[i]
            );
        }
    }
    console.log(data)
    return data;
    // })
}

var handleDataExtremeTemp = function (res) {
    // return getFridgeData().then(function(data1){
    var data = [],
        i = 3;
    for (i = 3; i <= res.length; i += 5) {
        if (i <= res.length) {
            data.push(
                res[i]
            );
        }
    }
    // data.pop();
    console.log(data)
    return data;
    // })
}


Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

var gaugeOptions = {

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
        }
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    }
};

// The speed gauge
var chartSpeed = Highcharts.chart('cpuUtilization', Highcharts.merge(gaugeOptions, {
    yAxis: {
        min: 0,
        max: 100,
        title: {
            text: 'CPU'
        }
    },

    credits: {
        enabled: false
    },

    series: [{
        name: 'CPU',
        data: [0],
        dataLabels: {
            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                '<span style="font-size:12px;color:silver">%</span></div>'
        },
        tooltip: {
            valueSuffix: ' %'
        }
    }]

}));

// Bring life to the dials
setInterval(function () {
    // Speed
    var point,
        newVal,
        inc;

    if (chartSpeed) {
        point = chartSpeed.series[0].points[0];
        //inc = Math.round((Math.random() - 0.5) * 100);
        getCpuData().then((data) => {
            inc = data;
            newVal = inc.toFixed(2);
            newVal = parseFloat(newVal);

            point.update(newVal);

        });

    }

}, 1000);

var getFridgeData = function (number, time) {
    var value = 3;
    fridgeNo = number;
    fridgeTime = time,
        maxNumberofData = time;
    $('.timeDeviceAnalysis').text(' ' + $('#fridge-time').find('option:selected').text());
    $('.FridgeDeviceAnalysis').text(' ' + number);

    return new Promise((resolve, reject) => {
        $.get('demo.php', { val: value, fridge: fridgeNo, time: time }, function (response) {
            fridgeData = JSON.parse(response).fridge_info;
            //handleData(fridgeData); 
            $('.doorDeviceAnalysis').text(' ' + JSON.parse(response).door_count);
            showAnalysis(JSON.parse(response).door_count, time);
            fridgeData.reverse();
            maxNumberofData = maxNumberofData * 2;
            var internalData = handleData(fridgeData),
                externalData = handleDataExtremeTemp(fridgeData);
            if (internalData.length > maxNumberofData) {
                var length = internalData.length - maxNumberofData
                internalData = internalData.slice(length, internalData.length)
            }
            if (externalData.length > maxNumberofData) {
                var length = externalData.length - maxNumberofData
                externalData = externalData.slice(length, externalData.length)
            }
            tempCharts(internalData, externalData);

            resolve(JSON.parse(response).fridge_info);
        });
    });
}

function showAnalysis(data, time) {
    var ideal = 0,
        fine = 0,
        warning = 0;
    if (time === 1) {
        if (data < 1) {
            ideal = 1;
        } else if (data == 1) {
            fine = 1;

        } else {
            warning = 1;
        }

    } else if (time === 5) {
        if (data <= 1) {
            ideal = 1;
        } else if (data >= 2 && data <= 4) {
            fine = 1;

        } else {
            warning = 1;

        }

    } else if (time === 30) {
        if (data <= 3) {
            ideal = 1;
        } else if (data >= 4 && data <= 8) {
            fine = 1;

        } else {
            warning = 1;
        }

    } else if (time === 60) {
        if (data <= 5) {
            ideal = 1;

        } else if (data >= 6 && data <= 12) {
            fine = 1;

        } else {
            warning = 1;

        }

    } else if (time === 720) {
        if (data <= 10) {
            ideal = 1;

        } else if (data >= 11 && data <= 25) {
            fine = 1;

        } else {

        }

    } else if (time === 1440) {
        if (data <= 15) {
            ideal = 1;

        } else if (data >= 16 && data <= 35) {
            fine = 1;
        } else {
            warning = 1;
        }

    }
    $('#refig-status').removeAttr('class');
    if (ideal) {
        $('#refrigeratorStatus').text('Ideal');

        $('#refig-status').addClass('refig-status-ideal');
    } else if (fine) {
        $('#refrigeratorStatus').text('Caution');
        $('#refig-status').addClass('refig-status-fine');
    } else {
        $('#refrigeratorStatus').text('Need Maintenance');
        $('#refig-status').addClass('refig-status-warn');
    }

}

// getFridgeData (fridgeNo, fridgeTime);
// setInterval(function(){
//     getFridgeData(fridgeNo, fridgeTime);
// }, 60000);
