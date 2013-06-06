(function() {

angular.module("life", [])
  .directive("game", function factory(){
    return {
      restrict: "AEC",
      replace: true,
      scope: false,
      template: "" +
        "<div ng-repeat='cell in cells'>" +
          "<div ng-class='{active: cell.is_active}' class='cell' ng-click='cell_clicked(cell)'></div>" +
        "</div>",
      transclude: false,
      link: function(){

      },
      controller: function($scope){
        $scope.cells = [{is_active: true}, {is_active: false}]

        $scope.cell_clicked = function(cell){
          cell.is_active = !cell.is_active;
        }
      }
    }
  });

}).call(this);
