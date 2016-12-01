// command processing
function get_command(){
    // get command and print it to termninal
    var command = document.getElementById("terminal-input").value;
    var text_command = "<div id=command-input> > "+command+"</div>";
    document.getElementById("terminal-monitor").innerHTML += text_command;
    document.getElementById("terminal-input").value = "";

    // auto scroll terminal
    var terminal = document.getElementById("terminal-monitor");
    terminal.scrollTop = terminal.scrollHeight;

    // proccessing command
    command_process(command);
}

function command_process(command_text){
    command = command_text.substring(0,command_text.indexOf("("));
    variable_input = command_text.substring(command_text.indexOf("(")+1,command_text.lastIndexOf(")"));
    switch(command){
        // general functionality
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
            break;
        case "access_data":
            set_where_clause(variable_input);
            break;
        case "get_trajectory":
            var gid = variable_input.substring(0,variable_input.indexOf(","));
            var start_time = variable_input.substring(variable_input.indexOf(",")+1,variable_input.lastIndexOf(","));
            var finish_time = variable_input.substring(variable_input.lastIndexOf(",")+1);
            console.log("status -- getting variable_input");
            console.log("gid -- ",gid);
            console.log("start_time -- ", start_time);
            console.log("finish_time -- ", finish_time);
            get_trajectory(gid,start_time,finish_time);
            break;
        case "set_limit":
            set_limit(variable_input);
            break;
        // filtering
        case "pick_area":
            addCircleGetter();
            break;
        //map fuction
        case "clear_map":
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

function set_attribute_table(attribute, table){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // response = JSON.parse(this.responseText);
            command_response("Getting data success");      
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
            response = JSON.parse(this.responseText);
            command_response(response.message);      
            // json_to_table(this.responseText);
            // document.getElementById("data-output-text").innerHTML = this.responseText;
       }
       else if(this.readyState == 4 && this.status != 200){
            command_response("Failed connecting database");
       }
    };
    xhttp.open("GET", "http://localhost:8070/set-limit/"+limit, true);
    xhttp.send();
}

function set_where_clause(statement){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(this.responseText);
            command_response(response.message);
            json_to_table(this.responseText);
       }
       else if(this.readyState == 4 && this.status != 200){
            command_response("Failed connecting database");
       }
    };
    xhttp.open("GET", "http://localhost:8070/set-where-clause/"+statement, true);
    xhttp.send();
}

function get_trajectory(gid,start_time,finish_time){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // response = JSON.parse(this.responseText);
            command_response("Getting data success");      
            json_to_table(this.responseText);
            // document.getElementById("data-output-text").innerHTML = this.responseText;
       }
       else if(this.readyState == 4 && this.status != 200){
            command_response("Failed connecting database");
       }
    };
    xhttp.open("GET", "http://localhost:8070/get-trajcetory/"+gid+"/"+start_time+"/"+finish_time, true);
    xhttp.send();
}