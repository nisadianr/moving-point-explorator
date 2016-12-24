var map;
var geom_getter=[];
var object=[];
var delete_status=false;

// map intialitation and function
function initMap(){
    map = new google.maps.Map(document.getElementById('map-visual'), {
        center: {lat: 0, lng: 0},
        zoom: 2
    });
}
function focusMap(object){
    bounds= new google.maps.LatLngBounds();
    for(i = 0 ; i<object.length; i++){
        var point = new google.maps.LatLng(object[i]);
        bounds = bounds.extend(point);
    }
    map.fitBounds(bounds);
}
function clearGeomGetter(){
    while(geom_getter.length){
        geom_getter.pop().setMap(null);
    }
}
function clearMap(){
    clearGeomGetter();

    // clear another object
    while(object.length){
        var obj = object.pop();
        var linemarker_objs = obj.object;
        while(linemarker_objs.length){
            var single_object = linemarker_objs.pop();
            single_object.setMap(null);
        }
    }
    map.setCenter({lat:0,lng:0});
    map.setZoom(2);
}

// map attribute intialitation and function

function addLine(index,polyline_path,info_object){
    // generate line in map
    var path_line = new google.maps.Polyline({
        path:polyline_path,
        strokeColor:'blue',
        StrokeOvacity: 1.000000,
        map:map
    });
    var start_info = addMarker(polyline_path[0]);
    start_info.setIcon("http://icons.iconarchive.com/icons/icons-land/vista-flags/32/Solid-Color-White-Flag-3-icon.png");
    var finish_info = addMarker(polyline_path[polyline_path.length-1]);
    finish_info.setIcon("http://icons.iconarchive.com/icons/icons8/windows-8/32/Sports-Finish-Flag-icon.png");


    // checking and update object
    if(getObject(index) != null){
        var obj = getObject(index);
        while(obj.length){
            obj.pop().setMap(null);
        }
        object[checkIndexObject(index)].object=[start_info,finish_info,path_line];
    }else{
        var tuple_obje = {"index": index, "object":[start_info, finish_info, path_line]};
        object.push(tuple_obje);
    }
    focusMap(polyline_path);
    
    // generate info window string
    if(info_object!=null){
        x = '</th><th>';
        y= '</th></tr><tr><th>';
        string_info = "<table class=table table-bordered table-sm><tbody><tr><th>";
        string_info += "gid"+x+info_object.gid+y;
        string_info += 'start_time'+x+info_object.start_time+y;
        string_info += 'finish_time'+x+info_object.finish_time+y;
        string_info += 'total_time'+x+info_object.total_time+y;
        string_info += 'trajectory_length'+x+info_object.length+y;
        string_info +=  'object_velocity'+x+info_object.velocity;
        string_info += "</tr></tbody></table>";
    }else{
        string_info = "no information";
    }

    // generate info window
    info = new google.maps.InfoWindow();
    google.maps.event.addListener(start_info,'click',(function(start_info,string_info,info){
        return function(){
            info.setContent(string_info);
            info.open(map,start_info);
        }
    })(start_info, string_info, info));

}
function addMultiMarker(index,array_data,array_attribute){
    array_marker = [];
    points =[];
    index_point = array_attribute.indexOf("point");
    // making array of points
    for(i = 0;i<array_data.length;i++){
        points.push(array_data[i][index_point]);
    }

    // making point in maps
    for(i = 0;i<points.length;i++){
        mark = addMarker(points[i]);

        // generate info string
        if(array_attribute.length>1){
            info_content="<table class=table table-bordered table-sm>";
            table_head ="<thead><tr>";
            table_body="<tbody><tr>"
            for(j=0;j<array_attribute.length;j++){
                if(j!=index_point){
                    table_head+="<th>"+array_attribute[j].toString()+"</th>";
                    table_body+="<th>"+array_data[i][j]+"</th>";
                }
            }
            table_head+="</tr></thead>";
            table_body+="</tr></tbody>";
            info_content+=table_head+table_body+"</table>";

        }else{
            info_content = "no information";
        }
        // generate info window
        info = new google.maps.InfoWindow();
        google.maps.event.addListener(mark,'click',(function(mark,info_content,info){
            return function(){
                info.setContent(info_content);
                info.open(map,mark);
            }
        })(mark, info_content, info));

        array_marker.push(mark);
    }
    
    // check and add or update to array
    if(getObject(index) != null){
        var markers = getObject(index);
        for(i = 0; i<markers.length;i++){
            markers[i].setMap(null);
        }
        object[checkIndexObject(index)].object=array_marker;
    }else{
        tuple_marker={"index":index,"object":array_marker};
        object.push(tuple_marker);
    }

    // focusing map
    focusMap(points);
}
function addMarker(position){
    marker = new google.maps.Marker({
        position: position,
        map:map
    });
    return marker;
}
function addCircleGetter(){
    var geom_getter_dummy = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: map.getCenter(),
        radius: 250,
        editable: true,
        dragable: true
    });

    geom_getter_dummy.addListener('click',function(){
        if(delete_status){
            geom_getter_dummy.setMap(null);
        }
    });

    geom_getter.push(geom_getter_dummy);
}
function addRectangleGetter(){
    var bounds={
        north: map.getCenter().lat()-0.003,
        south: map.getCenter().lat()+0.003,
        east: map.getCenter().lng()+0.003,
        west: map.getCenter().lng()-0.003
    }
    var geom_getter_dummy = new google.maps.Rectangle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        bounds: bounds,
        editable:true,
        draggable:true,
        map:map
    })
    geom_getter_dummy.addListener('click',function(){
        if(delete_status){
            geom_getter_dummy.setMap(null);
        }
    });
    geom_getter.push(geom_getter_dummy);
}
function checkIndexObject(index){
    for(i = 0; i< object.length; i++){
        var path = object[i];
        if(path.index == index){
            return i;
        }
    }
    return -1;
}
function getObject(index){
    var array_index = checkIndexObject(index);
    if(array_index == -1){
        return null;
    }else{
        return object[array_index].object;
    }
}
function getCommGeomFilter(){
    var string_com = "";
    for(i=0;i<geom_getter.length;i++){
        string_com+= "ST_Intersects(point, ST_GeomFromText('POLYGON((";
        var lat_min=geom_getter[i].getBounds().getNorthEast().lat().toString();
        var lat_max=geom_getter[i].getBounds().getSouthWest().lat().toString();
        var lng_min=(geom_getter[i].getBounds().getNorthEast().lng()/2).toString();
        var lng_max=(geom_getter[i].getBounds().getSouthWest().lng()/2).toString();

        string_com+=lat_min+" "+lng_max+",";
        string_com+=lat_max+" "+lng_max+",";
        string_com+=lat_min+" "+lng_min+",";
        string_com+=lat_max+" "+lng_min+",";
        string_com+=lat_min+" "+lng_max;
        string_com+="))',4326))";
    
        if(i+1 < geom_getter.length){
            string_com+=" or "
        }
    }
    return string_com;
}