angular.module("life", [])
  .service("TwoDMatrix", function(){
    return {
      sub: function(matrix, index){
        var result = [], row, column;
        for (row = index[0]-1; row <= index[0]+1; row++){
          if(!matrix[row]){ continue; }

          for (column = index[1]-1; column <= index[1]+1; column++){
            if(row === index[0] && column === index[1]) { continue; }
            if(!matrix[row][column]){ continue; }

            result.push([row, column]);
          }
        }
        return result;
      },

      map: function(matrix, callback){
        return matrix.map(function(vector, row){
          return vector.map(function(element, column){
            return callback(element, [row, column], matrix);
          });
        });
      },

      seed: function(size){
        var matrix = [], row, column;
        for (row = 0; row < size; row++){
          matrix[row] = [];
          for (column = 0; column < size; column++){
            matrix[row][column] = {};
          }
        }
        return matrix;
      }
    };
  })
  .service("Judge", function(){
    return {
      true:  [false, false, true,  true],
      false: [false, false, false, true]
    };
  })
  .directive("game", ['$timeout', 'TwoDMatrix', "Judge", function($timeout, TwoDMatrix, Judge){
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
        var count_active_neighbors
          , make_judgment
          , stopped=true;

        count_active_neighbors = function(neighbors, matrix){
          return neighbors.reduce(function(count, neighbor_index){
            var element = matrix[neighbor_index[0]][neighbor_index[1]];
            if(element.is_active){
              count++
            }
            return count;
          }, 0);
        };

        make_judgment = function(element, index, matrix){
          var neighbors = element.neighbors || TwoDMatrix.sub(matrix, index);
          var active_neighbors_count = count_active_neighbors(neighbors, matrix);
          var is_active = Judge[!!element.is_active][active_neighbors_count];

          return {is_active: is_active, neighbors: neighbors};
        };

        $scope.cell_clicked = function(cell){
          stopped = true;
          cell.is_active = !cell.is_active;
        };

        $scope.reset = function(){
          stopped = true;
          $scope.matrix = TwoDMatrix.seed($scope.size);
        };

        $scope.start = function(forced){
          if(forced){ stopped = false; }
          if(stopped){ return; }

          $scope.matrix = TwoDMatrix.map($scope.matrix, make_judgment);
          $timeout(function(){ $scope.start() }, 1000);
        };

        $scope.stop = function(){
          stopped = true;
        };

        $scope.matrix = TwoDMatrix.seed($scope.size);
      }
    };
  }]);

