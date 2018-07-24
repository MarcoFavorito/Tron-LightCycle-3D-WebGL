"use strict";
(function(){
    var sm = ScreenManager.getInstance();
    var id, init, deinit;

    id = "startmenu";
    init = function(){
        var start_id = id + "-start";
        var grid_size_id = id + "-grid_size";
        var no_enemies_id = id + "-no_enemies";

        var start = document.getElementById(start_id);
        start.onclick = function(){
            var el_grid_size = document.getElementById(grid_size_id);
            var el_no_enemies = document.getElementById(no_enemies_id);
            var grid_size = parseInt(el_grid_size.options[el_grid_size.selectedIndex].value);
            var no_enemies =parseInt(el_no_enemies.options[el_no_enemies.selectedIndex].value);
            GRID_WIDTH = grid_size;
            NO_ENEMIES = no_enemies;

            //reinitialize constants with the new GRID_WIDTH
            NORTH_EAST_VERTEX = [-GRID_WIDTH/2, 0.0,  GRID_WIDTH/2];
            SOUTH_EAST_VERTEX = [-GRID_WIDTH/2, 0.0, -GRID_WIDTH/2];
            SOUTH_WEST_VERTEX = [ GRID_WIDTH/2, 0.0, -GRID_WIDTH/2];
            NORTH_WEST_VERTEX = [ GRID_WIDTH/2, 0.0,  GRID_WIDTH/2];

            GRID_WALLS = [
                [ NORTH_WEST_VERTEX, SOUTH_WEST_VERTEX ],
                [ NORTH_WEST_VERTEX, NORTH_EAST_VERTEX ],
                [ SOUTH_EAST_VERTEX, NORTH_EAST_VERTEX],
                [ SOUTH_WEST_VERTEX, SOUTH_EAST_VERTEX ]
            ];


            sm.setCurrentScreen("game");
        }

    };
    deinit = function(){

    };

    var screen = new Screen(id, init, deinit);
    saveScreen(screen);
}).call();

