#!/bin/bash
if iptables -nvL -t nat | grep DNAT | grep -wq "DNAT"; then 
    echo "Exists, skip" 
else 
    iptables -t nat -A PREROUTING -i tun1 -p tcp --source $1 -m tcp --dport 80 -j DNAT --to-destination 192.168.1.38
fi
