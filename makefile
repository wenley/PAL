

# ---------------------------------------------------
# Clean-up
# ---------------------------------------------------

clean:
	rm *.txt

# ------------------------------------------------
# BLACKBOARD RECIPES
# -------------------------------------------------
BB=https://blackboard.princeton.edu
BBLEGIT=bblegit.txt

BBsource:
	mkdir $@
	cp other/$(BBLEGIT) $@/

BBjsfiles: BBsource jsnames1.txt jsnames2.txt
	for o in `cat jsnames1.txt`; \
	do\
		a=$${o##*/}; \
		curl $(BB)/javascript/$$a > $</$$a; \
	done;
	for o in `cat jsnames2.txt`; \
	do\
		a=$${o##*/}; \
		curl $(BB)/webapps/gradebook/js/$$a > $</$$a; \
	done;
	rm jsnames1.txt jsnames2.txt
	touch $@

BBjsall.js: BBsource BBjsfiles
	rm -f $</$@
	for o in `ls $</*.js`; \
	do\
		echo "\\n//$$o" >> $</$@; \
		cat $$o >> $</$@; \
	done;
	touch $@

jsnames1.txt: BBsource
	grep /javascript/ $</$(BBLEGIT) | cut -d'"' -f4 | cut -d'?' -f1 > jsnames1.txt

jsnames2.txt: BBsource jsnames1.txt
	grep /webapps/ $</$(BBLEGIT) | cut -d'"' -f4 | cut -d'?' -f1 > jsnamesTEMP.txt
	# !!! Has hard coded 7
	head -n 7 jsnamesTEMP.txt > jsnames2.txt
	rm -f jsnamesTEMP.txt

# ------------------------------------------------
# ICE RECIPES
# ---------------------------------------------------

ICE=http://ice.tigerapps.org/ICE3/war/ICE2.html
SOURCE_NAME=source.html

ICEsource:
	mkdir ICEsource
	curl $(ICE) > $@/$(SOURCE_NAME)

ICEjsfiles: ICEsource
	# grep js $</$(SOURCE_NAME) > $</jsnames1.txt
	curl http://ice.tigerapps.org/ICE3/war/ice2/ice2.nocache.js > $</ice2.nocache.js
	# ICE was probably built using GWT