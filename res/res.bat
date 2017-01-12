rem 1. Change the output file path by yourself

outputfile=D:/Tomcat9/webapps/KGameDemo/res.js


rem 2. Specify your resources directory name

path="res"

 

:loopDir{

rem loopDir begin

for file in (*)
rem loopDir begin1
do 

if [ -d $file ] 

then 

echo "$file is directory" 

cd ./$file

goto loopDir

cd ..


elif [ -f $file ]

then

echo "$file is file"

if [ ${file##*.} = "png" -o ${file##*.} = "jpg" ] 

then

#echo "$extension"

echo "{type:\"image\", src:\"$path${PWD##*$path}/$file\"}," >>  $outputfile


elif [ ${file##*.} = "plist" ]

then

echo "{type:\"plist\", src:\"$path${PWD##*$path}/$file\"}," >>  $outputfile


elif [ ${file##*.} = "fnt" ]

then

echo "{type:\"fnt\", src:\"$path${PWD##*$path}/$file\"}," >>  $outputfile


elif [ ${file##*.} = "tga" ]

then

echo "{type:\"tga\", src:\"$path${PWD##*$path}/$file\"}," >>  $outputfile


elif [ ${file##*.} = "tmx" ]

then

echo "{type:\"tmx\", src:"$path${PWD##*$path}"/"$file"}," >>  $outputfile


elif [ ${file##*.} = "mp3" -o ${file##*.} = "ogg" ] 

then

#echo "$extension"

echo "{type:\"effect\", src:"$path${PWD##*$path}"/"$file"}," >>  $outputfile

fi

fi

done

}


rem Release the resource array to js file.

echo "var g_ressources = [" >> $outputfile

loopDir 

#echo "{type:\"null\", src:\"null\"}" >>  $outputfile

# remove the last comma


echo "];" >> $outputfile


echo "Finish."