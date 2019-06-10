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

//cat > wrapper.c <<CONTENT
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int num_of_cores = 0;
int main (int argc, char *argv[])
{
	setuid (0);
	num_of_cores = atoi(argv[1]);

	/* WARNING: Only use an absolute path to the script to execute,
	 *          a malicious user might fool the binary and execute
	 *          arbitary commands if not.
	 * */

	if (num_of_cores == 2) {
		system ("echo 0 > /sys/devices/system/cpu/cpu2/online");
		system ("echo 0 > /sys/devices/system/cpu/cpu3/online");
	} else if (num_of_cores == 4) {
		system ("echo 1 > /sys/devices/system/cpu/cpu2/online");
		system ("echo 1 > /sys/devices/system/cpu/cpu3/online");
	}

	return 0;
}
//CONTENT
