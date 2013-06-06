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
          "</div>" +
          "<div ng-click='start(true)'>Start</div>" +
          "<div ng-click='stop()'>Stop</div>" +
        "</div>",
      link: function(){},
      controller: function($scope){
        var map_matrix, seed_matrix, stopped=true, size=10; //TODO: Remove size variable.

        map_matrix = function(matrix, callback){
          for(var row=0; row<size; row++){
            var current_line = matrix[row] || []; //TODO: Remove default value. Used only for seeding.
            for(var column=0; column<size; column++){
              current_line[column] = callback(current_line[column], [row, column]);
            }
            matrix[row] = current_line;
          }
          return matrix;
        };

        seed_matrix = function(){
          return map_matrix([], function(){ return {is_active: false}; });
        };

        $scope.cell_clicked = function(cell){
          cell.is_active = !cell.is_active;
        };

        $scope.start = function(forced){
          if(forced){ stopped = false; }
          if(stopped){ return; }

          map_matrix($scope.matrix, function(){
            return {is_active: Math.random()*10 > 5};
          });
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
