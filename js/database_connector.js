// command processing
function get_command(){
    var command = document.getElementById("terminal-input").value;
    var text_command = "<div id=command-input> > "+command+"</div>";
    document.getElementById("terminal-monitor").innerHTML += text_command;
    document.getElementById("terminal-input").value = "";

    command_process(command);
}

function command_response(response){
    var text_response = "<div id=command-response> "+response+"</div>";
    document.getElementById("terminal-monitor").innerHTML+=text_response;
}

function json_to_table(data_json){
    console.log("data_json -- ", data_json);
    data_after_parse = JSON.parse(data_json);
    attribute = data_after_parse.attribute[0];
    data = data_after_parse.data_tuple;
    console.log("attribute -- ", attribute);
    console.log("data_tuple -- ", data);
    // command.log("data_tuple_size".data.size);

    var html_text = "<table class=table table-bordered><thread><tr>";
    var i = 0;

    for (i=0; i < attribute.length; i++){
        html_text += "<th>"+attribute[i]+"</th>";
    }
    html_text += "</tr></thread><tbody>";

    for(i=0; i< data.length; i++){
        html_text+="<tr>";
        for(var j = 0 ; j<data[i].length;j++){
            html_text+="<th>"+data[i][j]+"</th>"
        }
        html_text+="</tr>";
    }

    html_text+="</tbody></table>"

    document.getElementById("data-output-text").innerHTML=html_text;
}

function command_process(command_text){
    command = command_text.substring(0,command_text.indexOf("("));
    variable_input = command_text.substring(command_text.indexOf("(")+1,command_text.lastIndexOf(")"));
    switch(command){
        case "connect_database":
            call_to_connect(variable_input);
            break;
        case "close_database":
            close_database();
            break;
        case "get_attribute":
            get_attribute();
            break;
        case "set_attribute_table":
            var at = variable_input.substring(variable_input.indexOf("[")+1,variable_input.indexOf("]"));
            var tab = variable_input.substring(variable_input.lastIndexOf("[")+1,variable_input.lastIndexOf("]"));
            set_attribute_table(at,tab);
            console.log("variable_input -- ", variable_input);
            console.log("attribute from command -- ",at);
            console.log("table from command -- ", tab);
            break;
        case "set_limit":
            set_limit(variable_input);
            break;
        default:
            command_response("Command not found. Please try again.");
            break;
    }
}

function call_to_connect(database_name){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // response = JSON.parse(this.responseText);
            // command_response(response.message);
            command_response(JSON.parse(this.responseText).message);
       }
       else if(this.readyState == 4 && this.status != 200){
            command_response("Failed connecting database");
       }
    };
    xhttp.open("GET", "http://localhost:8070/connect-database/"+database_name, true);
    xhttp.send();
}

function close_database(){
    $.ajax("http://localhost:8070/close-database"
    ).done(function(){
        command_response("Database Closed Successfully.");
    }).failed(function(){
        command_response("Database Closed Failed");
    });
}

function get_attribute(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            command_response("Getting attribute done");
            
            response = JSON.parse(this.responseText);
            var i = 0
            var html_text = " <table class=table table-bordered><tbody><tr><td>Static Attribute</td><td>"+response.desc_stat+"</td></tr>"
            html_text += "<tr><td>Temporal Attribute</td><td>"+response.desc_temp+"</td></tr></tbody></table>"

            document.getElementById("data-output-text").innerHTML = html_text;
       }
       else if(this.readyState == 4 && this.status != 200){
            command_response("Failed getting attribute")
       }
    };
    xhttp.open("GET", "http://localhost:8070/get-attribute", true);
    xhttp.send(); 
}

function set_attribute_table(attribute, table){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // response = JSON.parse(this.responseText);
            // command_response(response.message);      
            json_to_table(this.responseText);
            // document.getElementById("data-output-text").innerHTML = this.responseText;
       }
       else if(this.readyState == 4 && this.status != 200){
            command_response("Failed connecting database");
       }
    };
    xhttp.open("GET", "http://localhost:8070/get-data/"+attribute+"/"+table, true);
    xhttp.send();
}

function set_limit(limit){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // response = JSON.parse(this.responseText);
            // command_response(response.message);      
            json_to_table(this.responseText);
            // document.getElementById("data-output-text").innerHTML = this.responseText;
       }
       else if(this.readyState == 4 && this.status != 200){
            command_response("Failed connecting database");
       }
    };
    xhttp.open("GET", "http://localhost:8070/set-limit/"+limit, true);
    xhttp.send();
}

// function linestring(){
//     $.ajax("http://localhost:8070/linestring"
//     ).done(function(data){
//         command_response("Access Successfully");
//         document.getElementById("data-output-text").innerHTML = data; 
//     }).failed(function(){
//         command_response("Access Failed");
//     });
// }

// function last_position(){
//     $.ajax("http://localhost:8070/get-point"
//     ).done(function(data){
//         command_response("Access Successfully");
//         document.getElementById("data-output-text").innerHTML = data; 
//     }).failed(function(){
//         command_response("Access Failed");
//     });
// }

// function post_testing(){
//     var data = new FormData()
//     data.append('attribute',['la','li','lu'])
//     data.append('table'.['temp_table'])

//     var xhr = new XMLHttpRequest();
//     xhr.open('POST',"localhost:8070/get-data",true);
//     xhr.send(data);
//     alert(this.responseText);
// }