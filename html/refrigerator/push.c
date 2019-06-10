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

#include<stdio.h>
#include<stdlib.h>
#include<time.h>
#include<unistd.h>
void push();
void main()
{
	time_t t;
	while (1) {
		printf("RECEIVING SENSOR'S VALUES . . . .\n");
		t = time(NULL);
		push();
		t = time(NULL) - t;

		printf("push() took %ld seconds to execute \n", t);
	}
}
	void push()
	{
		FILE *fd, *fridge;
		int i = 0, ran = 0, num_of_times = 0, it, et, ds, v, c;
		char new_value[40] = {}, buffer_fridge[5] = {}, push_cmd[70] = {};
		int fridge_count = 0;

		srand(time(NULL));
		fridge = fopen("/var/www/html/refrigerator/fridge_count.txt", "r");
		fgets(buffer_fridge, 4, fridge);
		sscanf(buffer_fridge, "%d", &fridge_count);
		fclose(fridge);
		fd = fopen("/var/www/html/refrigerator/data1.txt", "w");
		for (i = 1; i <= fridge_count; i++) {
			it=rand() % 10;
			et=rand() % 6 + 25;
			ds=10;
			v=rand() % 21 + 200;
			c=rand() % 101 + 100;
			sprintf(new_value, "RPUSH sensor%d %d %d %d %d %d\r\n", i, it, et, ds, v, c);
			fputs(new_value, fd);
		}
		fclose(fd);
		sleep(2);
		printf("RECEIVING COMPLETED !!!!\n");
		printf("SAVING VALUES IN DATABASE . . . .\n");
		sprintf(push_cmd, "cat /var/www/html/refrigerator/data1.txt | redis-cli --pipe");
		system(push_cmd);
		sleep(2);
		printf("DATABASE UPDATED WITH THE NEW VALUES !!!!\n\n");
		sleep(1);
	}

