#!/bin/bash

for line in $(iptables --line-numbers --list PREROUTING -t nat | grep -v num | grep -v Chain | cut -d" " -f1)
do
  iptables -t nat -D PREROUTING 1
done

for line in $(iptables --line-numbers --list POSTROUTING -t nat | grep -v num | grep -v Chain | cut -d" " -f1)
do
  iptables -t nat -D POSTROUTING 1
done

iptables -t nat -A POSTROUTING -o eth1 -j MASQUERADE
