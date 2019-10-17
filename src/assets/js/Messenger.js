

  function closeparticipants()
  {
      $('#popaddgrpparticipants').css('display', 'none');
      $('#txtgrpusersrch').val('');
      $('#hdnAlladdedUsers').val('');
  }

function closerecording() {
    clearInterval(timer);
    $('#divtimer').css('display', 'none');
}
function recordvoice() {
    $('#divtimer').css('display', 'block');
    //time = 120;
    //showTimer();
    //timer = setInterval(showTimer, 1000);
    var start = new Date;
    timer = setInterval(function () {
        $('#lbltimer').html((new Date - start) / 1000);//seconds
    }, 1000);

    $('#hdnrcd').val('1');
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: 'VoiceRecording/RecordVoice',
        dataType: "json",
        success: function (data) {
            alert('Voice Recorded');
        }
    });
}
function StopVoice() {
    clearInterval(timer);
    $('#divtimer').css('display', 'block');
    if ($('#hdnrcd').val() == "1") {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: 'VoiceRecording/StopVoice',
            dataType: "json",
            success: function (data) {
                alert('Voice stopped');
            }
        })
    }
    $('#hdnrcd').val(0);
}

function bindsuggestedMsgTags(id, exp, count) {
    $('#divsuggMsgTags').html('');
    exp = 'MT_TYPE = \'S\' ';
    var strdata = JSON.stringify({ 'Identifier': id, 'Expression': exp, 'Count': count });
    var chkdatas = '';
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: $('#hdntasqapiurl').val() + "api/TasQMessenger/GetAllTags",
        dataType: "json",
        headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
        data: strdata,
        success: function (data) {
            var Tagids = '';
            if (data.StatusCode == 200) {
                var list = data.TagsList;
                if (list.length > 0)
                {                    
                    $.each(list, function (key, value) {
                        var ID = list[key].tag_id;
                        var Name = list[key].tag_name;
                        Tagids =Tagids+ ID +',';
                        chkdatas += '<li onclick="addMsgtag(' + ID + ');" class="Msgbit-box" style="height:16px;" id="tbit' + ID + '"><a onclick="" style="color:white;cursor:pointer;text-decoration: none;">';
                        chkdatas += ' <div class="stids"  style="margin-right:10px;width:auto;" id="tagmsg' + ID + '">' + Name + '</div></a>';
                        chkdatas += ' <a onclick="Removemsgtag(1);" style="margin-left:2px;color:black;font-size:14px;float:right;cursor:pointer;margin-top: -3px;text-decoration: none;"><div class="tagsclose"><img src="images/x_sml.png"  alt=""></div></a></li> ';
                    });
                }
                var tagdata = $.trim(Tagids);
                var notintagids = tagdata.slice(-1);
                if (notintagids == ',')
                    tagdata = tagdata.slice(0, -1);
                $('#hdnnotinMsgtags').val(tagdata);              
                $('#divsuggMsgTags').html(chkdatas);
            }
            else {
                $('#divsuggMsgTags').html('No Tags found');               
            }
        }      
    });
    
}
function addMsgtag(Tagid)
{
    if(confirm('Do you want to add Tag to the Conversation?'))
    {
        $('#hdnmsgtags').val(Tagid);
        savechildconversationbytag();
    }
    else
    {
        $('#hdnmsgtags').val('');

    }
}


function Getchildfeeds(convid,groupid,convtype)
{
    $('#hdnoverall').val(groupid);
    $('#hdnconvid').val(convid);
    $('#hdnconvtype').val(convtype);
    GetMessengerfeeds($('#hdnoverall').val(), convid, $('#hdnconvtype').val());
}

function GetRecentConvold()
{
   $('#addgroup').hide();
     $('#contactsdiv').hide();
	  $('#messengercontent').css("height","640px");
    var exp = '';
    if ($('#txtusersrch').val() != '')
        exp = 'name like \'' + $('#txtusersrch').val() + '%\' ';

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //  url: "http://localhost:53746/api/TasQMessenger/userDetailsByAlphabet",
        url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/RecentConvrsations',
        headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
        dataType: "json",
        async: false,
        data: JSON.stringify({ 'userid': $('#hdnid').val(), 'exp': exp }),
        success: function (data) {
            $('#Tmesgcontent').empty();
            var str = "<ul id='ulmsg'>";
            if (data.statuscode == 200) {
                if (data.usrDetails.length > 0) {

                    $.each(data.usrDetails, function (key, value) {
                        var profileimage = value.userimage;
                        var convtype = value.convtype;
                        if (profileimage == "")
                            profileimage = "IMS\\DeafaultUserImg.jpg";
                        else if (convtype.toUpperCase() == "G")
                            profileimage = "IMS\\" + profileimage;
                        if (value.id != 0) {
                            str += '<li onclick="saveconversationinfo(' + value.id + ',\'' + value.convtype + '\')" id="li' + value.id + '_' + value.convtype + '" style="float:left;width:-webkit-fill-available;width:300px;"><div id="Convimg' + value.id + '" class="mesg_pic" style="background-image:url(' + $('#hdnwebroot').val() + profileimage.replace("\\", "\\\\\\\\") + ')"></div>';
                            str += '<a style="cursor:pointer;">';
                            str += '<div id="Convname' + value.id + '"  class="msgname"> ' + value.name + '</div><div style="display:none;color:white;float:left;width:20px;background-color:red;font-weight:bold;position:relative;margin-top:-11px;margin-left:-39%;height:18px;border-radius:50%;text-align:center;" id="sp' + value.id + '_' + value.convtype + '"></div>';
                            str += '<div class="mesg_text" style="word-break:break-word;height:10px;">' + value.mail + '</div>';
                            str += '</a></li>';
                        }
                        else
                            str += '<div ><div style="margin-left:28px;margin-top:10px;color:#e97622;font-weight:bold;">' + value.name + '</div></div>';
                    });
                    str += '</ul>';

                    $('#Tmesgcontent').append(str);
                }
                else {
                    $('#Tmesgcontent').html("<div style='margin-left:84px;margin-top:45px'><label >no data found</label></div>");
                }
            }
            else {
                $('#Tmesgcontent').html("<div style='margin-left:84px;margin-top:45px'><label >no data found</label></div>");
            }
        }
    });


    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/GetConversationCounts',
        headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
        dataType: "json",
        //async: false,
        data: JSON.stringify({ 'Identifier': $('#hdnid').val(), 'Count': 0 }),
        success: function (data) {
            if (data.StatusCode == 200) {
                var licount = $("ul").children().length;
                var IDS = [];
                $('#ulmsg').find("li").each(function () { IDS.push(this.id) });
                var conv = data.ConversationCountsList;
                if (conv.length > 0) {
                    $.each(conv, function (key, value) {
                        if (value.cu_type == 'I') {
                            if ($('#li' + value.cu_user_id + '_' + value.cu_type + '').index() != -1 && value.cu_count != 0) {
                                var recentdata = $('#li' + value.cu_user_id + '_' + value.cu_type + '').html();
                                $('#li' + value.cu_user_id + '_' + value.cu_type + '').remove();
                                $('#ulmsg').prepend('<li onclick="saveconversationinfo(' + value.cu_user_id + ',\'' + value.cu_type + '\')" id="li' + value.cu_user_id + '_' + value.cu_type + '" style="float:left;width:-webkit-fill-available;width:300px;">' + recentdata + '</li>');

								   if (value.cu_count > 0) {
                                $('#sp' + value.cu_user_id + '_' + value.cu_type + '').css('display', 'block');
                                $('#sp' + value.cu_user_id + '_' + value.cu_type + '').html('<span style="font-size:10px;">' + value.cu_count + '</span>');
								   }
                            }
                        }
                        else if (value.cu_type == 'G') {
                            if ($('#li' + value.cu_group_id + '_' + value.cu_type + '').index() != -1 && value.cu_count != 0) {
                                var recentdata = $('#li' + value.cu_group_id + '_' + value.cu_type + '').html();
                                $('#li' + value.cu_group_id + '_' + value.cu_type + '').remove();
                                $('#ulmsg').prepend('<li onclick="saveconversationinfo(' + value.cu_group_id + ',\'' + value.cu_type + '\')" id="li' + value.cu_group_id + '_' + value.cu_type + '" style="float:left;width:-webkit-fill-available;width:300px;">' + recentdata + '</li>');

								   if (value.cu_count > 0) {
                                $('#sp' + value.cu_group_id + '_' + value.cu_type + '').css('display', 'block');
                                $('#sp' + value.cu_group_id + '_' + value.cu_type + '').html('<span style="font-size:10px;">' + value.cu_count + '</span>');
								   }
                            }
                        }
                    });
                }
            }
        }
    });
  
}


function MiddleAdjustmentmsgs()
{
    $('#hdngroupimagename').val('');
    $('.mesg_mdl').css('width', '951px');
    $('.mesg_rgt').css('display', 'none');
    $('.mesg_mdl1').css('display', 'none');
    $('.mesg_mdl').css('display', 'block');
}




function GetRecentConv() {
  
    $('#addgroup').hide();
    var exp = '';
    if ($('#txtusersrch').val() != '')
        exp = 'name like \'' + $('#txtusersrch').val() + '%\' ';
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
     //  url: "http://localhost:53746/api/TasQMessenger/RecentConvswithChilds",
       url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/RecentConvswithChilds',
        headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
        dataType: "json",
        async: false,
        data: JSON.stringify({ 'userid': $('#hdnid').val(), 'exp': exp }),
        success: function (data) {
            $('#Tmesgcontent').empty();
            $('#hdntotalusersdata').val('');
            var str = "<ul id='ulmsg'>";
            if (data.statuscode == 200) {
                if (data.recentConvwithChilds.length > 0) {
                    $.each(data.recentConvwithChilds, function (key, value) {
                        var profileimage = value.image;
                        var convtype = value.convtype;
                        var message = value.message;
                      
                        var userstatus = value.userstatus;
                        if (profileimage == "")
                            profileimage = "IMS\\DeafaultUserImg.jpg";
                        else if (convtype.toUpperCase() == "G")
                            profileimage = "IMS\\" + profileimage;

                        var maingroupid=value.userid;
                     
                
                        if (value.userid != 0) {
                            str += '<li  id="li' + value.userid + '_' + value.convtype + '"  style="float:left;width:-webkit-fill-available;width:300px;"><div id="divparent' + value.userid + '"  onclick="GetMessengerfeeds(\''+value.userid+'\',\'' + value.convid + '\',\'' + value.convtype + '\')"><div id="Convimg' + value.userid + '" class="mesg_pic" style="background-image:url(' + $('#hdnwebroot').val() + profileimage.replace("\\", "\\\\\\\\") + ')"></div>';
                            str += '<a style="cursor:pointer;"  >';
                            str += '<div  id="Convname' + value.userid + '"  class="msgname"> ' + value.name + '</div><div style="display:none;color:white;float:left;width:20px;background-color:red;font-weight:bold;position:relative;margin-top:-11px;margin-left:-115px;height:18px;border-radius:50%;text-align:center;" id="sp' + value.userid + '_' + value.convtype + '"></div>';
                          
                            var participants = ''; var totalparticipants = ''; var strval = ''; var fullusercount = '';
                             var finaluserdata = '';                       
                          
                            /*This is fr getting last message*/
                              lastmessage = message;
                                if (lastmessage.length > 150)
                                    lastmessage = lastmessage.substring(0, 150);
                                lastmessage = '<div style="font-size:10px;color:#3097ff;height:10px;" class="mesg_text">' + lastmessage + '</div></a></div>';
                                str += lastmessage;

                            /*This is for Tags as child in that group*/

                            var childconvtags = ''; var childcnts = ''; var lastmessage = ''; var childtagsoutput = '';
                            if (value.childconvrecent.length > 0) {
                                $.each(value.childconvrecent, function (key, value) {

                                    if (value.childcounts > 0) { //this is for counts
                                        childcnts = '<div style="color: white; float: left; width: 10px; background-color: red; font-weight: bold;'
                                        childcnts += 'height: 10px; border-radius: 50%; text-align: center; ">'
                                        childcnts += '<span style="font-size:10px;">' + value.childcounts + '</span></div>';
                                    }
                                    childconvtags += '<div onclick="Getchildfeeds(' + value.childconvid + ',' + maingroupid + ',\'' + convtype + '\')"  class="Msgbit-box" style="height:16px;font-size:10px;padding:1px 0px 0px 4px;float:left; >';
                                    childconvtags += ' <div class="stids"  style="margin-right:10px;width:auto;" >' + value.childname + '</div>';
                                });

                                childtagsoutput = '<div class="clear"></div>' + childcnts + '<div style="cursor:pointer;margin-top:-22px;" id="divchild' + maingroupid + '" >' + childconvtags + '</div></div>';
                                str += childtagsoutput;
                            }                        
                              
                            /*End of Tags as child in that group*/
                            str += '</li>';
                        }
                        //else
                        //    str += '<div ><div style="margin-left:28px;margin-top:10px;color:#e97622;font-weight:bold;">' + value.name + '</div></div>';
                    });
                    str += '</ul>';

                    $('#Tmesgcontent').append(str);
                }
                else {
                    $('#Tmesgcontent').html("<div style='margin-left:84px;margin-top:45px'><label >no data found</label></div>");
                }
            }
            else {
                $('#Tmesgcontent').html("<div style='margin-left:84px;margin-top:45px'><label >no data found</label></div>");
            }
        }
    });
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/GetConversationCounts',
        headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
        dataType: "json",
        //async: false,
        data: JSON.stringify({ 'Identifier': $('#hdnid').val(), 'Count': 0 }),
        success: function (data) {
            if (data.StatusCode == 200) {
                var licount = $("ul").children().length;
                var IDS = [];
                $('#ulmsg').find("li").each(function () { IDS.push(this.id) });
                var conv = data.ConversationCountsList;
                if (conv.length > 0) {
                    $.each(conv, function (key, value) {
                        if (value.cu_type == 'I') {
                            if ($('#li' + value.cu_user_id + '_' + value.cu_type + '').index() != -1 && value.cu_count != 0) {
                                var recentdata = $('#li' + value.cu_user_id + '_' + value.cu_type + '').html();
                                $('#li' + value.cu_user_id + '_' + value.cu_type + '').remove();
                                $('#ulmsg').prepend('<li  id="li' + value.cu_user_id + '_' + value.cu_type + '"  style="float:left;width:-webkit-fill-available;width:300px;">' + recentdata + '</li>');

                                $('#sp' + value.cu_user_id + '_' + value.cu_type + '').css('display', 'block');
                                $('#sp' + value.cu_user_id + '_' + value.cu_type + '').html('<span style="font-size:10px;">' + value.cu_count + '</span>');
                            }
                        }
                        else if (value.cu_type == 'G') {
                            if ($('#li' + value.cu_group_id + '_' + value.cu_type + '').index() != -1 && value.cu_count != 0) {
                                var recentdata = $('#li' + value.cu_group_id + '_' + value.cu_type + '').html();
                                $('#li' + value.cu_group_id + '_' + value.cu_type + '').remove();
                                $('#ulmsg').prepend('<li  id="li' + value.cu_group_id + '_' + value.cu_type + '"  style="float:left;width:-webkit-fill-available;width:300px;">' + recentdata + '</li>');

                                $('#sp' + value.cu_group_id + '_' + value.cu_type + '').css('display', 'block');
                                $('#sp' + value.cu_group_id + '_' + value.cu_type + '').html('<span style="font-size:10px;">' + value.cu_count + '</span>');
                            }
                        }
                    });
                }
            }
        }
    });
    //getscroll('messengercontent');
}

function GetMessengerOnlyProfileInfo(id, convtype)
{
    $('#txtupchat').html('');
    MiddleAdjustmentmsgs();
    /*This is for Profile part*/
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
       // url: "http://localhost:53746/api/TasQMessenger/GetMessengerOnlyProfileInfo",
       url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/GetMessengerOnlyProfileInfo',
        headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
        dataType: "json",
        async: false,
        data: JSON.stringify({ 'id': id, 'Convtype': convtype ,'convid' :0}),
        success: function (data) {
            var str = "";
            if (data.Statuscode == 200) {
                if (data.Msgprofileinfo.length > 0) {

                    var value = data.Msgprofileinfo[0];
                    var mediafilesdata = '';
                    var groupparticipents = '';
                    var iCON = value.ImageIcon;
                    $('#hdngroupimagename').val(iCON);
                    if (iCON == "")
                        iCON = "IMS\\DeafaultUserImg.jpg";
                    else if ($('#hdnconvtype').val() == 'G')
                        iCON = "IMS\\" + iCON;
                    iCON = $('#hdnwebroot').val() + iCON.replace("\\", "\\\\\\\\");
                    $('#divmdl_profile').css('background-image', 'url(' + iCON + ') ');
                    $('#divmdl_name').html(value.ProfileName);

                    if (convtype == 'I')
                        $('#divmdl_status').html(value.UserStatus);
                    else {
                        /*This is for paticipants in that group*/
                        var participants = ''; var totalparticipants = ''; var strval = ''; var fullusercount = '';
                        var finaluserdata = '';
                        if (value.ConvsationUsers.length > 0) {
                            var len = value.ConvsationUsers.length;
                            totalparticipants = value.totalparticipants - len;
                            $.each(value.ConvsationUsers, function (key, value) {
                                participants += value.UserName + ', ';
                            });
                            strval = participants;
                            var finalparticipants = strval.substring(0, strval.length - 1); //this is for removing comma at the last
                            if (finalparticipants.length > 40)
                                finalparticipants = '..' + finalparticipants.substring(0, 40);
                            finalparticipants = '<div style="font-size:12px;cursor:pointer;"  >' + finalparticipants + '';
                            if (totalparticipants > 0)
                                finalparticipants += '<div style="float:right;margin-right:18px;margin-top:-16px;cursor:pointer;">+..' + totalparticipants + '</div>';
                            finalparticipants += '</div>';
                        }
                        $('#divmdl_status').html(finalparticipants);
                        /*End of  paticipants in that group*/
                    }
                }
            }
        }
    });
    /*This is for Profile part*/
}

function Clearsearch()
{  
    $('#idcancel').css('display', 'block');
    if( $('#txtusersrch').val()=="")
    $('#idcancel').css('display', 'none');
}



function GetTotalMembers(action) {
$('#idcancel').css('display', 'none');
    var exp = '';
 if (action == 'C')
        $('#txtusersrch').val('');

    if ($('#txtusersrch').val() != '')
        exp = 'name like \'' + $('#txtusersrch').val() + '%\' ';

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
      //  url: "http://localhost:53746/api/TasQMessenger/userDetailsByAlphabet",
        url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/userDetailsByAlphabet',
        headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
        dataType: "json",
        async: false,
        data: JSON.stringify({ 'userid': $('#hdnid').val(),'exp':exp }),
        success: function (data) {
            $('#Tmesgcontent').empty();
            var str = "<ul id='ulmsg'>";
            if (data.statuscode == 200) {
                if (data.usrDetails.length > 0) {

                    $.each(data.usrDetails, function (key, value) {
                        var profileimage = value.userimage;
                        var convtype = value.convtype;
                        if (profileimage == "")
                            profileimage = "IMS\\DeafaultUserImg.jpg";
                        else if (convtype.toUpperCase() == "G")
                            profileimage = "IMS\\" + profileimage;
                        if (value.id != 0) {
                            str += '<li onclick="saveconversationinfo(' + value.id + ',\'' + value.convtype + '\')" id="li' + value.id + '_' + value.convtype + '" style="float:left;width:-webkit-fill-available;width:300px;"><div id="Convimg' + value.id + '" class="mesg_pic" style="background-image:url(' + $('#hdnwebroot').val() + profileimage.replace("\\", "\\\\\\\\") + ')"></div>';
                            str += '<a style="cursor:pointer;">';
                            str += '<div id="Convname' + value.id + '"  class="msgname"> ' + value.name + '</div><div style="display:none;color:white;float:left;width:20px;background-color:red;font-weight:bold;position:relative;margin-top:-11px;margin-left:-48%;height:18px;border-radius:50%;text-align:center;" id="sp' + value.id + '_' + value.convtype + '"></div>';
                            str += '<div class="mesg_text" style="word-break:break-word;height:10px;">' + value.mail + '</div>';
                            str += '</a></li>';
                        }
                        else
                            str += '<div ><div style="margin-left:28px;margin-top:10px;color:#e97622;font-weight:bold;">' + value.name + '</div></div>';
                    });
                    str += '</ul>';
                    $('#Tmesgcontent').append(str);
                }
                else {
                    $('#Tmesgcontent').html("<div style='margin-left:84px;margin-top:45px'><label >no data found</label></div>");
                }
            }
            else {
                $('#Tmesgcontent').html("<div style='margin-left:84px;margin-top:45px'><label >no data found</label></div>");
            }
        }
    });
   
    //getscroll('messengercontent');
}
function  GetGroupinfo()
{
    /*This is for Profile part*/
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //   url: "http://localhost:53746/api/TasQMessenger/GetTasQMessengerProfileInfo",
        url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/GetTasQMessengerProfileInfo',
        headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
        dataType: "json",
        data: JSON.stringify({ 'id': $('#hdnoverall').val(), 'Convtype': $('#hdnconvtype').val(), 'convid': $('#hdnconvid').val() }),
        success: function (data) {
            var str = "";
            if (data.Statuscode == 200) {
                if (data.Msgprofileinfo.length > 0) {
                  
                    var value = data.Msgprofileinfo[0];
                    var mediafilesdata = '';
                    var groupparticipents = '';
                    var iCON = value.ImageIcon;
                    if (iCON == "")
                        iCON = "IMS\\DeafaultUserImg.jpg";
                    else if ($('#hdnconvtype').val() == 'G')
                        iCON = "IMS\\" + iCON;
                    iCON = $('#hdnwebroot').val() + iCON.replace("\\", "\\\\\\\\");
                      //$('#divmdl_profile').css('background-image', 'url(' + iCON + ') ');
                    //$('#divmdl_name').html(value.ProfileName);
                    //$('#divmdl_status').html(value.UserStatus);

                    $.each(value.MediaFiles, function (key, value) {
                        var filename = value.FileName;
                        filename = "https://demotasq.aiqware.com/MessengerFiles/" + filename;
                        //mediafilesdata += '<div id="divmedia"' + key + ' class="media_thumb" style="background-image:url(' + $('#hdnwebroot').val() + value.FileName.replace("\\", "\\\\\\\\") + ')" ></div>'
                        mediafilesdata += '<div id="divmedia"' + key + ' class="media_thumb" style="background:url(' + filename + ')center center / contain no-repeat;" ></div>'
                    });
                    $('#divmediafiles').html(mediafilesdata);

                    // $('#divmsg_bigprof').css('background-image', 'url(' + $('#hdnwebroot').val() + iCON.replace("\\", "\\\\\\\\") + ')');
                    $('#divmsg_bigprof').css('background-image', 'url(' + iCON + ') ');
                    $('#divbigname').html(value.ProfileName);

                    if ($('#hdnconvtype').val() == "G") {
                        $('#divprofcreated').html(LocalTimeConvertion1(value.Createddate));
                        $('#divaddparticipants').css('display', 'block');
                    }
                    else {
                        $('#divprofcreated').html('');
                        $('#divparticipents').html('');
                        $('#divurscount').html('');
                        $('#divaddparticipants').css('display', 'none');
                    }
                    if ($('#hdnconvtype').val() == "G") {
                        var totlacount = value.ConvsationUsers.length;
                        $('#divurscount').html(value.ConvsationUsers.length + ' Participants');
                        $.each(value.ConvsationUsers, function (key, value) {
                            groupparticipents += '<div id="divpartpts_' + value.UserId + '" onclick=GroupuserActions(\'' + value.UserId + '\',\'' + totlacount + '\') style="cursor:pointer;" class="tagged_par">';
                            groupparticipents += '<div  class="tag_person" style="background:url(' + $('#hdnwebroot').val() + value.Userimage.replace("\\", "\\\\\\\\") + ') center center / contain no-repeat;" ></div>';
                            groupparticipents += '<div id="divpartsname' + value.UserId + '" class="tag_person_name">' + value.UserName + '</div>';
                            groupparticipents += '<div class="tag_person_desg">' + value.Rolename + '</div></div>';
                        });
                        $('#divparticipents').html(groupparticipents);
                        getscroll('divparticipents');
                    }


             //This is for binding Childconvs 
                    $('#divchildconvs').html('');                 
                    var list = value.ChildConversations;
                    if (list.length > 0)
                    {
                        var str = "<ul >";
                        $.each(list, function (key, value) {
                            var ID = list[key].ConversationId; //conv id
                            var Name = list[key].TagName;
                            str += '<li onclick="Getchildfeeds(' + ID + ',\'' + $('#hdnoverall').val() + '\',\'' + $('#hdnconvtype').val() + '\');"  style="float:left;width:250px;cursor:pointer;">';
                            str += '<a>';
                            str += '<div class="tag_person_name"> ' + Name + '</div><div style="display:none;color:red;float:right;width:50px;font-weight:bold;" id="sp' + value.id + '_' + value.convtype + '"></div>';
                            str += '</a></li>';                           
                        });
                        $('#divchildconvs').html(str);
                        getscroll('divchildcontent');
                    }
                    else
                    {
                        $('#divchildconvs').html('<div style="font-size:12px;text-align:-webkit-center;height:15px;padding-top:72px;">No child conversations found!</div>');

                    }
                    //End of binding Childconvs 
                }
                $('.mesg_mdl').css('width', '701px');
                $('.mesg_rgt').css('display', 'block');
				if($('#hdnconvtype').val().toUpperCase()=='G' && $('#hdngroupid').val()>0)
			{
				$('#diveditgroup').show();
			}
			else
				$('#diveditgroup').hide();
	
            }
        }
    });
    /*End of Profile part*/
    $('#divCloseOthersmsgs').css('display', 'block');
    $('#divOpenOthersmsgs').css('display', 'none');
}

function ToggleMsgs()
{
    $('.mesg_rgt').css('display', 'none');
    $('.mesg_mdl').css('width', '951px');
    $("#divOpenOthersmsgs").css('display', 'block');
    $('#divCloseOthersmsgs').css('display', 'none');
}


function GetMessengerfeeds(msgid, convid, convtype) {
          $('#prevmore').css("display","block");
      $('#hdnconvtype').val(convtype);
    $('#hdnconvid').val(convid);
    $('#hdnoverall').val(msgid);
	$('#sp'+msgid+'_'+convtype).css('display','none');
  /*This is for Profile part*/
      GetMessengerOnlyProfileInfo($('#hdnoverall').val(), $('#hdnconvtype').val()); 
    /*This is for Profile part*/
	ToggleMsgs();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: "http://localhost:53746/api/TasQMessenger/GetTasQMessengerFeeds",
       url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/GetTasQMessengerFeeds',
        headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
        dataType: "json",
        data: JSON.stringify({ 'msgidentifier': 0, 'convid': convid, 'expression': '', 'count': 0, 'Convtype': convtype }),
        success: function (data) {
            $('#divmiddlemsgs').empty();
            var strdata = "";
            if (data.Statuscode == 200) {
                if (data.messengerfeeds.length > 0) {
                    $.each(data.messengerfeeds, function (key, value) {
                        var str = '';
                        if (value.MSG_TYPE == "S")
                        {
                            str = '<div class="feed"><div class="statement"><div class="msg-arrow_text" style="margin: auto;"> <div style="width:inherit;float:rigth;"><div style="float:right;">'+
                                 LocalTimeConvertion1(value.MSG_CREATEDTS) + '</div></div></div><div style=" width: 50%;  float: right;">'+
                                 value.MSG_DESC + '</div></div></div>'
                        }
                        else{
                            var class1 = ""; var class2 = "";
                        var fromclass1 = "msg-arrow";
                        var fromtext1 = "msg-arrow_text";
                        var toclass2 = "rlpmsg-arrow";
                        var totext2 = "rlpmsg-arrow_text";
                        var  timedata = ""
                        if (value.MSG_FROM_UID == $('#hdnid').val())
                        {
                            class1 = "rlpmsg-arrow"; class2 = "rlpmsg-arrow_text";
                            timedata = '<div style="float:right;min-height:10px;margin-left:38px;color:#fff;"><span >' + LocalTimeConvertion1(value.MSG_CREATEDTS) + '</span></div>';
                        }
                        else
                        {
                            class1 = "msg-arrow"; class2 = "msg-arrow_text";
                            timedata = '<div style="float:right;min-height:10px;margin-left:38px;color:#3097ff;"><span >' + LocalTimeConvertion1(value.MSG_CREATEDTS) + '</span></div>';
                        }

                        var messageformat = "";
                    
                        if (value.MSG_TYPE == "F")
                            messageformat = '<div style="float:left;margin-left:10px;width:inherit;"><img style="height:120px;" src=' + $('#hdnsolutionurl').val() + '/MessengerFiles/' + value.MSGFILE + '>' + timedata + '</div><br>';
                        else
                            messageformat = '<div class=' + class2 + '>' + value.MSG_DESC.replace(/(~~)/g, '<')  +timedata+'</div>';

                        str += '<div class="feed"><div  class=' + class1 + '>';
                        if (value.MSG_GR_ID > 0) {
                            str += '<div>' + value.FromUserName + '</div>';
                        }
                        str += messageformat +'<div class="clear"></div>';
                       // str += '<div  style="width:inherit;"><div style="float:right;"></div></div>';

                        if (value.MSG_FROM_UID == $('#hdnid').val() && value.MSG_GR_ID==0) {

                            str += '<div class="readst_' + value.MSG_TO_UID + '" style="float:left;color:rgb(49, 232, 17);">' + value.MSG_READSTATUS + '</div>';
                        }
                        else if (value.MSG_FROM_UID == $('#hdnid').val() && value.MSG_GR_ID > 0) {

                            str += '<div style="position:absolute;"><img src="../images/Messenger/info_icontasq.png" style="margin-left:-10px;cursor:pointer;" title="view user info" onclick="MsgrOpen(' + value.MSG_ID + ')" /></div>';
                        }
                        else {
                            str += '<div  style="float:left;"></div>';
                        }

                        str +='</div></div><div class="clear"></div>';
                       
                    }
                        strdata = str + strdata;
                    });                  
                    $('#divmiddlemsgs').append(strdata);
					if (data.messengerfeeds.length<5)
						{
						 $('#prevmore').css("display","none");
                        }
                     }
                else {
                    $('#divmiddlemsgs').html("<div style='margin-top:150px;'><label style='color:black;position:absolute;;margin-left:300px;'>no data found</label></div>");
                $('#prevmore').css("display","none");
				}
                //Tasqobj.server.getReadStatus(convid, $('#hdnid').val());
            }
            else {
                $('#divmiddlemsgs').html("<div style='margin-top:150px;'><label style='color:black;margin-left:300px;'>no data found</label></div>");
            $('#prevmore').css("display","none");
			}
        }
    });
  //  getscroll('divmiddlecontent');
 getmsgfeedscroll('divmiddlecontent');
}   //left side recently all datas


function getmsgfeedscroll(cntrl) {
    $.mCustomScrollbar.defaults.scrollButtons.enable = true; //enable scrolling buttons by default
    $.mCustomScrollbar.defaults.axis = "y"; //enable 2 axis scrollbars by default
    $("#" + cntrl).mCustomScrollbar({
        theme: "rounded-dark", mouseWheelPixels: 50,
        callbacks: {
            whileScrolling: function () {
				
        }
            }
     

    });
	setTimeout(function(){
 $("#" + cntrl).mCustomScrollbar("scrollTo", "last");
 }, 1000);
	
    $(".all-themes-switch a").click(function (e) {
        e.preventDefault();
        var $this = $(this),
           rel = $this.attr("rel"),
           el = $(".content");
        switch (rel) {
            case "toggle-content":
                el.toggleClass("expanded-content");
                break;
        }
    });
}

function saveconversationinfo(touid, convtype) {
    $('#txtupchat').html('');
	$('#sp' + touid + '_' + convtype + '').css('display', 'none');
    $('#hdngroupimagename').val('');
    $('.mesg_mdl').css('width', '951px');
    $('.mesg_rgt').css('display', 'none');
	$('.mesg_mdl1').css('display', 'none');
    $('.mesg_mdl').css('display', 'block');
   
  //  bindsuggestedMsgTags(0, '', 0);
    $('#hdnconvid').val(0);
    $('#hdnmsgtags').val('');
    
    var groupid = 0; var toid = 0;
    if (convtype == "I")
        toid = touid;
    else
        groupid = touid;
    $('#hdnoverall').val(touid); //here all type id 
    $('#hdnconvtype').val(convtype);
    $('#hdnindivual').val(toid);
    $('#hdngroupid').val(groupid);
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/ConversationAction',
         //url: "http://localhost:53746/api/TasQMessenger/ConversationAction",
         headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
        async:false,
        dataType: "json",
        data: JSON.stringify({
                              'cid': 0,
                               'groupid': groupid,
                               'fromuid': $('#hdnid').val(),
                               'touid': toid,
                               'msgtype': convtype,
                               'conv_childid':0,
                               'msg_tagids':'',
                                }),
        success: function (data) {
            if (data.Statuscode == 200) {
              
                  //if (convtype=="G")
                  //  $('#hdngroupid').val(data.Identifier);
                  //  else
                $('#hdnconvid').val(data.Identifier);
			 GetMessengerfeeds($('#hdngroupid').val(), $('#hdnconvid').val(), convtype);
                GetRecentConv();
                 
				  $("#divOpenOthersmsgs").css('display', 'block');
                  $('#divCloseOthersmsgs').css('display', 'none');
            }
            else {
                alert('Error');
            }
        }
    });
    return false;
}
function savechildconversationbytag()
{  
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/ConversationAction',
        //  url: "http://localhost:53746/api/TasQMessenger/ConversationAction",
        headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
        async: false,
        dataType: "json",
        data: JSON.stringify({
            'cid': $('#hdnconvid').val(),
            'groupid': $('#hdngroupid').val(),
            'fromuid': $('#hdnid').val(),
            'touid': $('#hdnindivual').val(),
            'msgtype': $('#hdnconvtype').val(),
            'conv_childid': 1,
            'msg_tagids': $('#hdnmsgtags').val(),
            'Child_ConvType': $('#ddltagtype').val()

        }),
        success: function (data) {
            if (data.Statuscode == 200) {
                //if (convtype=="G")
                //  $('#hdngroupid').val(data.Identifier);
                //  else
                $('#hdnconvid').val(data.Identifier);
                GetMessengerfeeds(0, $('#hdnconvid').val(), $('#hdnconvtype').val());
				Closeaddtagspop();
            }
            else {
                alert('Error');
            }
        }       
    });
    $('#txtusertags').val('');
}
function SaveMessenger()
{
    if ($('#txtupchat').html().trim() != '') {

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/MessengerAction',
            // url: "http://localhost:53746/api/TasQMessenger/MessengerAction",
            headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
            dataType: "json",
            data: JSON.stringify({
                'cid': 0,
                'action': "A",
                'Messengeraction': [{
                    'mid': 0,
                    'convid': $('#hdnconvid').val(),
                    'groupid': $('#hdngroupid').val(),
                    'fromuid': $('#hdnid').val(),
                    'touid': $('#hdnindivual').val(),
                    'desc': $('#txtupchat').html(),
                    'status': 'Y'
                }]
            }),
            success: function (data) {
                if (data.Statuscode == 200)
                {
					 $('#txtupchat').html('');
					   refresh_conv($('#hdnconvid').val(),$('#hdnindivual').val(),$('#hdnid').val(),$('#hdngroupid').val(),data.Identifier);
                    // var str = ''
                    

                    // var mats = getts();

                    // str += '<div class="feed"><div  class="msg-arrow"><div>' +
                    // $('#hdnusername').val() + '</div><div class="msg-arrow_text">' + $('#txtupchat').html()
                    // + '<div style="width:inherit;"><div style="float:right;"></div></div><div class="readst_' + $('#hdnindivual').val()
                    // + '" style="float:left;color:black">Sent</div><div style="width:inherit;"><div style="float:right;">' + mats + '</div></div>'
                    // if ($('#hdngroupid').val() > 0) {
                        // str += '<div style="position:absolute;"><img src="../images/Messenger/info_icontasq.png" style="margin-left:-18px;cursor:pointer;" title="view user info" onclick="MsgrOpen(' + data.Identifier + ')" /></div>';
                    // }
                    // str += '</div></div>'
                    // var cunt = 0;
                    // if ($('#divmiddlemsgs .rlpmsg-arrow').length == 0 && $('#divmiddlemsgs .msg-arrow').length == 0) {
                        // $('#divmiddlemsgs').html(str);
                        // cunt = 1;
                    // }
                    // else if (($('#divmiddlemsgs .rlpmsg-arrow').length > 0 || $('#divmiddlemsgs .msg-arrow').length > 0));
                    // {
                        // if (cunt == 0) {
                            // $('#divmiddlemsgs').append(str);
                        // }
                    // }

                 
                }
            }
        })
    }
    else
    {
        alert('Enter Message');
    }
}


function getts()
{
    mats = '';
    var dt = new Date();
    var mnth = dt.getMonth() + 1;
    if (mnth < 10) {
        mnth = '0' + mnth;
    }
    var d = dt.getDate();
    if (d < 10) {
        d = '0' + d;
    }
    var hrs = (dt.getHours() > 12) ? (dt.getHours() - 12) : dt.getHours();
    var mins = (dt.getMinutes() >= 10) ? dt.getMinutes() : "0" + dt.getMinutes();

    var hours = new Date().getHours();
    var hours = (hours + 24 - 2) % 24;
    var mid = 'am';
    if (hours == 0) { //At 00 hours we need to show 12 am
        hours = 12;
    }
    else if (hours > 12) {
        hours = hours % 12;
        mid = 'pm';
    }
    mats = (mnth + "/" + d + "/" + dt.getFullYear() + " " + hrs + ":" + mins + " " + mid);
    return mats;
}

function AttachfilesforMessenger() {
    $('#msgfileattach').val('');
    $('#msgfileattach').click();
  //  Savemessengerfiles();
    //return true; 
}
function Savemessengerfiles()
{
    var timewithmin = '', timeval = '';
    var test = new FormData();
    var selfilelen = $('#msgfileattach').get(0).files.length;
    var filename = $('#msgfileattach').val();
    var PostedFileName = filename.replace(/^.*\\/, "");
    if (selfilelen <= 0) {
        addErrorMessage('Select File');
    }
    else {
        var fileUpload = $('#msgfileattach').get(0);
        var files = fileUpload.files;
        for (var i = 0; i < files.length; i++) {
            test.append(fileUpload.files[i].name, fileUpload.files[i]);
        }
       // var url = 'http://localhost:53746/api/TasQMessenger/SaveMessengerFile?Identifier=0&Convid='+$('#hdnconvid').val()+'&filename='+PostedFileName +'&filetype='+$('#msgfileattach').val().split('.').pop()+
               //   '&status=Y&toid=' + $('#hdnindivual').val() + '&groupid=' + $('#hdngroupid').val() + '';
        var url = $('#hdntasqapiurl').val() + '/api/TasQMessenger/SaveMessengerFile?Identifier=0&Convid=' + $('#hdnconvid').val() + '&filename=' + PostedFileName + '&filetype=' + $('#msgfileattach').val().split('.').pop() +
                 '&status=Y&toid=' + $('#hdnindivual').val() + '&grpid=' + $('#hdngroupid').val() + '';
        $.ajax({
            type: "POST",
            contentType: false,
            processData: false,//"application/json; charset=utf-8",
            url: url,
            headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() }, //passing header values
            data: test,
            success: function (msg) {
				 $('#txtupchat').html('');
					   refresh_conv($('#hdnconvid').val(),$('#hdnindivual').val(),$('#hdnid').val(),$('#hdngroupid').val(),msg.Identifier);
                //console.log(msg)
                // $("#msgfileattach").val('');
                // var cunt = 0;
                // var mats = getts();

                // var str = '<div class="feed"><div  class="msg-arrow"><div>' + $('#hdnusername').val()
                    // +'</div><div style="float:left;margin-left:10px;width:inherit;"><img style="height:120px;" src='
                    // + $('#hdnsolutionurl').val() + '/MessengerFiles/' + msg.filename
                    // + '></div><div style="width:inherit;"><div style="float:right;">' +
                    // mats + '</div></div><div class="readst_" style="float:left;color:rgb(49, 232, 17);">Sent</div>'
                // if ($('#hdngroupid').val() > 0) {
                    // str += '<div style="position:absolute;"><img src="../images/Messenger/info_icontasq.png" style="margin-left:-18px;cursor:pointer;" title="view user info" onclick="MsgrOpen(' + msg.Identifier + ')" /></div>';
                // }
                // str += '</div></div>'
                // if ($('#divmiddlemsgs .rlpmsg-arrow').length == 0 || $('#divmiddlemsgs .msg-arrow').length == 0){
                    // $('#divmiddlemsgs').html(str);
                    // cunt = 1;
                // }
                // else if ($('#divmiddlemsgs .rlpmsg-arrow').length > 0 || $('#divmiddlemsgs .msg-arrow').length > 0);
                // {
                    // if (cunt == 0) {
                        // $('#divmiddlemsgs').append(str);
                    // }
                // }
            }
        });
    }
}

//$("input[name=msgfileattach]").change(function () {
  
//Savemessengerfiles()
//});
function getEmojiimage(e)
{
    $('#txtupchat').val('<img src="' + e + '" class="emoji_icon">');
}

function callemojis(expr) {
    $("#txtupchat").emoji({
        //button: "#btn",
        button: "",
        showTab: false,
        animation: 'slide',
        icons: [{
            name: "Emoji",
            path: "/images/Emoticons/",
            maxNum: 60,
            file: ".gif",
            placeholder: ":{alias}:",
            title: {
                1: "Smile", 2: "It wasn't me", 3: "Angry", 4: "Bandit", 5: "Hug", 6: "Laugh", 7: "Blushing", 8: "Bowing", 9: "Broken Heart", 10: "Cake", 11: "Call", 12: "Dollar", 13: "Clapping", 14: "Coffee",
                15: "Cool", 16: "Crying", 17: "Dancing", 18: "Devil", 19: "Doh!", 20: "Drink", 21: "Dull", 22: "See it", 23: "Giggle", 24: "Handshake", 25: "Happy", 26: "Banging head on wall", 27: "Squirrel", 28: "Hai", 29: "In love",
                30: "Thinking", 31: "You have mail", 32: "Smirking", 33: "Music", 34: "Nerdy", 35: "No", 36: "Nodding", 37: "Festive party", 38: "Cell", 39: "Pizza", 40: "Rain", 41: "Rock", 42: "Rolling on the floor", 43: "Sad", 44: "Shake", 45: "Sleepy", 46: "Speech less",
                47: "Star", 48: "Sun", 49: "Swearing", 50: "Sweating", 51: "Talking", 52: "Thinking", 53: "Time", 54: "Too much information", 55: "Cheeky", 56: "Wait a minute", 57: "Wink", 58: "Wondering", 59: "Tired", 60: "Yes"
            },
            alias: {
                1: "dgdf",
                2: "",
                3: "",
                4: "",
                5: "ku",
                6: "lu",
                7: "kaixin",
                8: "han",
                9: "lei",
                10: "heixian",
                11: "bishi",
                12: "bugaoxing",
                13: "zhenbang",
                14: "qian",
                15: "yiwen",
                16: "yinxian",
                17: "tu",
                18: "yi",
                19: "weiqu",
                20: "huaxin",
                21: "hu",
                22: "xiaonian",
                23: "neng",
                24: "taikaixin",
                25: "huaji",
                26: "mianqiang",
                27: "kuanghan",
                28: "guai",
                29: "shuijiao",
                30: "jinku",
                31: "shengqi",
                32: "jinya",
                33: "pen",
                34: "aixin",
                35: "xinsui",
                36: "meigui",
                37: "liwu",
                38: "caihong",
                39: "xxyl",
                40: "taiyang",
                41: "qianbi",
                42: "dnegpao",
                43: "chabei",
                44: "dangao",
                45: "yinyue",
                46: "haha2",
                47: "shenli",
                48: "damuzhi",
                49: "ruo",
                50: "ok",
                51: "dsd",
                52: "sample",
                53: "testing",
                54: "claps",
                55: "sad",
                56: "sadsmile",
                57: "angry",
                58: "wink",
                59: "tongue",
                60: "yes"
            },
        }]
    });

    $('.emoji_btn').hide();
    $('.emoji_preview').hide();

    if (expr == "S") {
        $('.divformojisdemo').show();
        // $('.emoji_container').show();
    }
    else { $('.divformojisdemo').hide(); }

    //$('#emoji_container_1', '#mCSB_1_scrollbar_vertical', '.emoji_tab', '.emoji_preview').css('display', 'block');
}
function getscroll(cntrl) {
    $.mCustomScrollbar.defaults.scrollButtons.enable = true; //enable scrolling buttons by default
    $.mCustomScrollbar.defaults.axis = "y"; //enable 2 axis scrollbars by default
    $("#" + cntrl).mCustomScrollbar({
        theme: "rounded-dark", mouseWheelPixels: 50,
        callbacks: {
            whileScrolling: function () {
            }
        }
    });
    $(".all-themes-switch a").click(function (e) {
        e.preventDefault();
        var $this = $(this),
           rel = $this.attr("rel"),
           el = $(".content");
        switch (rel) {
            case "toggle-content":
                el.toggleClass("expanded-content");
                break;
        }
    });
}

function CreateNew_Group() {
    $('#txtusersrch1').val('');
    $('#hdnuids').val('');
    $('#userselecteddiv').empty();
    $('#divuserselecteddiv').hide();
    $('#divsavegroup').hide();
    var expression = "";
    if ($('#hdnuids').val() != '') {
        expression = 'userid not in (' + $('#hdnuids').val().replace(/^,|,$/g, '') + ')'
    }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/userDetailsByAlphabet',
        headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
        dataType: "json",
        async: false,
        data: JSON.stringify({ 'userid': $('#hdnid').val(), 'exp': expression }),
        success: function (data) {
            var str = "<ul>";
            if (data.statuscode == 200) {
                $('#allusersdiv').empty();
                if (data.usrDetails.length > 0) {

                    $.each(data.usrDetails, function (key, value) {
                        var profileimage = value.userimage;
                        if (profileimage == "")
                            profileimage = "IMS\\DeafaultUserImg.jpg";
                        if (value.id != 0 && value.convtype == 'I') {
                            str += '<li onclick="Adduseridinto_group(' + value.id + ')" id="grli' + value.id + '" style="float:left;width:-webkit-fill-available;width:300px;cursor:pointer;"><div class="mesg_pic" style="background-image:url(' + $('#hdnwebroot').val() + profileimage.replace("\\", "\\\\\\\\") + ')"></div>';
                            str += '<div style="margin-top:15px;" class="msgname"> ' + value.name + '</div>';
                            str += '<div style="margin-top:15px;" class="mesg_text" style="word-break:break-word;">' + value.mail + '</div>';
                            str += '</li>';
                        }
                        //else
                        //    str += '<li ><div style="margin-left:28px;margin-top:10px;color:#e97622;font-weight:bold;">' + value.name + '</div></li>';
                    });
                    str += '</ul>';
                    $('#allusersdiv').append(str);
                    getscroll('divallusersdiv');
                }
                else {
                    $('#allusersdiv').html("<label style='position:absolute;;margin-left:80px;margin-top:15px'>no data found</label>");
                }
            }
            else {
                $('#allusersdiv').html("<label style='position:absolute;margin-left:80px;margin-top:15px'>no data found</label>");
            }
        }
    });

    // $('#userleftdiv').fadeOut();
    //$('#Group_crdiv').fadeIn();
    $('#popupupcreategroup').fadeIn();
}

function GetMembers() {

    var expression = "";
    if ($('#hdnuids').val() != '') {
        expression = 'userid not in (' + $('#hdnuids').val().replace(/^,|,$/g, '') + ')'
    }
    if (($('#txtusersrch1').val() != '') && ($('#hdnuids').val() != ''))
        expression = '  name like \'' + $('#txtusersrch1').val() + '%\'  and userid not in (' + $('#hdnuids').val().replace(/^,|,$/g, '') + ')';
    if (($('#txtusersrch1').val() != '') && ($('#hdnuids').val() == ''))
        expression = '  name like \'' + $('#txtusersrch1').val() + '%\'';
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/userDetailsByAlphabet',
        headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
        dataType: "json",
        async: false,
        data: JSON.stringify({ 'userid': $('#hdnid').val(), 'exp': expression }),
        success: function (data) {
            var str = "<ul>";
            if (data.statuscode == 200) {
                $('#allusersdiv').empty();
                if (data.usrDetails.length > 0) {

                    $.each(data.usrDetails, function (key, value) {
                        var profileimage = value.userimage;
                        if (profileimage == "")
                            profileimage = "IMS\\DeafaultUserImg.jpg";
                        if (value.id != 0 && value.convtype == 'I') {
                            str += '<li onclick="Adduseridinto_group(' + value.id + ')" id="grli' + value.id + '" style="float:left;width:-webkit-fill-available;width:300px;cursor:pointer;"><div class="mesg_pic" style="background-image:url(' + $('#hdnwebroot').val() + profileimage.replace("\\", "\\\\\\\\") + ')"></div>';
                            str += '<div style="margin-top:15px;" class="msgname"> ' + value.name + '</div>';
                            str += '<div style="margin-top:15px;" class="mesg_text" style="word-break:break-word;">' + value.mail + '</div>';
                            str += '</li>';
                        }
                        //else
                        //    str += '<li ><div style="margin-left:28px;margin-top:10px;color:#e97622;font-weight:bold;">' + value.name + '</div></li>';
                    });
                    str += '</ul>';
                    $('#allusersdiv').append(str);
                    getscroll('divallusersdiv');
                }
                else {
                    $('#allusersdiv').html("<label style='position:absolute;;margin-left:80px;margin-top:15px'>no data found</label>");
                }
            }
            else {
                $('#allusersdiv').html("<label style='position:absolute;margin-left:80px;margin-top:15px'>no data found</label>");
            }
        }
    });

}

function closePopupCreateGroup() {
    $('#popupupcreategroup').fadeOut();
}

function closenewgrdiv() {
    $('#userleftdiv').fadeIn();
    $('#Group_crdiv').fadeOut();
    $('#divuserselecteddiv').css('display', 'none');
    $('#divsavegroup').css('display', 'none');
    $('#userselecteddiv').empty();
    $('#hdnuids').val('');
}
function SaveNewGroup() {
	$('.TempJqueryCropImageShow').attr('src', '/images/aiq_logoupload.png');
	$('#imageData').val('');
    $('#txtgroupname').val('');
    $('#imgcrtgrp').css('display', 'none');

    $('#Group_crdiv').hide();
    $('#Groupicondiv').show();
	 
}
function backto_group() {
    $('#Group_crdiv').show();
    $('#Groupicondiv').hide();
}
function Adduseridinto_group(userid) {
    var uids = userid+','+$('#hdnuids').val();
    $('#hdnuids').val(uids);
    $('#grli' + userid).css('display', 'none');
    getselectedusers_forgroup();
}
function funcremoveid(userid) {
    var farry1 = $('#hdnuids').val();
    var farry2 = $.unique(farry1.split(','));
    for (var j = farry2.length - 1; j >= 0; j--) {
        if (farry2[j] === '' + userid + '' || farry2[j] === '0') {
            farry2.splice(j, 1);
        }
    }

    var finalfolwers = farry2.join(",");
    $('#hdnuids').val(finalfolwers);
    $('#grli' + userid).css('display', 'block');
    if (farry2 == "") {
        $('#userselecteddiv').empty();
        $('#divuserselecteddiv').css('display', 'none');
        $('#hdnuids').val('');
        $('#divsavegroup').css('display', 'none');
        GetMembers();
    }
    else {
        var uids = $('#hdnuids').val().replace(/(^\s*,)|(,\s*$)/g, '');
        $('#hdnuids').val(uids);
        getselectedusers_forgroup();
    }

}

function getselectedusers_forgroup() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/userDetailsByAlphabet',
        headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
        dataType: "json",
        async: false,
        data: JSON.stringify({ 'userid': $('#hdnid').val(), 'exp': 'userid  in (' + $('#hdnuids').val().replace(/(^\s*,)|(,\s*$)/g, '') + ')' }),
        success: function (data) {
            var i = 0;
            if (data.usrDetails.length > 0) {
                $('#userselecteddiv').empty();

                var userdata = "<ul>";
                var sign = '<img src="Images/tasQ/closetag.png" style="width:10px;margin-top:2px;">';
                $.each(data.usrDetails, function (key, value) {
                    userdata += '<a onclick="funcremoveid (' + value.id + ');" style="color:white;cursor:pointer;text-decoration: none;"><li style="margin:10px 10px 10px 10px;width:100px;height:20px;" class="bit-box" id="tbit' + value.id + '"><div class="stids" style="margin-left:14px;margin-top:4px;margin-bottom:-3px;">' + value.name
                             + '</div><a onclick="funcremoveid(' + value.id + ');" style="margin-left:2px;color:black;font-size:14px;float:right;cursor:pointer;margin-top: -12px;margin-right: -12px;text-decoration: none;">' + sign + '</a></li></a><br/>';
                });
                userdata += "</ul>";
                $('#userselecteddiv').html(userdata);
                getscroll('divuserselecteddiv');
                $('#divuserselecteddiv').css('display', 'block');
                $('#divsavegroup').css('display', 'block');
                if ($('#txtusersrch1').val() != '')
                {
                     $('#txtusersrch1').val('');
                     GetMembers();
                }
               
            }
            else {
                $('#divsavegroup').css('display', 'none');
                $('#divuserselecteddiv').css('display', 'none');
            }
        }

    });
}

function CreateNewGrp() {
    if ($('#addgroup').css('display') == 'block')
    {
        $('#addgroup').hide();
        $('#contactsdiv').hide();
         $('#messengercontent').css("height","640px");
        GetRecentConv();
    }
    else
    {
        $('#messengercontent').css("height","585px");
        $('#addgroup').show();
         $('#contactsdiv').show();
        GetTotalMembers();
    }
}

	function getchatscroll()
    {
        if($('#txtupchat').html().length>200)
        {
           // getscroll('txtchatupcontent');
        }
    }
    function saveMsguserTags() {
        var tagname = $('#txttag1').val();
        if (isEmpty(tagname)) {
            addErrorMessage("Enter User Tag");
            return displayErrors();
        }
        else {
            var strData = JSON.stringify({ 'Action': 'A', 'T_Id': 0, 'T_Name': tagname, 'T_Description': '', 'T_RoleIds': '', 'T_Created_UserId': $('#hdnid').val(), 'T_Updated_UserId': $('#hdnid').val(), 'T_Type': 'U' })
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/MessengerTagsAction',
                dataType: "json",
                headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
                data: strData,
                success: function (data) {
                    if (data.responsecode == '1') {
                        alert("Tag saved successfully");
                        if (data.Identifier > 0)
                            $('#hdnmsgtags').val(data.Identifier);

                        // bindsuggestedMsgTags(0, '', 0);
                        if (confirm('Do you want to add Tag to the Conversation?')) {
                            savechildconversationbytag();
                        }
                        else
                        {
                            $('#hdnmsgtags').val('');
                        }
                     }

                    else if (data.responsecode == '2')
                        alert("Tag already existed");
                    else
                        alert("Error occured");
                }

            });
        }

    }

    function ShowMsgData(e)
    {
        if (e.which == 13)
            saveautoselectedMsgTag();
        else
            AutoGetSuggMsgTags('txttag1');
    }
    
    function saveautoselectedMsgTag()
    {
     if ($('#hdnmsgtags').val() != 0 && $('#hdnmsgtags') != "")
        {
            addMsgtag($('#hdnmsgtags').val());
     }
     else
     {
         saveMsguserTags();
     }
    }

    function AutoGetSuggMsgTags(TargetControl) {
        $('#hdnmsgtags').val('');
        $('#' + TargetControl).autocomplete({
            source: function (request, response) {
                var text = $('#' + TargetControl).val();
                var exp = 'convert(varchar,MT_ID) not in (' + $('#hdnnotinMsgtags').val() + ') and MT_NAME like \'' + text + '%\'';
          
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: $('#hdntasqapiurl').val() + "api/TasQMessenger/GetAllTags",
                    data: JSON.stringify({ 'Identifier': 0, 'Expression': exp, 'Count': 0 }),
                    dataType: "json",
                    headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() }, //passing header values
                    async: true,
                    success: function (data) {
                   
                        if (data.StatusCode == "200") {
                        
                            response($.map(data.TagsList, function (item) {
                                return {
                                    label: item.tag_name,
                                    val: item.tag_id,
                                };
                            }));
                        }
                    },
                    error: function (result) {
                        // alert("Error");
                    }
                });
            },
            minLength: 0,
            autoFocus: true,
            focus: function (event, ui) {
                var a = ui.item.label;
                var b = ui.item.val;
                // var a = a.toUpperCase();
            },
            select: function (event, ui) {
                var a = ui.item.label;
                var b = ui.item.val;
                $('#hdnmsgtags').val(b);
            },
            change: function (event, ui) {
                if (!ui.item) {
                    this.value = '';
                    $('#hdnmsgtags').val('');
                 }
            }
        });       
    }


    function BindConversation(convid, tosuerid, fromid, groupid,msgid)
    {
        if ($('#hdnconvid').val() == convid ) {
            refresh_conv(convid, tosuerid, fromid, groupid,msgid);
        }
        else {
            refresh_counts();
            }
    }
    function refresh_conv(convid, tosuerid, fromid, groupid,msgid)
    {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            //url: "http://localhost:53746/api/TasQMessenger/GetTasQMessengerFeeds",
            url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/GetTasQMessengerFeeds',
            headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
            dataType: "json",
			  async:false,
            data: JSON.stringify({ 'msgidentifier':msgid,'convid': convid, 'expression': '', 'count': 0, 'Convtype': '' }),
            success: function (data) {
               
                var strdata = "";
                if (data.Statuscode == 200) {
                    if (data.messengerfeeds.length > 0) {
                        $.each(data.messengerfeeds, function (key, value) {
                            var str = '';
                        
                            if (value.MSG_TYPE == "S") {
                                str = '<div class="feed"><div class="statement"><div class="msg-arrow_text" style="margin: auto;"> <div style="width:inherit;float:rigth;"><div style="float:right;">' +
                                     LocalTimeConvertion1(value.MSG_CREATEDTS) + '</div></div></div><div style=" width: 50%;  float: right;">' +
                                     value.MSG_DESC + '</div></div></div>'
                            }
                            else {

                                var class1 = ""; var class2 = "";
                                var fromclass1 = "msg-arrow";
                                var fromtext1 = "msg-arrow_text";
                                var toclass2 = "rlpmsg-arrow";
                                var totext2 = "rlpmsg-arrow_text";
                                var timedata = '';
                                if (value.MSG_FROM_UID == $('#hdnid').val())
                                {
                                    class1 = "rlpmsg-arrow"; class2 = "rlpmsg-arrow_text";
                                    timedata= '<div style="width:inherit;"><div style="float:right;color:#fff;">' + LocalTimeConvertion1(value.MSG_CREATEDTS) + '</div></div>';
                                }
                                else
                                {
                                    class1 = "msg-arrow"; class2 = "msg-arrow_text";
                                    timedata = '<div style="width:inherit;"><div style="float:right;color:#3097ff;">' + LocalTimeConvertion1(value.MSG_CREATEDTS) + '</div></div>';
                                }

                                var messageformat = "";
                                if (value.MSG_TYPE == "F")
                                    messageformat = '<div style="float:left;margin-left:10px;width:inherit;"><img style="height:120px;" src=' + $('#hdnsolutionurl').val() + '/MessengerFiles/' + value.MSGFILE + '></div><br>';
                                else
                                    messageformat = '<div class=' + class2 + '>' + value.MSG_DESC.replace(/(~~)/g, '<')  + '</div>';

                                str += '<div class="feed"><div  class=' + class1 + '><div>' + value.FromUserName + '</div>';
                                str += messageformat;
                           
                                if (value.MSG_FROM_UID == $('#hdnid').val() && value.MSG_GR_ID == 0) {

                                    str += '<div class="readst_' + value.MSG_TO_UID + '" style="float:left;color:rgb(49, 232, 17);">' + value.MSG_READSTATUS + '</div>';
                                }
                                else if (value.MSG_FROM_UID == $('#hdnid').val() && value.MSG_GR_ID > 0) {

                                    str += '<div style="position:absolute;"><img src="../images/Messenger/info_icontasq.png" style="margin-left:-10px;cursor:pointer;" title="view user info" onclick="MsgrOpen(' + value.MSG_ID + ')" /></div>';
                                }
                                else {
                                    str += '<div  style="float:left;"></div><div class="clear"></div>';
                                }
                                // str += '<img style="height:120px;" src=' + $('#hdnsolutionurl').val() + '/MessengerFiles/' + info.filename + '>';
                                str += '</div></div>';
                            }
                                strdata = str + strdata;
                            
                        });
                        $('#divmiddlemsgs').append(strdata);
						
						// if (data.messengerfeeds.length<5)
                        // {
                            // $('#prevmore').css("display","none");
                        // }
                        // else{
                            // $('#prevmore').css("display","block");
                        // }
                     }
                    // else {
                        // $('#divmiddlemsgs').html("<div style='margin-top:150px;'><label style='color:black;position:absolute;;margin-left:300px;'>no data found</label></div>");
                   // // $('#prevmore').css("display","block");
					// }
                   // Tasqobj.server.getReadStatus(convid, $('#hdnid').val());
                }
                // else {
                    // $('#divmiddlemsgs').html("<div style='margin-top:150px;'><label style='color:black;margin-left:300px;'>no data found</label></div>");
                // }
            }
        });
        //getmsgfeedscroll('divmiddlemsgs');
		   $("#mCSB_1_container .mCSB_container").mCustomScrollbar("scrollTo", "bottom", { scrollInertia: 0, timeout: 0, callbacks: false });
		//$("#mcs_container").mCustomScrollbar("scrollTo", "bottom", { scrollInertia: 0, timeout: 0, callbacks: false });
    }
    function refresh_counts()
    {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/GetConversationCounts',
            headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
            dataType: "json",
            //async: false,
            data: JSON.stringify({ 'Identifier': $('#hdnid').val(), 'Count': 0 }),
            success: function (data) {
                if (data.StatusCode == 200) {
                    var licount = $("ul").children().length;
                    var IDS = [];
                    $('#ulmsg').find("li").each(function () { IDS.push(this.id) });
                    var conv = data.ConversationCountsList;
                    if (conv.length > 0) {
                        $.each(conv, function (key, value) {
                            if (value.cu_type == 'I') {
                                if ($('#li' + value.cu_user_id + '_' + value.cu_type + '').index() != -1 && value.cu_count != 0) {
                                    var recentdata = $('#li' + value.cu_user_id + '_' + value.cu_type + '').html();
                                    $('#li' + value.cu_user_id + '_' + value.cu_type + '').remove();
                                    $('#ulmsg').prepend('<li onclick="saveconversationinfo(' + value.cu_user_id + ',\'' + value.cu_type + '\')" id="li' + value.cu_user_id + '_' + value.cu_type + '" style="float:left;width:-webkit-fill-available;width:300px;">' + recentdata + '</li>');

                                    $('#sp' + value.cu_user_id + '_' + value.cu_type + '').css('display', 'block');
                                    $('#sp' + value.cu_user_id + '_' + value.cu_type + '').text(value.cu_count);
                                }
                            }
                            else if (value.cu_type == 'G') {
                                if ($('#li' + value.cu_group_id + '_' + value.cu_type + '').index() != -1 && value.cu_count != 0) {
                                    var recentdata = $('#li' + value.cu_group_id + '_' + value.cu_type + '').html();
                                    $('#li' + value.cu_group_id + '_' + value.cu_type + '').remove();
                                    $('#ulmsg').prepend('<li onclick="saveconversationinfo(' + value.cu_group_id + ',\'' + value.cu_type + '\')" id="li' + value.cu_group_id + '_' + value.cu_type + '" style="float:left;width:-webkit-fill-available;width:300px;">' + recentdata + '</li>');

                                    $('#sp' + value.cu_group_id + '_' + value.cu_type + '').css('display', 'block');
                                    $('#sp' + value.cu_group_id + '_' + value.cu_type + '').text(value.cu_count);
                                }
                            }
                        });
                    }
                }
            }
        });
       // getscroll('messengercontent');

    }

    function refresh_readstatus(convid,userid)
    {
        if ($('#hdnconvid').val() == convid)
        { $('.readst_' + userid).html('seen').css('color', 'rgb(49, 232, 17)'); }
    }

    function MsgrOpen(msgid) {
        $("#divViewMsgDetails").css('display', 'block');

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/GetMessengerUsersReadStatus',
            headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
            dataType: "json",
            data: JSON.stringify({ 'Identifier': msgid }),
            success: function (data) {
                var output = data.UsersList;
                var tr = '<tr>';
                $('#tblMsgrDetails').html('');
                if (data.StatusCode == "200") {
                    for (var i = 0; i < output.length; i++) {
                        var image2 = output[i].UserImg;
                        var image = image2.replace(/\\/g, '/');
                        var path = "https://demointelhq.aiqware.com/";
                        var imagepath = path + '/' + image;
                        if (image == "")
                            imagepath = path + '/' + "IMS/DeafaultUserImg.jpg";
                        else
                            imagepath = imagepath;


                        tr += '<td> <div style="width:35px;height:35px;display:block;margin-left:2px;margin-right:5px;float: left;border-radius: 50px;border: 1.5px solid #fff;background-size: cover;background-position: center center;background-image:url(' + imagepath + ')"></div><div style="height:35px;margin-top:10px;border-bottom:1px solid dimgray;"><label style="color:white;">' + output[i].ToUserName + '</label>  @ ';
                        tr += '<label style="color:#f56f1c;">' + LocalTimeConvertion1(output[i].TS) + '</label></div> <br/>';
                        tr += '</td></tr>';
                    }
                    $('#tblMsgrDetails').append(tr);
                }
                else
                    if (data.StatusCode == "400") {
                        tr += '<td><div><label style="color:white;margin-left:200px;"> No Users Found..! </label></div>';
                        $('#tblMsgrDetails').append(tr);
                    }
            }
        });
    }

    function MsgrClose() {
        $("#divViewMsgDetails").fadeOut();
    }

   function GroupuserActions(Userid, totalparticipants) {
        $('#hdngrpuserIndividual').val(Userid);
        $('#hdntotalparticipants').val('');
        $('#hdnremoveduser').val('');        
        $('#hdnremoveduser').val($('#divpartsname' + Userid + '').html());
        $('#hdntotalparticipants').val(totalparticipants);
        var desc = '';
        if (Userid == $('#hdnid').val())
            desc = 'Exit Group';
        else
            desc = 'Remove User';
        $('#divlinkdesc').html(desc);
        $('#popgrpparticipants').css('display', 'block');
    }


    function Closegrpinfo() {
        $('#popgrpparticipants').css('display', 'none');
    }
    function ConfirmRemoveuser() {
        if (confirm('Do you want to remove this user from the group?')) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/RemoveUserfromGroup',
                // url: "http://localhost:53746/api/TasQMessenger/RemoveUserfromGroup",
                headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
                dataType: "json",
                data: JSON.stringify({
                    'groupid': $('#hdngroupid').val(),
                    'userid': $('#hdngrpuserIndividual').val(),
                    'convid': $('#hdnconvid').val(),
                    'totalparticipants': $('#hdntotalparticipants').val()
                }),
                success: function (data) {
                    if (data.Statuscode == 200) {
                        $('#divpartpts_' + $('#hdngrpuserIndividual').val() + '').remove();
                        alert('User Removed');
                        Closegrpinfo();
                        $('#divurscount').html(($('#hdntotalparticipants').val() - 1) + " Participants");
                        /*Binding of Feeds*/
                        BindActionFeeds($('#hdnremoveduser').val(),'D');
                        /*END of Binding Feeds*/

                    }
                }
            });
        }
    }





    function refresh_removeduser(groupid, removedid, totalparticipants) {
        //$('#hdngroupid').val() == groupid &&
        if (removedid == $('#hdnid').val()) {
            $('#hdngroupid').val(0);
            $('#hdnconvid').val(0);
            $('#divpartpts_' + removedid + '').remove();
            $('#divurscount').html((totalparticipants - 1) + " Participants");
            $('#li' + groupid + '_G').remove();

        }
    }

    function GetUserparticipants() {
        $('#popaddgrpparticipants').css('display', 'block');
        // var url = 'http://localhost:53746/api/TasQMessenger/GetUserparticipants';
        var url = $('#hdntasqapiurl').val() + 'api/' + 'TasQMessenger/GetUserparticipants';
        var WebPath = $('#hdnwebroot').val();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify({ 'groupid': $('#hdngroupid').val() ,'exp':$('#txtgrpusersrch').val() }),
            headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() }, //passing header values
            dataType: "json",
            success: function (msg) {
                var i = 0;
                var assignusers = '';
                $.each(msg.UsersList, function (key, val) {
                    var ID = msg.UsersList[key].USERID;
                    var Name = msg.UsersList[key].ToUserName;
                    var Img = WebPath.replace(";", "") + msg.UsersList[key].UserImg.replace("\\", "\\\\\\\\");
                    // var Location = msg[key].Location;

                    if (msg.UsersList[key].Image == "") {
                        Img = WebPath.replace(";", "") + "/IMS/DeafaultUserImg.jpg";
                    }
                    assignusers += '<div style="float:left;width:280px;margin-left:20px;">';
                    assignusers += '<table class="create" style="list-style-type: none; cursor:pointer;">';
                    assignusers += '<tr onclick="selectAssignerM(this)" ><td><li id=' + ID + '>';
                    assignusers += '<td onclick="selectAssignerM(this)" style="cursor:default;">';
                    assignusers += '<input type="checkbox" class="chkauser' + ID + '" id="chkSelectAssignedUserM' + ID + '_' + Name + '" name="AssignedSubmitM" style="height:22px;cursor:pointer;"/>';
                    assignusers += '<label for="NameVal"' + ID + '  style="float:right;height:22px;"></label></td><td><div class="GM_userProfileGrid" ><div class="GM_userProfileGridInner" >';
                    assignusers += '<div class="GM_userProfileGridImg" style="background-image:url(' + Img + ')"></div><div class="GM_userProfileGridData">';
                    assignusers += '<div class="GM_userProfileGridDataInner" style="margin-top:6px"><div class="GM_userName">' + Name + '</div> </div></div></div></div></td></li></td></tr></table></div>';
                    i++;
                });
                $('#divgrpusers').html('');
                if (i > 0) {
                    $('#divgrpusers').html(assignusers);
                }
                if (i == 0) {
                    $('#divgrpusers').html('<div style="margin-left: 290px;color:white">No User Found</div>');
                }

            }
        });
        getscroll('divgrpusersContent');
    }

    function LocalTimeConvertion1(DateTime) {

        var utcDate = moment.utc(DateTime);
        var dateWithTimezone = utcDate.local().format('MM/DD/YYYY hh:mm A');
        return dateWithTimezone;
    }

    function selectAssignerM(row) {
        var firstInput = row.getElementsByTagName('input')[0];
        firstInput.checked = !firstInput.checked;
        var chkperson = row.getElementsByTagName('input')[0].id.split('_');
    }

    function ChkAddparticipants() {
        $('#hdnAddedgrpuser').val('');
        var rtrv = "";
        var data = '';
        var ID = '';
        var names = '';
        var selectedUsers = '';
        $('input[name="AssignedSubmitM"]:checked').each(function () {
            if ($(this).is(':checked')) {
                var details = '';
                details = $(this)[0].id.replace('chkSelectAssignedUserM', '').split('_');
                data = data + details[0] + ',';
                names =names+ details[1] +',';
                ID = details[0];
            }
        });
        if (isEmpty(data)) {
            addErrorMessage('Select Users');
            return displayErrors();
        }
        if (data.endsWith(",")) {
            data = data.substring(0, data.length - 1);
            names = names.substring(0, names.length - 1);
        }
        $('#hdnAlladdedUsers').val(names);
        var userslist = '';
        userslist = data;        
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/AddusersInGroup',
            // url: "http://localhost:53746/api/TasQMessenger/AddusersInGroup",
            headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
            dataType: "json",
            data: JSON.stringify({
                'groupid': $('#hdngroupid').val(),
                'userslist': data,
                'convid': $('#hdnconvid').val()
            }),
            success: function (data) {
                if (data.Statuscode == 200) {
                    alert('User Added successfully');
                     /*This is for binding all the group Users*/
                   // Tasqobj.server.adduserInGrouprefresh($('#hdngroupid').val(),userslist);
                    BindnewlyAddedUsersInGroup();
                    /*End of binding all the group Users*/
                    /*Binding Feeds here*/
                    BindActionFeeds($('#hdnAlladdedUsers').val(),'A');
                    /* END of  Binding Feeds */
                    
                }
            }
        });
        $('#popaddgrpparticipants').css('display', 'none');

    }

 function BindActionFeeds(userids,Action)
    {
        var statement = '';
        if (Action == "A")
            statement = " added by ";
        else
            statement =" removed by "
        /*Binding Feeds here*/
        var addeddata = '';
        var mats = getts();
        addeddata += '<div class="feed"><div class="statement">'
        addeddata += '<div class="msg-arrow_text" style="margin: auto;">'
        addeddata += '<div style="width:inherit;float:rigth;">'
        addeddata += '<div style="float:right;">' + mats + '</div></div></div>'
        addeddata += '<div style="width:50%;float:right;">' + userids + statement + $('#hdnusername').val() + '</div></div></div>';
        $('#divmiddlemsgs').append(addeddata);
        /* END of  Binding Feeds */
    }

    function refresh_addeduseringrp(groupid, userslist) {
        //$('#hdngroupid').val() == groupid &&
        if ($('#hdngroupid').val() == groupid) {
            BindnewlyAddedUsersInGroup();
        }
        else {
            var str = userslist;
            var split_str = str.split(",");
            for (var i = 0; i <= split_str.length;i++)
            {
                if(split_str[i]==$('#hdnid').val())
                {
                    GetTotalMembers();
                }
            }          
        }
    }


   function BindnewlyAddedUsersInGroup()
    {
      var groupparticipents = '';
        /*This is for binding all the group Users*/
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/GetAllGroupusersInfo',
            headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
            dataType: "json",
            data: JSON.stringify({
                'convid': $('#hdnconvid').val()
            }),
            success: function (data) {
                if (data.Statuscode == 200) {
                    $('#divurscount').html(data.ConvsationUsers.length + ' Participants');
                    $.each(data.ConvsationUsers, function (key, value) {
                        groupparticipents += '<div id="divpartpts_' + value.UserId + '" onclick=GroupuserActions(\'' + value.UserId + '\',\'' + data.ConvsationUsers.length + '\') style="cursor:pointer;" class="tagged_par">';
                        groupparticipents += '<div  class="tag_person" style="background:url(' + $('#hdnwebroot').val() + value.Userimage.replace("\\", "\\\\\\\\") + ') center center / contain no-repeat;" ></div>';
                        groupparticipents += '<div id="divpartsname' + value.UserId + '" class="tag_person_name">' + value.UserName + '</div>';
                        groupparticipents += '<div class="tag_person_desg">' + value.Rolename + '</div></div>';
                    });
                    $('#divparticipents').html(groupparticipents);
                    getscroll('divparticipents');
                }
            }
        });
        /*End of binding all the group Users*/
    }

   function openpopupgroup()
    {
        $('[id$=popupupdategroup]').fadeIn();
        $('#txtpopupgrpname').val('');
        var iCON = '';
        iCON = $('#hdngroupimagename').val();
        if (iCON == "")
            $('.TempJqueryCropImageShow').attr('src', '/images/aiq_logoupload.png');
        else if (iCON.indexOf('IMS') == -1)
        {
            iCON = "IMS\\" + iCON;
            iCON = $('#hdnwebroot').val() + iCON.replace("\\", "\\\\\\\\");
            $('.TempJqueryCropImageShow').attr('src', iCON);
        }
            
        $('#imageData').val('');
        var grpname = $('#divbigname').html();
        $('#txtpopupgrpname').val(grpname);

    }
    function closePopupUpdateGroup() {
        $('[id$=popupupdategroup]').fadeOut();
    }

    function updateGroup() {
        var id= $('#hdngroupid').val();
        var imgdata='';
        if($('#imageData').val()=='')
            imgdata="";
        else
            imgdata=$('#imageData').val()
        var grpname=$('#txtpopupgrpname').val();
        var strdata = JSON.stringify({ 'Id':id , 'Imagedata':imgdata ,'GroupName':grpname  });
       
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: $('#hdntasqapiurl').val() +'api/TasQMessenger/CallSaveImage',
            data: strdata,
            dataType: "json",
            headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
            async: false,
            success: function (data) {
                if(data.responsecode==200)
                {
                    var imgname = data.ImageName;
                    if (imgname == "")
                        imgname = "IMS\\DeafaultUserImg.jpg";
                    else
                        imgname = "IMS\\" + imgname;
                    imgname = $('#hdnwebroot').val() + imgname.replace("\\", "\\\\\\\\");
                    $('#hdngroupimagename').val(imgname);
                    updateAll(imgname, id, grpname);
                    alert("Group updated successfully");

                }
                else
                {
                    alert("Something went wrong!!!");
                }
                closePopupUpdateGroup();
            },
        });
    }
     function updateAll(imgname,grpid,grpname)
    {
        var divid = '';
        divid = '#Convimg' + grpid;
        var divname = '';
        divname = '#Convname' + grpid;
        var ele = '', element = '';;
        ele = $(divname)[0].innerHTML.indexOf("<font");
        if (ele > -1)
        {
            element = '<font style="color:#e97622">'+grpname+'</font>';
           $(divname).html(element);
        }
       else
            $(divname).html(grpname);
        $('#divmsg_bigprof').css('background-image', 'url(' + imgname + ')');
        $('#divmdl_profile').css('background-image', 'url(' + imgname + ')');
        $(divid).css('background-image', 'url(' + imgname + ')');
              
        $('#divmdl_name').html(grpname);
        $('#divbigname').html(grpname);
    }
	
    function GetPrevMsgfeeds()
    {
		$('#prevmore').css("display","block");
	var strdata="";
        var count = $('#divmiddlemsgs .feed').length;
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            //url: "http://localhost:53746/api/TasQMessenger/GetTasQMessengerFeeds",
            url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/GetTasQMessengerFeeds',
            headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
            dataType: "json",
            data: JSON.stringify({ 'msgidentifier': 0, 'convid': $('#hdnconvid').val(), 'expression': '', 'count': count, 'Convtype': '' }),
            success: function (data) {
                if (data.Statuscode == 200) {
                    if (data.messengerfeeds.length > 0) {
                        $.each(data.messengerfeeds, function (key, value) {
                            var str = '';

                            if (value.MSG_TYPE == "S") {
                                str = '<div class="feed"><div class="statement"><div class="msg-arrow_text" style="margin: auto;"> <div style="width:inherit;float:rigth;"><div style="float:right;">' +
                                     LocalTimeConvertion1(value.MSG_CREATEDTS) + '</div></div></div><div style=" width: 50%;  float: right;">' +
                                     value.MSG_DESC + '</div></div></div>'
                            }
                            else {

                                var class1 = ""; var class2 = "";
                                var fromclass1 = "msg-arrow";
                                var fromtext1 = "msg-arrow_text";
                                var toclass2 = "rlpmsg-arrow";
                                var totext2 = "rlpmsg-arrow_text";
                                var timedata = '';
                                if (value.MSG_FROM_UID == $('#hdnid').val())
                                {
                                    class1 = "rlpmsg-arrow"; class2 = "rlpmsg-arrow_text";
                                    timedata = '<div style="width:inherit;"><div style="float:right;color:#fff;">' + LocalTimeConvertion1(value.MSG_CREATEDTS) + '</div></div>';
                                }
                                else
                                {
                                    class1 = "msg-arrow"; class2 = "msg-arrow_text";
                                   
                                    timedata = '<div style="width:inherit;"><div style="float:right;color:#3097ff;">' + LocalTimeConvertion1(value.MSG_CREATEDTS) + '</div></div>';
                                }

                                var messageformat = "";
                                if (value.MSG_TYPE == "F")
                                    messageformat = '<div style="float:left;margin-left:10px;width:inherit;"><img style="height:120px;" src=' + $('#hdnsolutionurl').val() + '/MessengerFiles/' + value.MSGFILE + '></div><br>';
                                else
                                    messageformat = '<div class=' + class2 + '>' + value.MSG_DESC.replace(/(~~)/g, '<')  + '</div>';

                                str += '<div class="feed"><div  class=' + class1 + '><div>' + value.FromUserName + '</div>';
                                str += messageformat;

                                str += timedata;

                                if (value.MSG_FROM_UID == $('#hdnid').val() && value.MSG_GR_ID == 0) {

                                    str += '<div class="readst_' + value.MSG_TO_UID + '" style="float:left;color:rgb(49, 232, 17);">' + value.MSG_READSTATUS + '</div>';
                                }
                                else if (value.MSG_FROM_UID == $('#hdnid').val() && value.MSG_GR_ID > 0) {

                                    str += '<div style="position:absolute;"><img src="../images/Messenger/info_icontasq.png" style="margin-left:-10px;cursor:pointer;" title="view user info" onclick="MsgrOpen(' + value.MSG_ID + ')" /></div>';
                                }
                                else {
                                    str += '<div  style="float:left;"></div>';
                                }
                                // str += '<img style="height:120px;" src=' + $('#hdnsolutionurl').val() + '/MessengerFiles/' + info.filename + '>';
                                str += '</div></div><div class="clear"></div>';
                            }
                            strdata = str + strdata;

                        });
                        $('#divmiddlemsgs').prepend(strdata);
							
                        if (data.messengerfeeds.length<5)
                        {
                            $('#prevmore').css("display","none");
                        }
                        else{
                            $('#prevmore').css("display","block");
                        }

                    }
                }
            }
                
        });
    }
	
	
    function changeConvtype()
    {
        $('#txttag1').val('').css('display','none');
        $('#txttag2').val('').css('display','none');
        $('#txttag3').val('').css('display','none');
        var ddltype = $('#ddltagtype').val();
        $('#txttag' + ddltype).css('display', 'block');
    }
        
    function Showtagspopup()
    {
        $('#divaddtagspop').css('display', 'block');
    }

    function Closeaddtagspop()
    {
        $('#divaddtagspop').css('display', 'none');
        $('#txttag1').val('').css('display', 'block');
        $('#txttag2').val('').css('display', 'none');
        $('#txttag3').val('').css('display', 'none');
        $('#ddltagtype').val(1);
    }
    function savetags_details()
    {
        if ($('#ddltagtype').val() == 1)
        {
            if ($('#hdnmsgtags').val() != 0 && $('#hdnmsgtags') != "")
                {
            addMsgtag($('#hdnmsgtags').val());
             }
     else
            {
         saveMsguserTags();
            }
            
        }
        else if($('#ddltagtype').val() == 2 || $('#ddltagtype').val() == 3)
        {
            savechildConvetyep()
        }

    }


    function savechildConvetyep() {
        var chldconvtype = $('#ddltagtype').val();
        var convtype = $('#txttag' + chldconvtype).val();
        if (isEmpty(convtype)) {
            if (chldconvtype == 2)
                addErrorMessage("Enter Ticket");
            else if (chldconvtype == 3)
                addErrorMessage("Enter Dealer");

            return displayErrors();
        }
        else {
            var strData = JSON.stringify({ 'Action': 'A', 'T_Id': 0, 'T_Name': convtype, 'T_Description': '', 'T_RoleIds': '', 'T_Created_UserId': $('#hdnid').val(), 'T_Updated_UserId': $('#hdnid').val(), 'T_Type': chldconvtype })
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: $('#hdntasqapiurl').val() + 'api/TasQMessenger/ChildConvAction',
                dataType: "json",
                headers: { "userid": $('#hdnid').val(), "token": $('#apitoken').val() },
                data: strData,
                success: function (data) {
                    if (data.responsecode == '1') {
                      
                        if (data.Identifier > 0)
                            $('#hdnmsgtags').val(data.Identifier);
                        // bindsuggestedMsgTags(0, '', 0);
                        if (confirm('Do you want to add Tag to the Conversation?')) {
                            savechildconversationbytag();
                        }
                        else {
                            $('#hdnmsgtags').val('');
                        }
                    }
               }

            });
        }

    }