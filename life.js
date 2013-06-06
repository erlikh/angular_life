(function() {

angular.module("life", [])
  .directive("game", ['$timeout', function($timeout){
    return {
      restrict: "E",
      replace: true,
      scope: {
        size: "@size"
      },
      template: "" +
        "<div>" +
          "<div ng-repeat='row in matrix' class='matrix'>" +
            "<div ng-repeat='cell in row'>" +
              "<div ng-class='{active: cell.is_active}' ng-click='cell_clicked(cell)' class='cell'></div>" +
            "</div>" +
            "<br/>" +
          "</div>" +
          "<div ng-click='start(true)'>Start</div>" +
          "<div ng-click='stop()'>Stop</div>" +
        "</div>",
      link: function(){},
      controller: function($scope){
        var stopped=true, size=20; //TODO: Remove size variable.

        var get_active_neighbors = function(matrix, index){
          var elem_row = index[0],
              elem_column = index[1],
              neighbors_count = 0;

          for(var row=elem_row-1; row<=elem_row+1; row++){
            if(!matrix[row]){ continue; }

            for(var column=elem_column-1; column<=elem_column+1; column++){
              if(row === elem_row && column === elem_column){ continue; }
              var neighbor = matrix[row][column];
              if(!neighbor || !neighbor.is_active){ continue;}
              neighbors_count++
            }
          }
          return neighbors_count;
        };

        var check_element = function(element, index){
          var is_active = false;
          var active_neighbors_count = get_active_neighbors($scope.matrix, index);

          if(element.is_active){
            if(active_neighbors_count===2 || active_neighbors_count===3){
              is_active = true;
            }
          } else if(active_neighbors_count === 3) {
            is_active = true;
          }
          return {is_active: is_active};
        };

        var map_matrix = function(matrix, callback){
          var new_matrix = matrix.map(function(vector, row){
            return vector.map(function(element, column){
              return callback(element, [row, column], matrix);
            });
          });
          return new_matrix;
        };

        var seed_matrix = function(){
          var matrix = [];
          for(var row=0; row < size; row++){
            matrix[row] = [];
            for(var column=0; column<size; column++){
              matrix[row][column] = [];
            }
          }
          return map_matrix(matrix, function(){ return {is_active: false}; });
        };

        $scope.cell_clicked = function(cell){
          cell.is_active = !cell.is_active;
        };

        $scope.start = function(forced){
          if(forced){ stopped = false; }
          if(stopped){ return; }

          $scope.matrix = map_matrix($scope.matrix, check_element);
          $timeout(function(){ $scope.start() }, 1000); //TODO: Make it clean why don't window.timeout re-render the screen.
        };

        $scope.stop = function(){
          stopped = true;
        };

        $scope.matrix = seed_matrix();
        $scope.start();
      }
    };
  }]);

}).call(this);
