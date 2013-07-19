
var data = {
	labels : ["January","February","March","April","May","June","July"],
	datasets : [
		{
			fillColor : "rgba(220,220,220,0.5)",
			strokeColor : "rgba(220,220,220,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			data : [65,59,90,81,56,55,40]
		},
		{
			fillColor : "rgba(151,187,205,0.5)",
			strokeColor : "rgba(151,187,205,1)",
			pointColor : "rgba(151,187,205,1)",
			pointStrokeColor : "#fff",
			data : [28,48,40,19,96,27,100]
		}
	]
};
//
var counterSending = 0;
//
var smsQueue=[];
var last24hours = {};
var l24hCounter = 0;
var lastDays = {};
var l7daysCounter = 0;
var l30daysCounter = 0;
var l365daysCounter = 0;
var chart_l24hrs = [];
//
function updateSmsQueue(sms){
    //console.log("Updating SMS queue...");
    //
    // first: remove rows over 25th
    var rowCounter=0;
    $("#smsqueue tr:gt(0)").each(function() {
	$this = $(this)
	//
	var status = $this.find("span.label").html();
	//console.log(rowCounter+" status= "+status);
	if (status==="sent" && rowCounter>24 ){
	    $this.remove();
	};
	rowCounter++;
    });
    //
    // add new row
    var row = "<tr id='sms_"+sms.id+"'>";
    row+= "<td>"+sms.dtin+"</td>";
    row+= "<td id='sms_dtout_"+sms.id+"'>&nbsp;</td>";
    row+= "<td>"+sms.sname+"</td>";
    row+= "<td>"+sms.rname+"</td>";
    row+= "<td>"+sms.phone+"</td>";
    row+= "<td><span class='label' id='sms_status_"+sms.id+"'>new</span></td>";
    row+= "</tr>";
    $(row).prependTo("#smsqueue > tbody");
};
//
function updateGlobalCounters(sms){
    //console.log("Update global counters:"+sms.dt);
    var hour = parseInt(String(sms.dt).split(" ")[1].split(":")[0], 10);
    var day = String(sms.dt).split(" ")[0].replace(/-/g,"");
    //
    l24hCounter = 0;
    l7daysCounter = 0;
    l30daysCounter = 0;
    l365daysCounter = 0;
    //console.log("Update global counters, hour="+hour+", = "+last24hours[hour]);
    //
    // last 24 hours counter
    if (last24hours[hour]===undefined){
	//
	last24hours[hour] = 1;
	//
	var keys = new Array();
	for (var k in last24hours) {
	    keys.unshift(k);
	};
	var limit=24;
	for (var c=keys.length, n=0; n<c; n++) {
	    if (n>=limit){
		delete last24hours[keys[n]];
	    };
	};
    } else {
	last24hours[hour]++;
    };
    //console.log("last24hours="+JSON.stringify(last24hours));
    // 
    chart_l24hrs.length = 0;
    for (idx in last24hours){
	l24hCounter+=last24hours[idx];
	//chart_l24hrs.push( [idx, last24hours[idx]] );
    };
    $("#l24h").html(l24hCounter);
    //
    // days counter
    if (lastDays[day]===undefined){
	lastDays[day] = 1;
	//
	var keys = new Array();
	for (var k in lastDays) {
	    keys.unshift(k);
	};
	var limit=365;
	for (var c=keys.length, n=0; n<c; n++) {
	    //console.log(lastDays[keys[n]]);
	    if (n>=limit){
		delete lastDays[keys[n]];
	    };
	};
    } else {
	lastDays[day]++;
    };
    // count days
    var dayCnt=0;
    for (idx in lastDays){
	dayCnt++;
	if (dayCnt<=7){
	    l7daysCounter+=lastDays[idx];
	};
	if (dayCnt<=30){
	    l30daysCounter+=lastDays[idx];
	};
	l365daysCounter+=lastDays[idx];
    };
    $("#l7days").html(l7daysCounter);
    $("#l30days").html(l30daysCounter);
    $("#l365days").html(l365daysCounter);
    //updateChart_l24hrs();
    //updateDaysCharts();
    //updateMonthsChart();
};
function updateChart_l24hrs(){
    //console.log("last24hours="+JSON.stringify(last24hours));
    if (Object.keys(last24hours).length>0){
        for(var key in last24hours) break;
        var firstHour = parseInt(key,10)+1;
        if (firstHour>23) firstHour=0;
        //console.log("firstHour="+firstHour);
        var hoursTicks = [];
        var hoursData = [];
        for (var i=1; i<=24; i++){
            //console.log("i="+i);
            hoursTicks.push([i, ""+firstHour]);
            
            if (last24hours[firstHour]===undefined){
                hoursData.push([i,0]);
            } else {
                hoursData.push([i,last24hours[firstHour]]);
            };
            firstHour--;
            if (firstHour<0) firstHour=23;
            
        };
        var Options = { xaxis: {ticks:hoursTicks}};
        $.plot($("#chart_l24hrs"), [{data:hoursData, bars:{show:true}}], Options);
    };
};
//
function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}
//
function getLastDays(daysNum){
    var ret = [];
    var theDate = new Date();
    for (var i=0;i<=daysNum-1;i++){
	ret.push( dateToYMD(theDate));
	theDate.setTime(theDate.getTime() - 86400000);
    };
    return ret;
};
//
//getLastDays(30);
function updateDaysCharts(){
    var ld7Data = [];
    var ld7Ticks = [];
    var ld30Data = [];
    var ld30Ticks = [];
    var ld365Data = [];
    var ld365Ticks = [];
    var daysIdx = getLastDays(30);
    var cnt = 0;
    var idx,tick;
    daysIdx.forEach(function(item){
        idx=item.replace(/-/g,"");
        //console.log(item+", "+idx+", "+lastDays[idx]);
        cnt++;
        if (cnt<=7){
            //tick = item.split("-")
            ld7Ticks.push([cnt,item]);
            if (lastDays[idx]===undefined){
                ld7Data.push([cnt,0]);
            } else {
                ld7Data.push([cnt,lastDays[idx]]);
            }
        };
        if (cnt<=30){
            ld30Ticks.push([cnt,item]);
            if (lastDays[idx]===undefined){
                ld30Data.push([cnt,0]);
            } else {
                ld30Data.push([cnt,lastDays[idx]]);
            }
        };
    });
    //
    $.plot($("#chart_l7days"), [{data:ld7Data, bars:{show:true,align:"center"}}], { xaxis: {ticks:ld7Ticks}});
    $.plot($("#chart_l30days"), [{data:ld30Data, bars:{show:true,align:"center"}}], { xaxis: {ticks:ld30Ticks,tickLength:5}});
    //$.plot($("#chart_l365days"), [{data:ld365Data, lines:{show:true}}], { xaxis: {ticks:ld365Ticks,tickSize:10}});
};
//
//getLastDays(30);
function updateMonthsChart(){
    var l12mData = [];
    var l12mTicks = [];
    var l12mtmp = {};
    var daysIdx = getLastDays(365);
    //var cnt = 0;
    var idx,tick;
    // gen last 12 months
    for(var key in lastDays) break;
    var lastYear = parseInt(String(key).slice(0,4), 10);
    var lastMonth = parseInt(String(key).slice(4,6), 10);
    //console.log(key," -> ",lastYear," -> ",lastMonth);
    for (var i=0; i<12; i++){
        var str = lastYear + "" + (lastMonth<=9 ? '0' + lastMonth : lastMonth);
        l12mTicks.push([i,str]);
        l12mtmp[str] = 0;
        lastMonth--;
        if (lastMonth<1){
            lastMonth=12;
            lastYear--;
        };
    };
    //
    daysIdx.forEach(function(item){
        idx=item.replace(/-/g,"");
        var tmp = item.split("-");
        tick = tmp[0]+""+tmp[1];
        //console.log(item+", "+tick+","+idx+", "+lastDays[idx]);
        if (lastDays[idx]!==undefined){
            l12mtmp[tick]+=lastDays[idx];
        }
    });
    //
    l12mTicks.forEach(function(item){
        l12mData.push([item[0], l12mtmp[item[1]]]);
    });
    //
    /*
    console.log(JSON.stringify(l12mtmp));    
    console.log(JSON.stringify(l12mData));
    console.log(JSON.stringify(l12mTicks));
    */
    //
    $.plot($("#chart_l12months"), [{data:l12mData, bars:{show:true,align:"center"}}], { xaxis: {ticks:l12mTicks,tickSize:10}});
};
//
var currentLedStatus = "off";
var ledOn = "/images/bullet_red.png";
var ledOff = "/images/bullet_grey.png";
var ledSms = "/images/bullet_blue.png";
var ledOnStart=new Date().getTime();

function ledBlink(){
    if (currentLedStatus==="off"){
	currentLedStatus = "on";
	ledOnStart=new Date().getTime();
	//$("#transmLed").attr("src", ledOn);
	$("#idEnvelope").removeClass('icon-envelope-alt').addClass('icon-envelope');
    } else {
	if (parseInt(new Date().getTime())-parseInt(ledOnStart)>700){
	    $("#idEnvelope").removeClass('icon-envelope').addClass('icon-envelope-alt');
	    currentLedStatus = "off";
	} else {
	    ledOnStart=new Date().getTime();
	};
    };
};
//
setInterval(function() {
    if (parseInt(new Date().getTime())-parseInt(ledOnStart)>700){
	$("#idEnvelope").removeClass('icon-envelope').addClass('icon-envelope-alt');
	currentLedStatus = "off";
    }
}, 100 );    
//
$(document).ready(function() {
    //
    ss.event.on('dt', function(msg){
	$("#server_dt").html("Server date/time: "+msg);
    });
    //
    ss.event.on('newsms', function(sms){
	//$("#alertBox").css("visibility","hidden");
	//$("#alertBox").hide();;
	updateSmsQueue(sms);
	ledBlink();
    });    
    ss.event.on('smsstatus', function(sms){
	console.log("smsstatus: "+JSON.stringify(sms));
	ledBlink();
	$("#sms_status_"+sms.id).html(sms.status);
	if (sms.status==='sent'){
	    $("#sms_status_"+sms.id).removeClass('label-info').addClass('label-success');
	    $("#sms_"+sms.id).removeClass('info').addClass('success');
	    $("#sms_dtout_"+sms.id).html(sms.dt);
	    counterSending--;
	    updateGlobalCounters(sms);
	} else if (sms.status==='sending'){
	    $("#sms_status_"+sms.id).addClass('label-info');
	    $("#sms_"+sms.id).addClass('info');
	    counterSending++;
	} else if (sms.status==='error'){
	    console.log("Jest status=error.");
	    $("#sms_status_"+sms.id).removeClass('label-info').addClass('label-important');
	    $("#sms_"+sms.id).removeClass('info').addClass('warning');
	    counterSending--;
	};
	if (counterSending<0){
	    counterSending=0;
	}
	$("#counterSending").html(counterSending);
    });
    //
    ss.rpc('smsfuncs.getSendingStats', function(data){
	console.log("Received data: "+JSON.stringify(data));
	if (data.err===""){
	} else {
	    //
	    l24hCounter = data.ret.l24h;
	    l7daysCounter = data.ret.l7days;
	    l30daysCounter = data.ret.l30days;
	    l365daysCounter = data.ret.l365days;
	    //
	    $("#l24h").html(l24hCounter);
	    $("#l7days").html(l7daysCounter);
	    $("#l30days").html(l30daysCounter);
	    $("#l365days").html(l365daysCounter);
	};
    });
    ss.rpc('smsfuncs.getSmsQueue', function(data){
	console.log("getSmsQueue...: "+JSON.stringify(data));
	console.log("updateSmsQueue()...");
    });
//
//==================
//
/*
updateChart_l24hrs();    
updateDaysCharts();
updateMonthsChart();    
*/
//
//==================
//
$("#smsFormReset").click(function(e){
  console.log("smsFormReset...");  
  //e.preventDefault();
  $('#smsForm')[0].reset();
});
//
$("#smsFormSend").click(function(e){
    console.log("smsFormSend...");
    e.preventDefault();
    var sms = {
	"sname": $("#inputSenderName").val(),
	"rname": $("#inputRecipientName").val(),
	"phone": $("#inputRecipientPhone").val(),
	"text": $("#inputText").val()
    };
    console.log("smsFormSend: "+JSON.stringify(sms));
    ss.rpc("smsfuncs.sendSMS", sms, function(data){
	console.log("sent:"+data);
	$("#alertBox").css('visibility', 'visible');
	$("#alertBox").removeClass('alert-error').addClass('alert-info');
	var html = "<h4>Information.</h4>Message was sent to: "+sms.phone;
	$("#alertBoxContents").html(html);
	//$("#alertBox").css('visibility', 'hidden');
	setTimeout(function() { 
	    $("#alertBox").css('visibility', 'hidden');
//        $("#alertBox").fadeOut();
	}, 2500);
    });
    return false;
});
//
// Download a file form a url.
function saveFile(url) {
  // Get file name from url.
  var filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
    a.download = filename; // Set the file name.
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    delete a;
  };
  xhr.open('GET', url);
  //xhr.setRequestHeader('Access-Control-Allow-Origin', 'http://bi.gazeta.pl');
  //document.domain = 'http://bi.gazeta.pl';
  //xhr.setRequestHeader('Origin', 'http://bi.gazeta.pl');
  xhr.send();
}
//saveFile("http://bi.gazeta.pl/im/e4/df/d8/z14213092AA.jpg");
//
//
});