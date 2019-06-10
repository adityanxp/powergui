#!/bin/sh

#Clone all the files from git and placed at location /var/www/html on board.
#Give the permission to the script: chmod 777 build_all.sh.
#Run the script: ./build_all.sh

#check if there is html directory is availble or not and copy the files
#mkdir -p /var/www/html
#cp -r /var/www/html/frwy-ls1046a-ui/* /var/www/html/
#rm -rf /var/www/html/frwy-ls1046a-ui
cp -r html /var/www/

#Remove  any old version of source code
rm -rf /etc/powergui > /dev/null 2>&1
rm -rf /etc/ml > /dev/null 2>&1
rm -rf /etc/sensor > /dev/null 2>&1

#Copy the souce code to the etc directory 
cp -r /var/www/html/source_code/ml /etc
cp -r /var/www/html/source_code/sensor /etc
cp -r /var/www/html/source_code/powergui /etc
cp -r /var/www/html/source_code/firstrun /etc/init.d/
ln -s /etc/init.d/firstrun /etc/rc5.d/S02firstrun
cp -r /var/www/html/source_code/hostapd.conf /etc
cp -r /var/www/html/source_code/dnsmasq.conf /etc
rm -rf /var/www/html/source_code

#Compile the binaries for machine learning demo and change the permission
rm /etc/ml/start_docker > /dev/null 2>&1
rm /etc/ml/stop_docker > /dev/null 2>&1
gcc -o /etc/ml/start_docker /etc/ml/start_docker.c
gcc -o /etc/ml/stop_docker /etc/ml/stop_docker.c
chmod 777 -R /etc/ml

#Compile the binarires for UI and change the permission
rm /var/www/html/killall > /dev/null 2>&1
gcc /var/www/html/killall.c -o /var/www/html/killall
chmod 777 /var/www/html/killall
rm /var/www/html/refrigerator/cpu_core > /dev/null 2>&1
rm /var/www/html/refrigerator/php_start > /dev/null 2>&1
rm /var/www/html/refrigerator/php_stop > /dev/null 2>&1
rm /var/www/html/refrigerator/pop1 > /dev/null 2>&1
rm /var/www/html/refrigerator/pop > /dev/null 2>&1
rm /var/www/html/refrigerator/push > /dev/null 2>&1
gcc /var/www/html/refrigerator/cpu_core.c -o /var/www/html/refrigerator/cpu_core
gcc /var/www/html/refrigerator/php_start.c -o /var/www/html/refrigerator/php_start
gcc /var/www/html/refrigerator/php_stop.c -o /var/www/html/refrigerator/php_stop
gcc /var/www/html/refrigerator/pop1.c -o /var/www/html/refrigerator/pop1
gcc /var/www/html/refrigerator/pop.c -o /var/www/html/refrigerator/pop
gcc /var/www/html/refrigerator/push.c -o /var/www/html/refrigerator/push
chmod 777 /var/www/html/refrigerator/cpu_core
chmod 777 /var/www/html/refrigerator/php_start
chmod 777 /var/www/html/refrigerator/php_stop
chmod 777 /var/www/html/refrigerator/pop1
chmod 777 /var/www/html/refrigerator/pop
chmod 777 /var/www/html/refrigerator/push
cp /var/www/html/refrigerator/pop1 /usr/bin
cp /var/www/html/refrigerator/pop /usr/bin
cp /var/www/html/refrigerator/push /usr/bin
chmod 777 /usr/bin/push
chmod 777 /usr/bin/pop
chmod 777 /usr/bin/pop1
chmod 777 -R /var/www/html

#Change the permission of Refrigeration source code
chmod 777 -R /etc/powergui

#Compile the binarires for Sensor Data Analytics Demo and change the permission
rm /etc/sensor/cpu_core > /dev/null 2>&1
rm /etc/sensor/generate_data > /dev/null 2>&1
rm /etc/sensor/read_data > /dev/null 2>&1
rm /etc/sensor/read_data1 > /dev/null 2>&1
rm /etc/sensor/read_data2 > /dev/null 2>&1
rm /etc/sensor/read_data3 > /dev/null 2>&1
rm /etc/sensor/total_sensor.txt > /dev/null 2>&1
gcc /etc/sensor/cpu_core.c -o /etc/sensor/cpu_core
gcc /etc/sensor/generate_data.c -o /etc/sensor/generate_data
gcc /etc/sensor/read_data.c -o /etc/sensor/read_data
gcc /etc/sensor/read_data1.c -o /etc/sensor/read_data1
gcc /etc/sensor/read_data2.c -o /etc/sensor/read_data2
gcc /etc/sensor/read_data3.c -o /etc/sensor/read_data3
chmod 777 -R /etc/sensor/

