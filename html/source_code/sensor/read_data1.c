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

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include<unistd.h>
void pop();
int avg_interval = 0;
void main(int argc, char **argv)
{
//	time_t t;
	avg_interval = atoi(argv[1]);
	printf("avg_interval = %d\n", avg_interval);
	while (1) {
//		t = time(NULL);
		pop();
//		t = time(NULL) - t;
//		printf("pop() took %ld seconds to execute \n", t);
	}
}
void pop()
{
	FILE *fp = NULL, *total_sensor1 = NULL, *faulty_sensor1 = NULL;;
	static int sensor[40] = {0}, min_count = 0;
	float values[40][2] = {0}, value = 0, ax = 0, ay = 0, az = 0;
	char buffer[30] = {}, redis[30]={}, buffer_sensor1[5] = {}, faulty_sensor_string1[30] = {}, del_file1[35] = {};
	int i = 0, j = 0, sensor_count1 = 0;

	min_count++;
	total_sensor1 = fopen("/etc/sensor/total_sensor.txt", "r");
        fgets(buffer_sensor1, 3, total_sensor1);
        sscanf(buffer_sensor1, "%d", &sensor_count1);
        fclose(total_sensor1);
	if (sensor_count1 < 20) {
		sprintf(del_file1, "rm /etc/sensor/faulty_sensor1.txt");
		system(del_file1);
		sleep (2);
		return;
	}
	for (i = 11; i <= 20; i++) {
		for (j = 0; j < 2; j++) {
			sprintf(redis, "redis-cli LPOP accel%d", i);
			fp=popen(redis, "r");
			fgets(buffer, 10, fp);
			sscanf(buffer, "%f", &value);
			pclose(fp);
			values[i][j] = value;
			value = 0;
		}
		ax = values[i][0];
		ay = values[i][1];
		values[i][0] = 0;
		values[i][1] = 0;
		if ((ax > 1) || (ax < -1) || (ay > 1) || (ay < -1)) {
			sensor[i] = sensor[i] + 1;
		}
	}
	/* READING VALUES TO BE PROCESSED */
	if (min_count == avg_interval) {
		min_count = 0;
		faulty_sensor1 = fopen("/etc/sensor/faulty_sensor1.txt", "w");
		for (i = 11; i <= 20; i++) {
			if (sensor[i] > 10) {
				//printf(" sensor%d\n", i);
				sprintf(faulty_sensor_string1,"%d$", i);
				fputs(faulty_sensor_string1, faulty_sensor1);
			}
			sensor[i] = 0;
		}
		fclose(faulty_sensor1);
	}
	usleep(25000);
}
