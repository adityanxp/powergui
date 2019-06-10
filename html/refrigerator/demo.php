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
/* To update all values evry minute */
	$i =1;
    if ($val == 1) {
    $fridge = $_GET['fridge'];
	while ($i <= $fridge) {
        $output = shell_exec("redis-cli LRANGE SENSOR$i 0 4");
	$output_split = preg_split("/\n/", $output);
        $OUTPUT[$i][0] = (int)$output_split[0];
        $OUTPUT[$i][1] = (int)$output_split[1];
        $OUTPUT[$i][2] = (int)$output_split[2];
        $OUTPUT[$i][3] = (int)$output_split[3];
        $OUTPUT[$i][4] = (int)$output_split[4];
	$i = $i + 1;
	}
        $response['output'] = $OUTPUT;
        $response['status'] = 'true';
        echo json_encode($response);
    }

/* To configure the average time interval */
    else if ($val == 2) {
    $fridge = $_GET['fridge'];
	$output = shell_exec("echo $fridge > /var/www/html/refrigerator/fridge_count.txt");
	$response['status'] = 'true';
	$response['output'] = $output;
        echo json_encode($response);
    }

/* To get information of a particular fridge */

    else if ($val == 3) {
    $fridge = $_GET['fridge'];
    $time = $_GET['time'];
    $j = 0;
	$nodes = 10 * $time - 1;
	$output = shell_exec("redis-cli LRANGE SENSOR$fridge 0 $nodes");
        $info_split = preg_split("/\n/", $output);
	while ($j <= $nodes) {
		$Fridge_info[$j] = (int)$info_split[$j];
		$j = $j + 1;
	}
	$k = 2;
	$door_count = 0;
	while ($k < $nodes) {
		if ($Fridge_info[$k] == 1)
			$door_count = $door_count + 1;
		$k = $k + 5;
	}
	$response['fridge_info'] = $Fridge_info;
	$response['door_count'] = $door_count;
	$response['status'] = 'true';
        echo json_encode($response);

    }

/* To get total number of fridge */
    else if ($val == 4) {
	$fridge_count = shell_exec("cat /var/www/html/refrigerator/fridge_count.txt");
	$response['fridge_count'] = $fridge_count;
	$response['status'] = 'true';
        echo json_encode($response);
    }

/* To start push, pop, pop1 */
    else if ($val == 5) {
	shell_exec("/var/www/html/refrigerator/php_start");
	$response['status'] = 'true';
        echo json_encode($response);
    }

/* To check whether processing is happening or not */
    else if ($val == 6) {
	$output=shell_exec("sh /var/www/html/refrigerator/check_push.sh");
	$output_split = preg_split("/\n/", $output);
	$response['status'] = $output_split[0];
        echo json_encode($response);
    }

/* To stop push, pop, pop1 */
    else if ($val == 7) {
	shell_exec("/var/www/html/refrigerator/php_stop");
	$response['status'] = 'true';
        echo json_encode($response);
    }

/* To enable/disable CPU cores */
    else if ($val == 8) {
    	$core = $_GET['core'];
	$output=shell_exec("sh /var/www/html/refrigerator/check_push.sh");
	if ($output === true) {
		shell_exec("/var/www/html/refrigerator/php_stop");
		shell_exec("/var/www/html/refrigerator/cpu_core $core");
		shell_exec("/var/www/html/refrigerator/php_start");
	} else {
		shell_exec("/var/www/html/refrigerator/cpu_core $core");
	}
	$response['status'] = 'true';
        echo json_encode($response);
    }

/* To get CPU Cores */
    else if ($val == 9) {
	$output=shell_exec("cat /sys/devices/system/cpu/online");
	$output_split = preg_split("/-/", $output);
	$response['core'] = (int)($output_split[1] + 1);
	$response['status'] = 'true';
        echo json_encode($response);
    }
?>
