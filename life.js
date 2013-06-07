(function() {

angular.module("life", [])
  .directive("game", ['$timeout', function($timeout){
    return {
      restrict: "E",
      replace: true,
      scope: {
        size: "="
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
          "<div ng-click='reset()'>Reset</div>" +
        "</div>",
      controller: function($scope){
        var get_submatrix;
        var seed_matrix;
        var map_matrix;
        var check_element;
        var count_active_neighbors;
        var stopped=true;

        get_submatrix = function(matrix, rows_range, columns_range){
          var result = [], element
          for (var row = rows_range[0]; row <= rows_range[1]; row++){
            if(!matrix[row]){
              continue;
            }
            for (var column = columns_range[0]; column <= columns_range[1]; column++){
              element = matrix[row][column];
              if(!element){
                continue;
              }
              result.push([element, [row, column]]);
            }
          }
          return result;
        };

        count_active_neighbors = function(matrix, index){
          var row = index[0];
          var column = index[1];
          var neighbors = get_submatrix(matrix, [row-1, row+1], [column-1, column+1]);

          return neighbors.reduce(function(count, neighbor){
            if(neighbor[0].is_active && !(neighbor[1][0] == row && neighbor[1][1] == column)){
              count++
            }
            return count;
          }, 0);
        };

        check_element = function(element, index){
          var is_active = false;
          var active_neighbors_count = count_active_neighbors($scope.matrix, index);

          if(element.is_active){
            if(active_neighbors_count === 2 || active_neighbors_count === 3){
              is_active = true;
            }
          } else if(active_neighbors_count === 3){
            is_active = true;
          }
          return {is_active: is_active};
        };

        map_matrix = function(matrix, callback){
          var new_matrix = matrix.map(function(vector, row){
            return vector.map(function(element, column){
              return callback(element, [row, column], matrix);
            });
          });
          return new_matrix;
        };

        seed_matrix = function(size){
          var matrix = [], row, column;
          for (row = 0; row < size; row++){
            matrix[row] = [];
            for (column = 0; column < size; column++){
              matrix[row][column] = {is_active: false}
            }
          }
          return matrix;
        };

        $scope.cell_clicked = function(cell){
          cell.is_active = !cell.is_active;
        };

        $scope.reset = function(){
          stopped = true;
          $scope.matrix = seed_matrix($scope.size);
        };

        $scope.start = function(forced){
          if(forced){ stopped = false; }
          if(stopped){ return; }

          $scope.matrix = map_matrix($scope.matrix, check_element);
          $timeout(function(){ $scope.start() }, 1000);
        };

        $scope.stop = function(){
          stopped = true;
        };

        $scope.matrix = seed_matrix($scope.size);
      }
    };
  }]);

}).call(this);
