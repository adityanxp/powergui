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
#include<fcntl.h>
#include<unistd.h>
#include <sys/ioctl.h>
#include <linux/i2c-dev.h>

/*  STEPs  */
//read data from device
// arrange data into msb and lsb
// check Full resolution and range(2g/4g/8g/16g) according to this how many bits data need to extract 
// convert 2s compliment because register data is in 2s compliment format
// and apply scaling factor according to range and Resolution


/*
 *  check register 0x31 value D1,D0 for range D3 for FullResolution status

 range	 | bit(FullRes)    mask     scale_factor      |     bit(normal)    mask     scale_factor   
 2g       |      10	  0x03ff	3.9	      |		10	   0x03ff	3.9
 4g	 |	11	  0x07ff	3.9	      |		10	   0x03ff	7.8
 8g	 |	12	  0x0fff	3.9	      |		10	   0x03ff	15.6
 16g	 |	13	  0x1fff	3.9	      |		10	   0x03ff	31.2

*/




int convert_register_into_data (char *xyz_data);
int function (int * data_x, int * data_y, int * data_z, int mask, float scale_factor, int bit);
int convert_2s(int data, int bit, int mask);


/*    convert 2's complement data into decimal      */
int convert_2s(int data, int bit, int mask)
{
	bit = bit - 1;
	if ((data >> bit & 1) == 0) {       // positive value
		data = data & mask;
	} else {                                        
		data= ((~(data)) + 1) & mask;    //negative value take 2s complement 
		data = -data;
	}
	return data;
}


int main()
{
	FILE *fp = NULL;
	unsigned char xyz_data[6] = {0};
	unsigned char x_data[8] = {0};
	unsigned char y_data[8] = {0};
	unsigned char z_data[8] = {0};
	unsigned char ret_reg_31[8] = {0};
	int data_x = 0;
	int data_y = 0;
	int data_z = 0;
	int ret = 0;
	int count = 0;
	int loop = 0;
	int range = 0;
	int bit = 0;
	int limit = 0;

	while (1)
	{

		//------------------------- i2cget implementation -------------------------------//
		system("i2cget -f -y 0 0x1d 0x32 w > /etc/sensor/i2cdata1.txt");	// 0x33 0x32  // MSB LSB
		system("i2cget -f -y 0 0x1d 0x34 w >> /etc/sensor/i2cdata1.txt");
		system("i2cget -f -y 0 0x1d 0x36 w >> /etc/sensor/i2cdata1.txt");
		
		//----------------------- find range by register 0x31 ----------------------------//
		system("i2cget -f -y 0 0x1d 0x31 >> /etc/sensor/i2cdata1.txt");

		fp = fopen("/etc/sensor/i2cdata1.txt", "r");
		if (fp < 0)
		{
			return 0;
		}

		fgets(x_data, 8, fp);
		x_data[6] = '\0';
		fgets(y_data, 8, fp);
		y_data[6] = '\0';
		fgets(z_data, 8, fp);
		z_data[6] = '\0';
		
		fgets(ret_reg_31, 8, fp);
		fclose(fp);
		
		//----------------------- convert hex to decimal ----------------------------------//
		data_x = (int)strtol(x_data, NULL, 0);
		data_y = (int)strtol(y_data, NULL, 0);
		data_z = (int)strtol(z_data, NULL, 0);

	//	printf("decimal: \ndata_x=%d\ndata_y=%d\ndata_z=%d\n",data_x,data_y,data_z);
		ret = ret_reg_31[3] - 48 ;
		range = ret & 0x03;

		//--------------------- check range and then mask with corresponding bit ---------------------//
		if (range == 0) {   					// 2g
			/* mask = 0x03ff  and scale = 3.9*/
			bit  = 10;
			limit = function (&data_x, &data_y, &data_z, 0x03ff, 3.9, bit);
		}
		else if(range == 1) {  					// 4g
			/* check Full_Resolution? by masking 0x08 */
			ret = ret & 0x08;
			if (ret) { 		//------------- FullResolution ----------------//
				/* mask = 0x07ff  and scale = 3.9  */
				bit = 11;
				limit = function (&data_x, &data_y, &data_z, 0x07ff, 3.9, bit);
			}
			else {
				/* mask = 0x03ff  and scale = 7.8  */
				bit = 10;
				limit = function (&data_x, &data_y, &data_z, 0x03ff, 7.8, bit);
			}
		}
		else if(range == 2) {  					// 8g
			/* check FR? */
			ret = ret & 0x08;
			if (ret) { //FR
				/* mask = 0x0fff  and scale = 3.9  */
				bit = 12;
				limit = function (&data_x, &data_y, &data_z, 0x0fff, 3.9, bit);
			}
			else {
				/* mask = 0x03ff  and scale = 15.6  */
				bit = 10;
				limit = function (&data_x, &data_y, &data_z, 0x03ff, 15.6, bit);
			}

		}
		else if(range == 3) {  					// 16g
			/* check FR? */
			ret = ret & 0x08;
			if (ret) { //FR
				/* mask = 0x1fff  and scale = 3.9  */
				bit = 13;
				limit = function (&data_x, &data_y, &data_z, 0x1fff, 3.9, bit);
			}
			else {
				/* mask = 0x03ff  and scale = 31.2  */
				bit = 10;
				limit = function (&data_x, &data_y, &data_z, 0x03ff, 31.2, bit);
			}
		}
	usleep(100000);
	}
	return 0;
}

int function (int * dataa_x, int* dataa_y, int * dataa_z, int mask, float scale_factor, int bit)
{
	int x = *dataa_x;
	int y = *dataa_y;
	int z = *dataa_z;
	int limit_check = 0;
	FILE *fd = NULL, *fd1 = NULL, *total_sensor = NULL;
	int i =0, sensor_count = 0;;
	char new_value[500] = {0}, new_value1[500] = {0}, push_cmd[50] = {}, buffer_sensor[5] = {};

	float x_axis = 0;
	float y_axis = 0;
	float z_axis = 0;
	float x_temp = 0, y_temp = 0, z_temp = 0, a = 1.3, b = 1.2, c = 1.0;

	//x = x & mask;
	x = convert_2s(x, bit, mask);
	x_axis = (x * scale_factor * 10)/1000.0;

	//y = y & mask;
	y = convert_2s(y, bit, mask);
	y_axis = (y * scale_factor * 10)/1000.0;

	//z = z & mask;
	z = convert_2s(z, bit, mask);
	z_axis = (z * scale_factor * 10)/1000.0;

	total_sensor = fopen("/etc/sensor/total_sensor.txt", "r");
	fgets(buffer_sensor, 3, total_sensor);
	sscanf(buffer_sensor, "%d", &sensor_count);
	fclose(total_sensor);

	fd = fopen("/etc/sensor/data1.txt", "w");
	fd1 = fopen("/etc/sensor/data2.txt", "w");
	sprintf(new_value,"A-XYZ: %.3f %.3f %.3f$", x_axis, y_axis, z_axis);
	fputs(new_value, fd);
	sprintf(new_value1,"RPUSH accel%d %.3f %.3f\r\n", i+1, x_axis, y_axis);
	fputs(new_value1, fd1);

	for (i = 2; i <= sensor_count; i++)
	{
		//x_temp = x_axis + (5.0 / i);
		//y_temp = y_axis + (6.0 / i) + 1;
		//z_temp = z_axis - (8.0 / i);
		x_temp = (((float)rand()/(float)(RAND_MAX)) * a);
                y_temp = (((float)rand()/(float)(RAND_MAX)) * b);
                z_temp = (((float)rand()/(float)(RAND_MAX)) * c);
	sprintf(new_value,"A-XYZ: %.3f %.3f %.3f$", x_temp, y_temp, z_temp);
	fputs(new_value, fd);
	sprintf(new_value1,"RPUSH accel%d %.3f %.3f\r\n", i, x_temp, y_temp);
	fputs(new_value1, fd1);
	}
	fclose(fd);
	fclose(fd1);
	sprintf(push_cmd, "cat /etc/sensor/data2.txt | redis-cli --pipe");
        system(push_cmd);
}

