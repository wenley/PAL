#!/bin/bash
# Requires ticket number as argument

# Get Names of javascript files
grep /javascript/ bblegit.txt | cut -d'"' -f4 | cut -d'?' -f1 > jsnames1.txt
grep /webapps/ bblegit.txt | cut -d'"' -f4 | cut -d'?' -f1 > jsnames2.txt
head -n 7 jsnames2.txt > jsnames3.txt

for o in `cat jsnames1.txt`
do
    curl https://blackboard.princeton.edu/$o > $o
done

# curl https://blackboard.princeton.edu/webapps/portal/frameset.jps?useCas=1&ticket=$1