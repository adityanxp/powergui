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
if [ $1 == 1 ]
then
	docker run --rm -td --name ncnn_server --net=host ncnn-face fr_server
	sleep 1
	docker run --rm -td --name ncnn_web --device=/dev/video0 --net=host ncnn-face python main.py --dev usb
	sleep 5
elif [ $1 == 2 ]
then
	#docker run -itd --net=host --privileged edswarthoutnxp/opencv4-flask-yolov2
	docker run -e CAMERA=opencv_dnn_yolov2 --rm -itd -p 5000:5000 --privileged -v /home/packages/model:/root/model --name yolov2 edswarthoutnxp/u1904-run-opencv_dnn-objdet
	sleep 5
elif [ $1 == 3 ]
then
	#docker run -itd --privileged -w /object_detection --net=host vvdn/object-detection /bin/bash -c "sh object_detection.sh start" 
	docker run -e CAMERA=opencv_dnn_2objdet --rm -itd -p 5000:5000 --privileged -v /home/packages/model:/root/model --name 2objdet edswarthoutnxp/u1904-run-opencv_dnn-objdet
	sleep 8
fi
exit 0
