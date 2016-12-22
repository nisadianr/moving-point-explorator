var data_buffer={};
var save = false;
var index_buffer = null;
// command processing
function get_command(){
    // get command and print it to termninal
    var command = document.getElementById("terminal-input").value;
    var text_command = "<div id=command-input> > "+command+"</div>";
    document.getElementById("terminal-monitor").innerHTML += text_command;
    document.getElementById("terminal-input").value = "";
    document.getElementById("data-output-text").value = "<div style=color: #707070;>Data output</div>";

    // auto scroll terminal
    var terminal = document.getElementById("terminal-monitor");
    terminal.scrollTop = terminal.scrollHeight;

    // proccessing command
    command_process(command);
}

function command_process(command_text){
    var temp_command_text = command_text.trim();
    var command = "";
    if(temp_command_text.indexOf(" ") == -1){
        command = temp_command_text;
    }else{
        if(temp_command_text.indexOf("SET") != -1){

            var variable_command = temp_command_text.substring(temp_command_text.indexOf("./")+2);
            var variable_store = temp_command_text.substring(0,temp_command_text.indexOf("./"));
            temp_command_text = variable_command.substring(variable_command.indexOf("./")+1);

            save = true;
            index_buffer = variable_store.substring(4).trim();
        }
        command = temp_command_text.substring(0,temp_command_text.indexOf(" ")).trim();
        variable_input = temp_command_text.substring(temp_command_text.indexOf(" ")+1).trim();
    }

    switch(command){
        // general functionality
        case "connect-db":
            call_to_connect(variable_input);
            break;
        case "close-db":
            close_database();
            break;
        case "get-att":
            get_attribute();
            break;
        case "access":
            access_data(variable_input);
            break;
        case "get-path":
            get_trajectory(variable_input);
            break;
        case "set-limit":
            set_limit(variable_input);
            break;
        // filtering
        case "pick-area":
            addCircleGetter();
            break;
        case "view-data":
            view_data(variable_input);
        //map fuction
        case "plot-map":
            plot_map(variable_input);
            break;
        case "clear-map":
            clearMap();
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
    xhttp.open("GET", "http://localhost:8070/close-database", true);
    xhttp.send();
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

function access_data(string_command){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            command_response("Getting data success");      
            json_to_table(this.responseText);

            // set temporal data to buffer
            if(save && index_buffer != null){
                data_buffer[index_buffer] = this.responseText;
                save = false;
                index_buffer = null;
            }
       }
       else if(this.readyState == 4 && this.status != 200){
            command_response("Failed connecting database");
       }
    };
    xhttp.open("GET", "http://localhost:8070/get-data/"+string_command, true);
    xhttp.send();
}

function set_limit(limit){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(this.responseText);
            command_response(response.message);
       }
       else if(this.readyState == 4 && this.status != 200){
            command_response("Failed connecting database");
       }
    };
    xhttp.open("GET", "http://localhost:8070/set-limit/"+limit, true);
    xhttp.send();
}

function get_trajectory(command){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // response = JSON.parse(this.responseText);
            command_response("Getting data success");      
            json_to_table(this.responseText);

            if(save && index_buffer != null){
                data_buffer[index_buffer] = this.responseText;
                save = false;
                index_buffer = null;
            }

       }
       else if(this.readyState == 4 && this.status != 200){
            command_response("Failed connecting to server");
       }
    };
    xhttp.open("GET", "http://localhost:8070/get-trajectory/"+command, true);
    xhttp.send();
}

function view_data(index){
    data_load = data_buffer;
    json_to_table(data_load[index]);
}

function plot_map(command){
    var type_vis = "none";
    var index = command;
    if(command.indexOf("--") != -1){
        type_vis = command.substring(command.indexOf("--")+2).trim();
        index = command.substring(0,command.indexOf("--")).trim();
    }

    var data_load = JSON.parse(data_buffer[index]);
    var index_point= data_load.attribute[0].indexOf("point");
    var data_load_tup= data_load.data_tuple;
    var array_point = [];

    switch(type_vis){
        case "line":
            for(i = 0 ; i<data_load_tup.length;i++){
                data = JSON.parse(data_load_tup[i][index_point]);
                array_point.push(data);
            }
            addLine(index,array_point);
            command_response("Line already plotted");
            break;
        case "point":
            for(i = 0;i<data_load_tup.length;i++){
                data = JSON.parse(data_load_tup[i][index_point]);
                array_point.push(data);
            }
            addMultiMarker(index,array_point);
            // addInfoWindow(index);
            command_response("Point already plotted");
            break;
        default:
            command_response("Plot marker not ready");
            break;
        
    }
}