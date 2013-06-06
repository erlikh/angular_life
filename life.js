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
      transclude: false,
      link: function(){

      },
      controller: function($scope, $element){
        $scope.matrix = [];
        var size = 10;
        for(var row=0; row<size; row++){
          var current_line = []
          for(var i=0; i<size; i++){
            current_line[i] = {is_active: false};
          }
          $scope.matrix[row] = current_line;
        }

        $scope.cell_clicked = function(cell){
          cell.is_active = !cell.is_active;
        }
      }
    }
  });

}).call(this);
