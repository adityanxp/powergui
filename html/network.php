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
$ip = $_GET['ip'];
$username = $_GET['user'];
$password = $_GET['pass'];


if ($val == 1) {


	$output = shell_exec("sh /etc/tsn/autocheck.sh $ip");
	if ($output == 1) {
		shell_exec("touch /etc/tsn/qbv.txt");
		shell_exec("chmod 777 /etc/tsn/qbv.txt");
		shell_exec("echo 0 > /etc/tsn/qbv.txt");
		shell_exec("touch /etc/tsn/iperf_tower.txt");
		shell_exec("chmod 777 /etc/tsn/iperf_tower.txt");
		shell_exec("echo 0 > /etc/tsn/iperf_tower.txt");
		shell_exec("rm /etc/tsn/userDetails.txt");
		shell_exec("touch /etc/tsn/userDetails.txt");
		shell_exec("chmod 777 /etc/tsn/userDetails.txt");
		shell_exec("echo $username > /etc/tsn/userDetails.txt");
		shell_exec("echo $ip >> /etc/tsn/userDetails.txt");
		shell_exec("echo $password >> /etc/tsn/userDetails.txt");
		shell_exec("echo $val >> /etc/tsn/userDetails.txt");
		shell_exec("touch /etc/tsn/camera_stream.txt");
		shell_exec("chmod 777 /etc/tsn/camera_stream.txt");
		shell_exec("echo 0 > /etc/tsn/camera_stream.txt");
		#shell_exec("/etc/tsn/standard");
		$output1=shell_exec("python /etc/tsn/iperfserver.py start $username $ip $password");
#		$output1=exec("python /var/www/html/iperfserver.py start $username $ip $password");
		if ($output1 == "true\n") {
			$camera_stream = shell_exec("cat /etc/tsn/camera_stream.txt");
			if ($camera_stream == 1) {
				$response['camera'] = true;
			} else {
				$response['camera'] = false;
				shell_exec("/etc/tsn/no_qbv");
			}
			$response['status'] = true;
			$response['credential'] = true;
		}
		else {
			$response['status'] = true;
			$response['credential'] = false;
		}
		$response['ip'] = $ip; 
		$response['user'] = $username; 
		$response['pass'] = $password; 
		echo json_encode($response); 
	} else {
		$response['status'] = false;
		echo json_encode($response);
	}
}
else if ($val == 2) {
	#$output = shell_exec("python /etc/tsn/iperfserver.py stop $username $ip $password");
	$output = shell_exec("sh /etc/tsn/killprocess.sh");
	shell_exec("/etc/tsn/no_qbv");
	#	shell_exec("./motor MOTOR1 OFF MOTOR2 OFF MOTOR1_SPEED 0 MOTOR2_SPEED 0");
	#        shell_exec("echo 0 > /etc/tsn/motor.txt");
	shell_exec("echo 0 > /etc/tsn/iperf_tower.txt");
	$response['status'] = true;
	echo json_encode($response);
}
else if ($val == 3) {
	$output = shell_exec("sh /usr/htdocs/autocheck.sh $ip");
	if ($output == 1) {
		shell_exec("rm /usr/htdocs/userDetails.txt");
		shell_exec("touch /usr/htdocs/userDetails.txt");
		shell_exec("chmod 777 /usr/htdocs/userDetails.txt");
		shell_exec("echo $username > /usr/htdocs/userDetails.txt");
		shell_exec("echo $ip >> /usr/htdocs/userDetails.txt");
		shell_exec("echo $password >> /usr/htdocs/userDetails.txt");
		shell_exec("echo $val >> /usr/htdocs/userDetails.txt");
		$output2=shell_exec("python /usr/htdocs/iperfclient.py start $username $ip $password");
		if ($output2 == "true\n") {                                                            
			$response['status'] = true;                                                    
			$response['credential'] = true;             
		}                                                   
		else {                                              
			$response['status'] = true;                 
			$response['credential'] = false;            
		}
		$response['status'] = true;
		$response['ip'] = $ip;
		$response['user'] = $username;
		$response['pass'] = $password;
		echo json_encode($response);
	} else {
		$response['status'] = false;
		echo json_encode($response);
	}
}
else if ($val == 4) {
	$output = shell_exec("python /usr/htdocs/iperfclient.py stop $username $ip $password");
	shell_exec("sh /usr/htdocs/qbv.sh 0");
	$response['status'] = true;                                                            
	echo json_encode($response);
}
else if ($val == 5) {
	shell_exec("/etc/tsn/no_qbv");
	$response['status'] = true;
	echo json_encode($response);
}
else if ($val == 6) {

	$ping1=shell_exec("ping -c 2 -q 172.15.0.101 | grep received | awk {'print $4'}");
	$ping2=shell_exec("ping -c 2 -q 172.15.0.102 | grep received | awk {'print $4'}");

	if($ping1 == 0 || $ping2 == 0){
		$response['status'] = false;
		echo json_encode($response);
	} else {
		$rpm = $_GET['rpm'];
		shell_exec("/etc/tsn/sync $rpm");
		$response['status'] = true;                                                   
		echo json_encode($response);
	}
}
else if ($val == 7) {
	$output=shell_exec("cat /sys/class/net/swp1/operstate");
	if($output == "up\n") {
	#$ping3=shell_exec("ping -c 3 -q 172.15.0.2 | grep received | awk {'print $4'}");
	#if($ping3 != 0){
		shell_exec("echo 1 > /etc/tsn/camera_stream.txt");
		$response['status'] = true;
		echo json_encode($response);
	}
	else
	{
		$response['status'] = false;
		echo json_encode($response);
	}
}
else if ($val == 8) {
	$output=shell_exec("cat /sys/class/net/swp1/operstate");
	if($output == "up\n") {
	#$ping3=shell_exec("ping -c 3 -q 172.15.0.2 | grep received | awk {'print $4'}");
	#if($ping3 != 0){
		shell_exec("echo 0 > /etc/tsn/camera_stream.txt");
		$response['status'] = true;
		echo json_encode($response);
	}
	else
	{
		$response['status'] = false;
		echo json_encode($response);
	}
}
else if ($val == 9) {
	shell_exec("sh /etc/powergui/cpucontrol.sh 4");
	shell_exec("/var/www/html/killall");
	shell_exec("sh /var/www/html/CPU/check.sh");
	$output=shell_exec("cat /var/www/html/CPU/check.txt");
	if ($output == 1)
	{
	$response['status'] = true;
	echo json_encode($response);
	}else
	{
	$response['status'] = 'false';
        echo json_encode($response);
	}
}
?>
