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
    if(temp_command_text.indexOf("(") == -1){
        command = temp_command_text;
    }else{
        if(temp_command_text.indexOf("SET") != -1){

            var variable_command = temp_command_text.substring(temp_command_text.indexOf("./")+2,temp_command_text.lastIndexOf(")")).trim();
            var variable_store = temp_command_text.substring(0,temp_command_text.indexOf("./"));
            temp_command_text = variable_command.substring(0,variable_command.lastIndexOf(")")+1);

            save = true;
            index_buffer = variable_store.substring(4,variable_store.indexOf(",")).trim();
        }
        command = temp_command_text.substring(0,temp_command_text.indexOf("(")).trim();
        variable_input = temp_command_text.substring(temp_command_text.indexOf("(")+1,temp_command_text.lastIndexOf(")")).trim();
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
            addRectangleGetter();
            break;
        case "view-data":
            json_to_table(data_buffer[variable_input]);
            break;
        //map fuction
        case "plot-map":
            plot_map(variable_input);
            break;
        case "change-color":
            changeColorObject(variable_input.substring(0,variable_input.indexOf(",")),variable_input.substring(variable_input.indexOf(",")+1));
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
    var temp_string_command = string_command;
    if(geom_getter.length>0){
        if(temp_string_command.split("{").length-1== 2 ){
            // filter not ready
            temp_string_command+="{"+getCommGeomFilter()+"}";
        }else{
            temp_string_command=string_command.substring(0,string_command.lastIndexOf("{")+1);
            temp_string_command+=getCommGeomFilter()+" and ";
            temp_string_command+=string_command.substring(string_command.lastIndexOf("{")+1);
        }
    }
    console.log("after add pick area -- ",temp_string_command);
    // clearGeomGetter();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(JSON.parse(this.responseText).message == null){
                json_to_table(JSON.parse(this.responseText));
                command_response("Getting data success");
            }else{
                command_response(JSON.parse(this.responseText).message);
            }      

            // set temporal data to buffer
            if(save && index_buffer != null){
                data_buffer[index_buffer] = JSON.parse(this.responseText);
                save = false;
                index_buffer = null;
            }
       }
       else if(this.readyState == 4 && this.status != 200){
            command_response("Failed connecting database");
       }
    };
    xhttp.open("GET", "http://localhost:8070/get-data/"+temp_string_command, true);
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
            response=JSON.parse(this.responseText);
            json_to_table(response);
            
            if(save && index_buffer != null){
                console.log("tralalala");
                data_buffer[index_buffer] = response;
                count_length(index_buffer);
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
function get_data_buffer(index){
    return data_buffer[index];
}
function plot_map(command){
    var type_vis = "none";
    var index = command;

    // check index and type
    if(command.indexOf(",") != -1){
        type_vis = command.substring(command.indexOf(",")+1).trim();
        index = command.substring(0,command.indexOf(",")).trim();
    }

    var data_load = data_buffer[index];
    console.log(data_buffer);
    var index_point= data_load.attribute[0].indexOf("point");
    var data_load_tup= data_load.data_tuple;
    var array_point = [];
    
    var info_trajectory = null;
    if(data_load.info != null){
        info_trajectory=data_load.info;
    }

    switch(type_vis){
        case "animated":
        case "line":
            for(i = 0 ; i<data_load_tup.length;i++){
                data = JSON.parse(data_load_tup[i][index_point]);
                array_point.push(data);
            }
            addLine(index,array_point,info_trajectory);
            command_response("Line already plotted");

            if(type_vis == "animated"){
                var velocity = parseFloat(info_trajectory.velocity.substring(0,info_trajectory.velocity.indexOf(" m/s")));
                animatedCircle(index, velocity*100);
                command_response("Animated line already plotted");
            }
            break;
        default:
        case "point":
            for(i = 0;i<data_load_tup.length;i++){
                var data = []
                for(j=0;j<data_load_tup[i].length;j++){
                    x = data_load_tup[i][j];
                    if(j == index_point){
                        x = JSON.parse(x);
                    }
                    data.push(x);
                }
                array_point.push(data);
            }
            addMultiMarker(index,array_point,data_load.attribute[0]);
            command_response("Point already plotted");
            break;
    }
}

function count_length(index){
    var temp =data_buffer[index];
    var array_point = data_buffer[index].data_tuple;
    // generate sql query
    var command_string = "SELECT ST_Length(ST_Transform(ST_GeomFromEWKT('SRID=4326;LINESTRING(";
    for(i = 0 ;i<array_point.length;i++){
        lat = JSON.parse(array_point[i]).lat;
        lng = JSON.parse(array_point[i]).lng/2;

        command_string+=lat.toString()+" "+lng.toString();

        if(i+1 <array_point.length){
            command_string+=",";
        }
    }
    command_string+=")'),26986)) as length_path";

    // call api
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            command_response("Getting data success");
            var total_time = data_buffer[index].info["total_time"];
            total_time=total_time.substring(0,total_time.indexOf(" seconds"));
            data_buffer[index].info["length"]=parseFloat(this.responseText.trim()).toFixed(2)+" meter";
            data_buffer[index].info["velocity"]=(parseFloat(this.responseText.trim())/parseFloat(total_time)).toFixed(2)+ " m/s";
            // return this.responseText.toString();
       }
       else if(this.readyState == 4 && this.status != 200){
            command_response("Failed connecting to server");
       }
    };
    xhttp.open("GET", "http://localhost:8070/cal_length/"+command_string, true);
    xhttp.send();
}