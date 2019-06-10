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

#!/bin/sh

CONTINUE=$1
SLEEP=$2
TotCPU=0

for i in `seq 1 $CONTINUE`
do
    previousStats=$(cat /proc/stat)

    sleep $SLEEP

    currentStats=$(cat /proc/stat)

    cpus=$(echo "$currentStats" | grep -w 'cpu' | awk -F " " '{print $1}')

    for cpu in $cpus
    do
        currentLine=$(echo "$currentStats" | grep "$cpu ")
        user=$(echo "$currentLine" | awk -F " " '{print $2}')
        nice=$(echo "$currentLine" | awk -F " " '{print $3}')
        system=$(echo "$currentLine" | awk -F " " '{print $4}')
        idle=$(echo "$currentLine" | awk -F " " '{print $5}')
        iowait=$(echo "$currentLine" | awk -F " " '{print $6}')
        irq=$(echo "$currentLine" | awk -F " " '{print $7}')
        softirq=$(echo "$currentLine" | awk -F " " '{print $8}')
        steal=$(echo "$currentLine" | awk -F " " '{print $9}')
        guest=$(echo "$currentLine" | awk -F " " '{print $10}')
        guest_nice=$(echo "$currentLine" | awk -F " " '{print $11}')

        previousLine=$(echo "$previousStats" | grep "$cpu ")
        prevuser=$(echo "$previousLine" | awk -F " " '{print $2}')
        prevnice=$(echo "$previousLine" | awk -F " " '{print $3}')
        prevsystem=$(echo "$previousLine" | awk -F " " '{print $4}')
        previdle=$(echo "$previousLine" | awk -F " " '{print $5}')
        previowait=$(echo "$previousLine" | awk -F " " '{print $6}')
        previrq=$(echo "$previousLine" | awk -F " " '{print $7}')
        prevsoftirq=$(echo "$previousLine" | awk -F " " '{print $8}')
        prevsteal=$(echo "$previousLine" | awk -F " " '{print $9}')
        prevguest=$(echo "$previousLine" | awk -F " " '{print $10}')
        prevguest_nice=$(echo "$previousLine" | awk -F " " '{print $11}')    

        PrevIdle=$((previdle + previowait))
        Idle=$((idle + iowait))

        PrevNonIdle=$((prevuser + prevnice + prevsystem + previrq + prevsoftirq + prevsteal))
        NonIdle=$((user + nice + system + irq + softirq + steal))

        PrevTotal=$((PrevIdle + PrevNonIdle))
        Total=$((Idle + NonIdle))

        totald=$((Total - PrevTotal))
        idled=$((Idle - PrevIdle))
        CPU_Percentage=$(awk "BEGIN {print ($totald - $idled)/$totald*100}")

        if [ "$cpu" = "cpu" ]; then
           TotCPU=$(echo "scale=2; $TotCPU + $CPU_Percentage" | bc -l)
        fi
    done
done

TotalAvgCPU=$(echo "scale=2; $TotCPU / $1" | bc -l)
echo $TotalAvgCPU > /etc/powergui/result/cpuusage.txt
