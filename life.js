(function() {

angular.module("life", [])
  .directive("game", function factory(){
    return {
      restrict: "E",
      replace: true,
      scope: {
        size: "@size"
      },
      template: "" +
        "<div ng-repeat='row in matrix' class='matrix'>" +
         "<div ng-repeat='cell in row'>" +
            "<div ng-class='{active: cell.is_active}' class='cell' ng-click='cell_clicked(cell)'></div>" +
          "</div>" +
        "</div>",
      link: function(){},
      controller: function($scope){
        var seed_matrix;

        seed_matrix = function(size) {
          var matrix = [];
          for(var row=0; row<size; row++){
            var current_line = [];
            for(var i=0; i<size; i++){
              current_line[i] = {is_active: false};
            }
            matrix[row] = current_line;
          }
          return matrix;
        }

        $scope.matrix = seed_matrix(10);

        $scope.cell_clicked = function(cell){
          cell.is_active = !cell.is_active;
        }
      }
    }
  });

}).call(this);
