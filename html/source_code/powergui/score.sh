: '
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
'

#!/bin/bash

rm /etc/powergui/result/score.txt
scale=1000
file="/sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq"
c=`ps -ef | grep  -c 'bash'` # To support multiple coremark/dhrystone execution

if [ "$1" == "A" ]
then
    for cpu in `(cat /etc/powergui/processor)`
    do
        taskset -c $cpu coremark | grep "Iterations/Sec" | awk '{print $3}' | tr -s '.' ' '| awk '{print $1}' >> /etc/powergui/result/result$c.txt &
	sensors | grep power1 | awk '{print $2}' > /etc/powergui/result/power$c.txt
    done
    sar -u 1 3 | grep Average | awk '{print $3}' > /etc/powergui/result/cpuusage$c.txt
    #sh /etc/powergui/CpuUsage.sh 5 1
    sleep 30
    sensors | grep temp2 | awk '{print $2}' | cut -c 2-5 | head -1 > /etc/powergui/result/temp$c.txt
    freq=$(cat $file)
    echo $((freq / scale)) > /etc/powergui/result/freq$c.txt

elif [ "$1" == "B" ]
then
    for cpu in `(cat /etc/powergui/processor)`
    do
        taskset -c $cpu echo 300000000 | dhrystone |grep 'VAX MIPS'|awk '{print $5}'|tr '.' ' '|awk '{print $1}'  >> /etc/powergui/result/result$c.txt &
	sensors | grep power1 | awk '{print $2}' > /etc/powergui/result/power$c.txt
    done
    sar -u 1 3 | grep Average | awk '{print $3}' > /etc/powergui/result/cpuusage$c.txt
#   sh /etc/powergui/CpuUsage.sh 5 1
    sleep 30
    sensors | grep temp2 | awk '{print $2}' | cut -c 2-5 | head -1 > /etc/powergui/result/temp$c.txt
    freq=$(cat $file)
    echo $((freq / scale)) > /etc/powergui/result/freq$c.txt

elif [ "$1" == "C" ]
then
    sleep 1.3
    cat /etc/powergui/coreStatus > /etc/powergui/result/core_value$c.txt
    sensors | grep power1 | awk '{print $2}' > /etc/powergui/result/power$c.txt
    sensors | grep temp2 | awk '{print $2}' | cut -c 2-5 | head -1 > /etc/powergui/result/temp$c.txt
    freq=$(cat $file)
    echo $((freq / scale)) > /etc/powergui/result/freq$c.txt
fi

if [ "$1" == "C" ]
then
    cat /etc/powergui/result/core_value$c.txt >> /etc/powergui/result/temp1$c.txt
    cat /etc/powergui/result/power$c.txt >> /etc/powergui/result/temp1$c.txt
    cat /etc/powergui/result/freq$c.txt >> /etc/powergui/result/temp1$c.txt
    cat /etc/powergui/result/temp$c.txt >> /etc/powergui/result/temp1$c.txt
elif [ "$1" == "B" ]
then
    sh /etc/powergui/benchmark.sh /etc/powergui/result/result$c.txt
    cat /etc/powergui/result/benchmark.txt >> /etc/powergui/result/temp1$c.txt
    cat /etc/powergui/result/cpuusage$c.txt >> /etc/powergui/result/temp1$c.txt
    cat /etc/powergui/result/power$c.txt >> /etc/powergui/result/temp1$c.txt
    cat /etc/powergui/result/temp$c.txt >> /etc/powergui/result/temp1$c.txt
    cat /etc/powergui/result/freq$c.txt >> /etc/powergui/result/temp1$c.txt
else
    sh /etc/powergui/benchmark.sh /etc/powergui/result/result$c.txt
    cat /etc/powergui/result/benchmark.txt >> /etc/powergui/result/temp1$c.txt
    cat /etc/powergui/result/cpuusage$c.txt >> /etc/powergui/result/temp1$c.txt
    cat /etc/powergui/result/power$c.txt >> /etc/powergui/result/temp1$c.txt
    cat /etc/powergui/result/temp$c.txt >> /etc/powergui/result/temp1$c.txt
    cat /etc/powergui/result/freq$c.txt >> /etc/powergui/result/temp1$c.txt
fi

cat /etc/powergui/result/temp1$c.txt | tr -s '\n' '$' > /etc/powergui/result/score$c.txt
cat /etc/powergui/result/score$c.txt

cp -r /etc/powergui/result/score$c.txt /etc/powergui/result/score.txt
rm /etc/powergui/result/power$c.txt
rm /etc/powergui/result/cpuusage$c.txt
rm /etc/powergui/result/temp1$c.txt
rm /etc/powergui/result/core_value$c.txt
rm /etc/powergui/result/temp$c.txt
rm /etc/powergui/result/freq$c.txt
rm /etc/powergui/result/coremark$c.txt
rm /etc/powergui/result/score$c.txt
rm /etc/powergui/result/result$c.txt
rm /etc/powergui/result/benchmark.txt
