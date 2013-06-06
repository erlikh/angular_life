angular.module("life", [])
  .directive("game", function factory(){
    return {
      restrict: "AEC",
      replace: true,
      template: "<div>It works</div>",
      transclude: true,
      link: function(){}
    }
  });
