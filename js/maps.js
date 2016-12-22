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
function clearMap(){
    while(geom_getter.length){
        geom_getter.pop().setMap(null);
    }

    console.log("object-length --",object);
    while(object.length){
        var obj = object.pop();
        var linemarker_objs = obj.object;
        while(linemarker_objs.length){
            var single_object = linemarker_objs.pop();
            single_object.setMap(null);
        }
    }
}

// map attribute intialitation and function

function addLine(index,polyline_path){
    var path_line = new google.maps.Polyline({
        path:polyline_path,
        strokeColor:'#FF0000',
        StrokeOvacity: 1.000000,
        map:map
    });
    var start_info = addMarker(polyline_path[0]);
    start_info.setIcon("http://icons.iconarchive.com/icons/icons-land/vista-flags/32/Solid-Color-White-Flag-3-icon.png");
    var finish_info = addMarker(polyline_path[polyline_path.length-1]);
    finish_info.setIcon("http://icons.iconarchive.com/icons/icons8/windows-8/32/Sports-Finish-Flag-icon.png");

    if(getLineObject(index) != null){
        var obj = getLineObject(index);
        while(obj.length){
            obj.pop().setMap(null);
        }
    }else{
        var tuple_obje = {"index": index, "object":[start_info, finish_info, path_line]};
        object.push(tuple_obje);
    }
    focusMap(polyline_path);
}
function addMultiMarker(index,points){
    array_marker = [];
    for(i = 0;i<points.length;i++){
        mark = addMarker(points[i]);
        info_content="lallaa"+i.toString();
        // mark.setIcon("https://semuacoretan.files.wordpress.com/2013/01/titik.jpg");
        info = new google.maps.InfoWindow();
        google.maps.event.addListener(mark,'click',(function(mark,info_content,info){
            return function(){
                info.setContent(info_content);
                info.open(map,mark);
            }
        })(mark, info_content, info));
        array_marker.push(mark);
    }
    
    if(checkIndexMarkers(index) != -1){
        var markers = getMarkersObject(index);
        for(i = 0; i<markers.length;i++){
            markers[i].setMap(null);
        }
    }else{
        tuple_marker={"index":index,"object":array_marker};
        object.push(tuple_marker);
    }
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
        radius: 250 * 100,
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
        north: map.getCenter().lat()-0.3,
        south: map.getCenter().lat()+0.3,
        east: map.getCenter().lng()+0.3,
        west: map.getCenter().lng()-0.3
    }
    var geom_getter_dummy = new google.maps.Rectangle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        bounds: bounds,
        editable:true,
        dragable:true,
        map:map
    })
    geom_getter_dummy.addListener('click',function(){
        if(delete_status){
            geom_getter_dummy.setMap(null);
        }
    });
    geom_getter.push(geom_getter_dummy);
}
function checkIndexLine(index){
    for(i = 0; i< object.length; i++){
        var path = object[i];
        if(path.index == index){
            return i;
        }
    }
    return -1;
}
function checkIndexMarkers(index){
    for(i = 0; i< object.length; i++){
        var path = object[i];
        if(path.index == index){
            return i;
        }
    }
    return -1;
}
function getLineObject(index){
    var array_index = checkIndexLine(index);
    if(array_index == -1){
        return null;
    }else{
        return object[array_index].object;
    }
}
function getMarkersObject(index){
    var array_index = checkIndexMarkers(index);
    if(array_index == -1){
        return null;
    }else{
        return object[array_index].object;
    }
}