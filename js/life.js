angular.module("life", [])
  .service("PlayField", function(){
    return {
      count_active_neighbors: function(neighbors, matrix){
        return neighbors.reduce(function(count, neighbor_index){
          var element = matrix[neighbor_index[0]][neighbor_index[1]];
          if(element.is_active){
            count++
          }
          return count;
        }, 0);
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
      },

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
      }
    };
  })
  .service("Judge", function(){
    return {
      true:  [false, false, true,  true],
      false: [false, false, false, true]
    };
  })
  .directive("game", ["$timeout", "Judge", "PlayField", function($timeout, Judge, Playfield){
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
        var make_judgment
          , is_stopped=true;

        make_judgment = function(element, index, matrix){
          var neighbors = element.neighbors || Playfield.sub(matrix, index);
          var active_neighbors_count = Playfield.count_active_neighbors(neighbors, matrix);
          var is_active = Judge[!!element.is_active][active_neighbors_count];

          return {is_active: is_active, neighbors: neighbors};
        };

        $scope.cell_clicked = function(cell){
          is_stopped = true;
          cell.is_active = !cell.is_active;
        };

        $scope.reset = function(){
          is_stopped = true;
          $scope.matrix = Playfield.seed($scope.size);
        };

        $scope.start = function(forced){
          if(forced){ is_stopped = false; }
          if(is_stopped){ return; }

          $scope.matrix = Playfield.map($scope.matrix, make_judgment);
          $timeout(function(){ $scope.start(); }, 1000);
        };

        $scope.stop = function(){
          is_stopped = true;
        };

        $scope.matrix = Playfield.seed($scope.size);
      }
    };
  }]);

