<?php
/*
Copyright 2019 NXP

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
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

$val = $_GET['val'];
$sensor = $_GET['sensor'];
/*To get particular sensor data*/
if ($val == 1) {
	$output=shell_exec("cat /etc/sensor/data1.txt");
	$output_split = explode("$", $output);
	echo $output_split[$sensor - 1];
}
/* To get all sensor data to show in the table */
else if ($val == 2) {
	$output=shell_exec("cat /etc/sensor/data1.txt");
	echo $output;
}
/* To start the data generation unit */
else if ($val == 3) {
	$output=shell_exec("/etc/sensor/adxl.sh");
	$output=shell_exec("/etc/sensor/start_sensor_read.sh");
	$response['status'] = 'true';
	echo json_encode($response);
}
/* TO stop the data generation unit */
else if ($val == 4) {
	$output=shell_exec("/etc/sensor/stop_sensor_read.sh");
	$response['status'] = 'true';
	echo json_encode($response);
}
/* To Enable/Disable CPU cores */
else if ($val == 5) {
        $core = $_GET['core'];
        shell_exec("/etc/sensor/cpu_core $core");
        $response['status'] = 'true';
        echo json_encode($response);
}
/* To limit the number of total sensors */
else if ($val == 6) {
	$total_sensor = $_GET['total_sensor'];
	$output = shell_exec("echo $total_sensor > /etc/sensor/total_sensor.txt");
        $response['status'] = 'true';
        echo json_encode($response);
}
/* To get the mispositioned sensors */
else if ($val == 7) {
	$output=shell_exec("cat /etc/sensor/faulty_sensor.txt");
	$output1=shell_exec("cat /etc/sensor/faulty_sensor1.txt");
	$output2=shell_exec("cat /etc/sensor/faulty_sensor2.txt");
	$output3=shell_exec("cat /etc/sensor/faulty_sensor3.txt");
        echo $output."".$output1."".$output2."".$output3;
}

?>
