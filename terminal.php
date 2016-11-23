<!DOCTYPE html>
<html>
    <head>
        <title>
            Moving-Object Explorator
        </title>

        <link href="css/index.css" rel="stylesheet">
        <link href="css/terminal.css" rel="stylesheet">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
        <script src="js/maps.js" type="text/javascript"></script>
        <script src="js/menu.js" type="text/javascript"></script>
        <script src="js/database_connector.js" type="text/javascript"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="http://ajax.googleapis.com"></script>
        <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB9zQClq-5pHvwZMZ_Qi6ENSRIkAfv2Q9g&callback=initMap" type="text/javascript"></script>
    </head>
    <body>

        <div class="container">
            <div class="page-header">
                <h1>Moving-Object Explorator</h1>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="panel with-nav-tabs panel-default">
                        <div class="panel-body">
                            <div class="tab-content">
                                <div id="input-output" class="row">
                                    <div class="col-xs-6 col-md-4" id="input-group">
                                        <!-- <div class="panel panel-default" id="terminal"> -->
                                            <div class="panel-heading">
                                                Terminal
                                            </div>
                                            <div class="panel-body">
                                                <div id="terminal-monitor">
                                                    <div id="command-response"> Welcome to Moving-Object Exploratory...</div>
                                                </div>
                                                <div class="input-group">
                                                    <input id="terminal-input" type="text" class="form-control" placeholder="masukan perintah...">
                                                    <span class="input-group-btn" id="terminal-input">
                                                        <button class="btn btn-default" type="button" onClick="get_command()">
                                                            <span class=" glyphicon glyphicon-send"></span>
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>
                                        <!-- </div> -->

                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-md-8" id="output-group">
                                        <div id="data-output-maps">
                                            <div id="map-visual"></div>
                                        </div>
                                        <div id="data-output-text">test output text</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
        </div>
        <br/>
    </body>
</html>
