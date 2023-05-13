#!/bin/bash
iptables -nvL -t nat | grep DNAT
