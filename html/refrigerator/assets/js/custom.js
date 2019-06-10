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

var value = 1,
    fridge_num = 1,
    checkStartInterval = '';
function getData(i) {
    $.get('demo.php', { val: value, fridge: newFridgeNumber }, function (response) {
        var frigde_number = JSON.parse(response);


        $("#it-f" + i).text(int_temp);
        $("#et-f" + i).text(ext_temp);

        var fr = frigde_number.output;

        var a = 0, b = 0;
        for (var x = 1; x <= newFridgeNumber; x++) {
            //console.log(fr[x]);
            var int_temp = fr[x][0];
            var ext_temp = fr[x][1];
            var state = fr[x][2];

            $(fr).each(function () {
                $("#int-temp").append('<ul><li>Refrigerator ' + x + '</li><li>' + int_temp + '&deg;C</li></ul>');
                $("#ext-temp").append('<ul><li>Refrigerator ' + x + '</li><li>' + ext_temp + '&deg;C</li></ul>');

                $('#asset').append('<option value="' + x + '">Refrigerator ' + x + '</option>');
                $('#asset').find('option[value=' + fridge_num + ']').attr('selected', true);

                // var currentTime = new Date();
                //var upCt = currentTime.toString();
                var updatedTime = moment().format('ddd MMM D YYYY h:mm:ss a');

                if (state === 1) {
                    $('#high-alert ul').append('<li><span>Refrigerator ' + x + '</span><i class="icon icon-danger"></i></li>');
                    $('#alert-history-in').append('<ul class="alert-history-body"><li>' + updatedTime + '</li><li>Refrigerator ' + x + ' Door was open for more than 5 sec</li></ul>');

                    // console.log(updatedTime);
                }

                var door = '';

                if (state === 0) {
                    door = 'close';
                    a++;

                } else {
                    door = 'open';
                    b++;

                    $("#fridge-state").append('<li><div class="fridge-icon ' + door + '"><span class="badge">' + x + '</span></div></li>');
                }

            });

        }
        working = a * 100 / newFridgeNumber;
        var temp = working.toFixed(2);
        working = parseFloat(temp);
        console.log(working);

        notWorking = b * 100 / newFridgeNumber;
        var temp1 = notWorking.toFixed(2);
        notWorking = parseFloat(temp1);
        console.log(notWorking);

        accChart()

    }).fail(function () {
        console.log('Error');
    });
}



function selectFridge() {
    var i = 1;
    getData(i);
}

function getCpuData() {
    return new Promise((resolve, reject) => {
        var url = window.location.origin;
        $.ajax({
            url: url + ':19999/api/v1/data?chart=system.cpu&format=array&points=360&group=average&options=absolute|jsonwrap|nonzero&after=-360&_=1514353930176',
            async: true
        })
            .done(function (data) {
                resolve(data.result[0]);
            })
            .fail(function () {
                console.log('fail')
            });

    });


}

function accChart() {

    Highcharts.chart('accuracyChart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: working + '%',
            align: 'center',
            verticalAlign: 'middle',
            y: 5
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white'
                    }
                },
                startAngle: -180,
                endAngle: 180,
                center: ['50%', '50%']
            }
        },
        series: [{
            type: 'pie',
            name: 'Prediction Accuracy',
            innerSize: '50%',
            data: [
                {
                    name: 'Not Working', y: notWorking, color: 'red'
                },
                {
                    name: 'Working', y: working, color: 'green'
                }
            ]
        }]
    });
}
// $(document).ready(function(){
//     $('.login-submit').click(function(){
//         location.href('index.html');
//     })
// })
function onPressEnter(evt) {
    if (evt.keyCode === 13) {
        onSubmit();
    }

}

function onSubmit() {
    var userName = document.getElementById('username').value;
    var pass = document.getElementById('pass').value;

    if (userName === 'nxpuser@nxp.com' && pass === 'nxpuser1') {
        localStorage.setItem("userName", "nxpuser@nxp.com");
        localStorage.setItem("pass", "nxpuser1");

        window.location.href = "reports.html";
        return false;
    } else {
        document.getElementById('error').style.display = 'block';
    }
}

function selectRrf() {
    fridgeno = parseInt(document.getElementById('asset').value),
        time = document.getElementById('fridge-time').value;
    fridge_num = fridgeno;
    if (time == '1hr') {
        time = 60;
    } else if (time == '12hr') {
        time = 720;
    } else if (time == '24hr') {
        time = 1440;
    } else {
        time = parseInt(time);
    }
    if (!isNaN(fridgeno) || !isNaN(time)) {
        getFridgeData(fridgeno, time);
        selectFridge();
        $("#high-alert ul").text('');
        $("#int-temp ul").text('');
        $("#ext-temp ul").text('');
        $("#fridge-state").text('');
        $('#asset').text('');
        $('#alert-history-in').text('');
    }

}

function sendNoFridge(numberOfFridge) {
    var value = 2;
    //refreshTime = refreshTime/5000;
	newFridgeNumber = numberOfFridge;
    $.get('demo.php', { val: value, fridge: numberOfFridge }, function (response) {
        selectFridge();
        $("#high-alert ul").text('');
        $("#int-temp ul").text('');
        $("#ext-temp ul").text('');
        $("#fridge-state").text('');
        $('#asset').text('');
        $('#alert-history-in').text('');
    });
}

function logout() {
    var value = 7;
/*    setTimeout(function(){
        window.location.href = 'index.html';
    }, 2000)
*/    $.get('demo.php', { val: 7 }, function (response) {
        localStorage.removeItem("userName");
        localStorage.removeItem("pass");
        window.location.href = 'index.html';
    });
}

function stop() {
    var value = 7;
    $.get('demo.php', { val: 7 }, function (response) {
        $('.start').attr('disabled', false);
        $('.stop').attr('disabled', true);
        $('#start').removeAttr('disabled');
        clearInterval(timeInterval);
        $("#high-alert ul").text('');
        $("#int-temp ul").text('');
        $("#ext-temp ul").text('');
        $("#fridge-state").text('');
        $('#asset').text('');
        $('#alert-history-in').text('');
        $('#accuracyChart').text('');
        $('#tempChart').empty();
        $('#getInfo').attr('disabled', true);
        $('#saveFridgeTime').attr('disabled', true);
        $('.FridgeDeviceAnalysis').text('');
        $('.timeDeviceAnalysis').text('');
        $('.doorDeviceAnalysis').text('');
        $('#refrigeratorStatus').text('');
        $('#refig-status').removeAttr('class');
        $('#total-refrigerators').prepend(' <option value="" selected></option>');
	pressStart = false;
        checkStartInterval = setTimeout(function(){
            checkStart();
        },10000);
    });
}
function redirect() {
    var url = window.location.origin + ':19999/';
    window.open(url)
}


function start() {
    $('#getInfo').removeAttr('disabled');
    $('#saveFridgeTime').removeAttr('disabled');
    $.get('demo.php', { val: 4 }, function (response) {
        newFridgeNumber = JSON.parse(response).fridge_count;
        $('#total-refrigerators').find('option[value=' + newFridgeNumber + ']').attr('selected', true);
        $('#total-refrigerators').find('option[value=' + newFridgeNumber + ']').prop('selected', true);
        var numberofRef =  $('#total-refrigerators').val();
        if(coreData === 2 && numberofRef === '400'){
           sendNoFridge('300');
           $('#total-refrigerators').find('option[value=' + 300 + ']').attr('selected', true);
		   $('#total-refrigerators').find('option[value=' + 300 + ']').prop('selected', true);
       
        }
        startInterval();
        selectFridge();
        getFridgeData(fridgeNo, fridgeTime);
        function startInterval() {
            timeInterval = setInterval(function () {
                $.get('demo.php', { val: 9 }, function (data) {
                    coreData = JSON.parse(data).core;
                    if(JSON.parse(data).core === '2' || JSON.parse(data).core === 2){
                        $('#total-refrigerators').find('option[value=' + 400 + ']').hide();
                      
                     }
                    $('#cores').find('option[value=' + JSON.parse(data).core + ']').prop('selected', true);
                    $.get('demo.php', { val: 6 }, function (response) {
                        var status = JSON.parse(response).status;
                        if (status == 'true') {
                            selectFridge();
                            $("#high-alert ul").text('');
                            $("#int-temp ul").text('');
                            $("#ext-temp ul").text('');
                            $("#fridge-state").text('');
                            $('#asset').text('');
                            $('#alert-history-in').text('');
                            getFridgeData(fridgeNo, fridgeTime);
                        } else {
                            stop();
                        }
                    });
            });
            }, defaultRefreshTime);
        }
    });

}
var coreData = 4;
function checkStart(){
    $.get('demo.php', { val: 9 }, function (data) {
        coreData =JSON.parse(data).core
        $('#cores').find('option[value=' + JSON.parse(data).core + ']').prop('selected', true);
        if( JSON.parse(data).core === '2' || JSON.parse(data).core === 2){
            $('#total-refrigerators').find('option[value=' + 400 + ']').hide();
          
         }
       
        $.get('demo.php', { val: 6 }, function (response) {
        var status = JSON.parse(response).status;
        if (status == 'true') {
        //   clearInterval(checkStartInterval);
        checkStartInterval = 0;
        $('#getInfo').removeAttr('disabled');
            $('#saveFridgeTime').removeAttr('disabled');
            $('.overlay').hide();
            $('#start').attr('disabled', true);
        if (!pressStart) {
                $('#total-refrigerators').find('option')[0].remove()
                start();
        }
        } else{
            setTimeout(function(){
                checkStart();
            },10000);
        }
    });
});
}

function saveCores (){
 var cores =  $('#cores').val();
 var numberofRef =  $('#total-refrigerators').val();
 coreData = parseInt($('#cores').val());

 if(cores === '2'){
    $('#total-refrigerators').find('option[value=' + 400 + ']').hide();
  
 }else{
    $('#total-refrigerators').find('option[value=' + 400 + ']').show();
 }
 if(cores === '2' && numberofRef === '400'){
    sendNoFridge('300');
    $('#total-refrigerators').find('option[value=' + 300 + ']').attr('selected', true);
	    $('#total-refrigerators').find('option[value=' + 300 + ']').prop('selected', true);


 }
 $.get('demo.php', { val: 8, core: cores }, function (data) {

 });
}

function redirect() {
    var url = window.location.origin + ':19999/';
    window.open(url)
}