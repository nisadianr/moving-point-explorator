var map;
var geom_getter=[];
var line=[];
var delete_status=false;

function initMap(){
    map = new google.maps.Map(document.getElementById('map-visual'), {
        center: {lat: 19.992351, lng: 116.318416},
        zoom: 8
    });
}

function addLine(index,polyline){
    line[index] = new google.maps.Polyline({
        path:polyline,
        strokeColor:'#FF0000',
        StrokeOvacity: 1.000000,
        map:map
    });
}
function removeLine(index){
    line[index].setMap(null);
    line[index] = null;
}

function addMarker(lat,lng){
    marker = new google.maps.Marker({
        position: new google.maps.LAtLng(lat,lng),
        map:map
    });
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

function deleteButtonActivate(){
    delete_status = !delete_status;
}

function clearMap(){
    geom_getter.forEach(function(x){
        x.setMap(null);
    });
    line.forEach(function(x){
        x.setMap(null);
    });

    line = [];
    geom_getter = [];
}