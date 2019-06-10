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

if [ "$1" == "static" ]
then
    interface=$2; ip=$3; subnet=$4; gateway=$5;
    ifconfig $interface $ip netmask $subnet up 
    route add default gw $gateway dev $interface
    echo true
elif [ "$1" == "dynamic" ]
then
    interface=$2;
    udhcpc -i $interface -t 3 -n
    echo true
else
    interface=$2;
    IP=`ifconfig "$interface" | grep inet | awk '{print $2}' | sed 's/addr://'`
    NM=`ifconfig "$interface" | grep "inet" | awk '{print $4}' | sed 's/Mask://'`
    GW=`route -n | grep -ni "$interface" | awk '{print $2}' | head -1`
    echo $IP\$$NM\$$GW > /etc/powergui/result/ipdetails.txt
    cat /etc/powergui/result/ipdetails.txt
fi