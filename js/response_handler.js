// function convert_geom_google(string_geom){
//     var geom = string_geom.substring(0,string_geom.indexOf("("));
//     case
// }

function command_response(response){
    var text_response = "<div id=command-response> "+response+"</div>";
    document.getElementById("terminal-monitor").innerHTML+=text_response;
}

function json_to_table(data_json){
    data_after_parse = data_json;
    attribute = data_after_parse.attribute[0];
    data = data_after_parse.data_tuple;

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
