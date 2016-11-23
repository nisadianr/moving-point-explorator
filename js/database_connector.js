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
// function command_loading(response){
//     var text_response = "<div id=command_loading>"+response+"...</div>"
//     document.getElementById("terminal-monitor").innerHTML+=text_response;
//     if(true){
//         delete;
//     }
// }
function json_to_table(data_json){
    var i;
    var text_final = "";
    for(i=0;i<data_json;i++){
        
    }
    return text_final;
}

function command_process(command){
    switch(command){
        case "connect_database":
            call_to_connect();
            break;
        case "close_database":
            close_database();
            break;
        case "get_line_trajectory":
            linestring();
            break;
        case "get_last_position":
            last_position();
            break;
        default:
            command_response("Command not found. Please try again.");
            break;
    }
}

function call_to_connect(){
    $.ajax("http://localhost:8090/connect-database"
    ).done(function(){
        command_response("Database Connected Successfully.");
    }).failed(function(){
        command_response("Database Cannot Connected");
    });
}

function close_database(){
    $.ajax("http://localhost:8090/close-database"
    ).done(function(){
        command_response("Database Closed Successfully.");
    }).failed(function(){
        command_response("Database Closed Failed");
    });
}

function linestring(){
    $.ajax("http://localhost:8090/linestring"
    ).done(function(data){
        command_response("Access Successfully");
        document.getElementById("data-output-text").innerHTML = data; 
    }).failed(function(){
        command_response("Access Failed");
    });
}

function last_position(){
    $.ajax("http://localhost:8090/get-point"
    ).done(function(data){
        command_response("Access Successfully");
        document.getElementById("data-output-text").innerHTML = data; 
    }).failed(function(){
        command_response("Access Failed");
    });
}