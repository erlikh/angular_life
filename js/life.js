angular.module("life", [])
  .service("PlayField", function(){
    var _clone = function(obj){
      var result = {};
      for(var key in obj){
        if(obj.hasOwnProperty(key)){
          var value = obj[key];
          if(value instanceof Function){
            value = value();
          }
          result[key] = value;
        }
      }
      return result;
    };

    return {
      count_active: function(matrix, neighbors){
        return neighbors.reduce(function(count, neighbor_index){
          var element = matrix[neighbor_index[0]][neighbor_index[1]];
          if(element.is_active){
            count++
          }
          return count;
        }, 0);
      },

      get_neighbors: function(matrix, index){
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

      seed: function(size, value){
        var matrix = [], row, column;
        for (row = 0; row < size; row++){
          matrix[row] = [];
            for (column = 0; column < size; column++){
            matrix[row][column] = _clone(value);
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
  .service("Seeder", function(){
    return {
      get: function(){
        return Math.random()*10 > 8;
      }
    };
  })
  .directive("game", ["$timeout", "Judge", "PlayField", "Seeder", function($timeout, Judge, PlayField, Seeder){
    return {
      restrict: "E",
      replace: true,
      scope: {
        delay: "=",
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
          "<div ng-click='randomize()'>Randomize</div>" +
          "<div ng-click='clear()'>Clear</div>" +
        "</div>",
      controller: function($scope){
        var make_judgment
          , is_stopped=true;

        make_judgment = function(element, index, matrix){
          var neighbors = element.neighbors || PlayField.get_neighbors(matrix, index);
          var active_count = PlayField.count_active(matrix,neighbors);
          var is_active = !!Judge[element.is_active][active_count];

          return {is_active: is_active, neighbors: neighbors};
        };

        $scope.cell_clicked = function(cell){
          is_stopped = true;
          cell.is_active = !cell.is_active;
        };

        $scope.clear = function(){
          is_stopped = true;
          $scope.matrix = PlayField.seed($scope.size, {is_active: false});
        };

        $scope.randomize = function(){
          $scope.matrix = PlayField.seed($scope.size, {is_active: Seeder.get});
        };

        $scope.start = function(forced){
          if(is_stopped && !forced){ return; }

          is_stopped = false;
          $scope.matrix = PlayField.map($scope.matrix, make_judgment);
          $timeout(function(){ $scope.start(); }, $scope.delay);
        };

        $scope.stop = function(){
          is_stopped = true;
        };

        $scope.randomize();
      }
    };
  }]);

