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
	time_t t;
	avg_interval = atoi(argv[1]);
	printf("avg_interval = %d\n", avg_interval);
	while (1) {
	//#	printf("READING SENSOR'S ATTRIBUTES FROM DATABASE . . . .\n");
		t = time(NULL);
		pop();
		t = time(NULL) - t;
		printf("pop() took %ld seconds to execute \n", t);
	}
}
void pop()
{
	FILE *fp, *fridge_ptr;
	int a, b, c, d, e, value = 0; 
	int int_tmp,ext_tmp,door_state,voltage,current;
	int set_point = 4;
	int count = 0;
	int diff[400];
	int set_diff[400];
	int faulty[400] = {0}, fridge = 0, k = 0;
	static int min_count = 0, values[500][5] = {0};
	char buffer[30], redis[30]={}, redis1[50]={}, buffer_fridge[5] = {};
	int i = 1, j = 1, sum = 0, avg = 0, fridge_count = 0;
	int delay = 0;

	min_count++;
	fridge_ptr = fopen("/var/www/html/refrigerator/fridge_count.txt", "r");
	fgets(buffer_fridge, 4, fridge_ptr);
	sscanf(buffer_fridge, "%d", &fridge_count);
	fclose(fridge_ptr);
	if (fridge_count >= 200) {
		fridge_count = 200;
		delay = 1000;
	} else {
		delay = 20000;
	}
	for (i = 0; i < fridge_count; i++) {
		//printf("\n===sensor%d = ", i+1);
		sum = 0;
		for (j = 0; j < 5; j++) {
			sprintf(redis, "redis-cli LPOP sensor%d", i+1);
			//printf("calling redis\n");
			fp=popen(redis, "r");
			fgets(buffer, 5, fp);
			sscanf(buffer, "%d", &value);
			pclose(fp);
			if ((j == 0) && (value != 0)) {
				while (value >= 10) {
					sprintf(redis, "redis-cli LPOP sensor%d", i+1);
					printf("GARBAGE VALUE\n");
					fp=popen(redis, "r");
					fgets(buffer, 5, fp);
					sscanf(buffer, "%d", &value);
					pclose(fp);
				}
			}
			values[i][j] = values[i][j] + value;
		}
		usleep(delay);
	}
	//printf("READING VALUES TO BE PROCESSED\n");
	if (min_count == avg_interval) {
	//#	printf("==== CALCULATING AVERAGE ==== \n");
		min_count = 0;
		for (i = 0; i < fridge_count; i++) {
	//#		printf("\n==== sensor%d = ",i+1);
			for (j = 0; j < 5; j++) {
				values[i][j] = values[i][j]/avg_interval;
				//				printf("%d ", values[i][j]);
				//values[i][j] = 0;
			}
			int_tmp = values[i][0];
			ext_tmp = values[i][1];
			diff[i] = values[i][1] - values[i][0];
			door_state = 0;
			voltage = values[i][3];
			current = values[i][4]; 
			if (int_tmp >= set_point)
				set_diff[i] = int_tmp - set_point;
			else if (int_tmp < set_point)
				set_diff[i] = set_point - int_tmp;
			if (diff[i] > 20 && int_tmp < set_point) {}
	//#			printf("Door State Close and Fridge_%d is in GOOD STATE, Warming by %d degrees to reach set point\n",i+1,set_diff[i]);
			else if (diff[i] > 20 && int_tmp > set_point) {}
	//#			printf("Door State Close and Fridge_%d is in GOOD STATE, Cooling by %d degrees to reach set point\n",i+1,set_diff[i]);
			else if (diff[i] > 20 && int_tmp == set_point) {}
	//#			printf("Door State Close and Fridge_%d is in IDEAL STATE, Internal Temperature is equal to the required Set Point\n",i+1);
			else {
	//#			printf("Door State was open for more than 5 seconds, Please Check Fridge%d\n",i+1);
				count+=1;
				faulty[fridge] = i+1;
				fridge += 1;
				door_state = 1;
			}
			sprintf(redis1, "redis-cli LPUSH SENSOR%d %d %d %d %d %d", i+1, values[i][4], values[i][3], door_state, values[i][1], values[i][0]);
			system(redis1);
			values[i][0] = 0;
			values[i][1] = 0;
			values[i][2] = 0;
			values[i][3] = 0;
			values[i][4] = 0;
			printf("\n");
		}
	//#	printf("Number of Fridges in bad state = %d\n",count);
//		for (k = 0; k < count; k++) {
	//#		printf("-- Fridge -> %d\n", faulty[k]);
//		}
	//#	printf("DONE!!!\n");
	//#	printf("\n");
	}
}
