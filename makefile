

BB=https://blackboard.princeton.edu


jsfiles: jsnames1.txt jsnames2.txt
	mkdir jsfiles
	for o in `cat jsnames1.txt`; \
	do\
		a=$${o##*/}; \
		curl $(BB)/javascript/$$a > $@/$$a; \
	done;
	for o in `cat jsnames2.txt`; \
	do\
		a=$${o##*/}; \
		curl $(BB)/webapps/gradebook/js/$$a > $@/$$a; \
	done;

jsnames1.txt: bblegit.txt
	grep /javascript/ bblegit.txt | cut -d'"' -f4 | cut -d'?' -f1 > jsnames1.txt

jsnames2.txt: bblegit.txt
	grep /webapps/ bblegit.txt | cut -d'"' -f4 | cut -d'?' -f1 > jsnamesTEMP.txt
	head -n 7 jsnamesTEMP.txt > jsnames2.txt
	rm -f jsnamesTEMP.txt

bblegit.txt:
	echo "Need to figure out how to automatically get ticket"