if (navigator.userAgent.indexOf('MSIE') != -1)
    var detectIEregexp = /MSIE (\d+\.\d+);/; //test for MSIE x.x
else // if no "MSIE" string in userAgent
    var detectIEregexp = /Trident.*rv[ :]*(\d+\.\d+)/; //test for rv:x.x or rv x.x where Trident string exists
 
if (detectIEregexp.test(navigator.userAgent)){ //if some form of IE
    var ieversion=new Number(RegExp.$1); // capture x.x portion and store as a number
    if (ieversion>=12) {
        console.log("You're using IE12 or above");
        document.getElementById("notsupported").style.display = "inline-block";
    }
    else if (ieversion>=11) {
        console.log("You're using IE11 or above");    
        document.getElementById("notsupported").style.display = "inline-block";
    }
    else if (ieversion>=10) {
        console.log("You're using IE10 or above");
        document.getElementById("notsupported").style.display = "inline-block";
    }
    else if (ieversion>=9) {
        console.log("You're using IE9 or above");
        document.getElementById("notsupported").style.display = "inline-block";
    }
    else if (ieversion>=8) {
        console.log("You're using IE8 or above");
        document.getElementById("notsupported").style.display = "inline-block";
    }
    else if (ieversion>=7) {
        console.log("You're using IE7.x");
        document.getElementById("notsupported").style.display = "inline-block";
    }
    else if (ieversion>=6) {
        console.log("You're using IE6.x");
        document.getElementById("notsupported").style.display = "inline-block";
    }
    else if (ieversion>=5) {
        console.log("You're using IE5.x");
        document.getElementById("notsupported").style.display = "inline-block";
    }
}
else{
    console.log("You're using n/a IE");
    document.getElementById("notsupported").style.display = "none";
}