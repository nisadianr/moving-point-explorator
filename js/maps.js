// function getMiddle (polyline) {
// 	var lat_maks =polyline[0].lat;
// 	var lng_maks =polyline[0].lng;
// 	var lat_min =polyline[0].lat;
// 	var lng_min =polyline[0].lng;

// 	for(i = 0; i<polyline.length; i++){
// 		if(polyline[i].lat> lat_maks){
// 			lat_maks = polyline[i].lat;
// 		}else if(polyline[i].lat< lat_min){
// 			lat_min = polyline[i].lat
// 		}

// 		if(polyline[i].lng> lng_maks){
// 			lng_maks = polyline[i].lng;
// 		}else if(polyline[i].lng <lng_min){
// 			lng_min = polyline[i].lng;
// 		}
// 	}

// 	var  lat = lat_maks-Math.abs(lat_maks-lat_min);
// 	var lng = lng_min+Math.abs(lng_maks-lng_min);	
// 	return {'lat':lat, 'lng':lng};
// }

var map;
var geom_getter=[];
var delete_status=false;
function initMap(){
    if(document.getElementById('map-select') != null){
        initMapSelect();
    }else if(document.getElementById('map-visual') != null){
        initMapVisual();
    }
}
function initMapSelect() {
    var rectangle_getter;
    map = new google.maps.Map(document.getElementById('map-select'), {
    	center: {lat: -34.397, lng: 150.644},
    	zoom: 8
    });
}

function initMapVisual() {
    map = new google.maps.Map(document.getElementById('map-visual'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });

    for (i=0; i<7; i++){
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(-34.397+(i*0.3),150.644-(i*0.5)),
		    title:"Hello World!",
		    map:map
        });
    }
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