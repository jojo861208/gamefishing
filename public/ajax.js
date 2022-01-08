// $("#game_form").submit(function(e) {
//     var form = $(this);
//     let formData = new FormData(form)
//     formData.append('cost', cost)
//     $.ajax({
//            type: "POST",
//            url: 'http://localhost:3000/get_alluser',
//            data: formData,
//            success: function(data)
//            {
//                alert(data); // show response from the php script.
//            }
//          });

//     e.preventDefault(); // avoid to execute the actual submit of the form.
// });
root_url = "http://localhost:3000";
//root_url = "gamefishing.heroku.com"
function register() {
    let group_id = document.getElementById('GroupName').value;
    console.log(group_id);
    let game_id = document.getElementById("RoomID").value;
    console.log(game_id);
    var params = 'group_id=' + group_id + '&game_id=' + game_id;
    var req = new XMLHttpRequest();
    req.open("POST", root_url + "/client/register", true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send(params)
    req.onload = function() {
        reqdata = JSON.parse(req.responseText);
        if (reqdata["success"] == true) {
            window.location = 'Client_Home_Action.html'
        } else {
            alert(reqdata['message'])
        }
    }
}

function getgroupinfo() {
    var v1 = sessionStorage.getItem('gn')
    var v2 = sessionStorage.getItem('room')
    console.log(v1 + " " + v2)
    var req = new XMLHttpRequest();
    //var group_id = "peter9999";
    //var game_id = "2";
    var group_id = v1;
    var game_id = v2;
    req.open("GET", root_url + "/client/get_group_info" + "?group_id=" + group_id + "&game_id=" + game_id);
    console.log(req.status);
    req.onload = function() {
        reqdata = JSON.parse(req.responseText);
        if (reqdata["success"] == true) {
            fish_count = round = reqdata["message"]["fish_count"];
            round = reqdata["message"]["round"];
            ship_count = reqdata["message"]["ship_count"];
            console.log("漁獲量 : " + fish_count + " 回合 : " + round + " 船 : " + ship_count);
            document.getElementById('grounpname').innerHTML = v1;
            document.getElementById('fishes').innerHTML = fish_count;
            document.getElementById('ships').innerHTML = ship_count;
            document.getElementById('rounds').innerHTML = round;
        } else if (reqdata["success"] == false) {
            alert(reqdata['message']);
        }
    }
    req.send();
}


    
function open_game(){
    let group_number = sessionStorage.getItem('gn');
    console.log("我有拿到"+group_number);
    //var params = 'group_number='+group_number;
    var req = new XMLHttpRequest();
    req.open("GET",root_url + "/admin/open_game"+"?num_of_group="+group_number);
    console.log(req.status);
    req.onload=function(){
        reqdata=JSON.parse(req.responseText);
        if(reqdata["success"]==true){
            window.location.href=root_url+"/ready_1.html";
        //game_id = round = reqdata["message"]["game_id"];
        //console.log("game_id:"+ game_id);
        // document.getElementById('fishes').innerHTML =fish_count;
        }
        else if(reqdata["success"]==false){
            alert(reqdata['message']);
        }
    }
    req.send();
}

// function check_rank(){
//     let game_id = document.getElementById('Game_id').value;
//     console.log(game_id);
//     var params = 'game_id='+game_id_id;
//     var req = new XMLHttpRequest();
//     req.open("GET",root_url + "/admin/check_rank"+"?number_of_group="+game_id);
//     console.log(req.status);
//     req.onload=function(){
//         reqdata=JSON.parse(req.responseText);
//         if(reqdata["success"]==true){
//         game_id = round = reqdata["message"]["game_id"];
//         console.log("game_id:"+ game_id);
//         // document.getElementById('fishes').innerHTML =fish_count;
//         }
//         else if(reqdata["success"]==false){
//             alert(reqdata['message']);
//         }
//     }
//     req.send();
// }

